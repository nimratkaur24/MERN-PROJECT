import Listing from "../models/Listing.js";
import asyncHandler from "express-async-handler";
import { NotFoundError, UnAuthorizedError } from "../utils/errorResponse.js";
import { cloudinary } from "../utils/cloudinary.js";

// @desc    Get Listings
// @route   GET /api/v1/listings
// @access  Public
export const getListings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResponse);
});

// @desc    Get User's Listings
// @route   GET /api/v1/listings/user
// @access  Public
export const getUserListings = asyncHandler(async (req, res, next) => {
  const userListings = await Listing.find({ user: req.user._id });

  if (!userListings) {
    return next(new NotFoundError("User doesn't have any listings"));
  }

  res.status(200).json({ success: true, userListings });
});

// @desc    Get Listing
// @route   GET /api/v1/listings/:id
// @access  Public
export const getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate({
    path: "user",
    select: "name phone email",
  });

  if (!listing) {
    return next(new NotFoundError("Listing not found"));
  }

  res.status(200).json({ success: true, listing });
});

// @desc    Create Listing
// @route   POST /api/v1/listings
// @access  Private
export const createListing = asyncHandler(async (req, res, next) => {
  // console.log("Listing data:", req.body.listingData);
  // console.log("Images strings:", req.body.imagesStrs, "User:", req.user);
  const listing = new Listing({
    ...req.body.listingData,
    user: req.user.id,
  });

  let images = [];
  let cloudinary_ids = [];

  const files = req.body.imagesStrs;
  const { urls, types } = files;

  // check if every uploaded file is image
  const areTypesGood = types.map((type) => {
    if (type.startsWith("image")) {
      return true;
    }
    return false;
  });

  if (!areTypesGood.includes(false)) {
    // wait for all images to upload then execute rest part of code
    await Promise.all(
      urls.map(async (url) => {
        let uploadedResponse = await cloudinary.uploader.upload(url, {
          upload_preset: "real-estates",
        });
        images.push(uploadedResponse.secure_url);
        cloudinary_ids.push(uploadedResponse.public_id);
      })
    );

    listing.images = images;
    listing.cloudinary_ids = cloudinary_ids;

    // save listing
    await listing.save();
    images = [];
    cloudinary_ids = [];
    res.status(201).json({ success: true, listing });
  } else {
    listing.images = undefined;
    listing.cloudinary_ids = undefined;
    res.status(500).json({ success: true, error: "Could not upload images" });
  }
});

// @desc    Edit Listing
// @route   PUT /api/v1/listings/:id
// @access  Private
export const editListing = asyncHandler(async (req, res, next) => {
  // console.log("Listing data:", req.body.listingAndImages.listingData);
  // console.log("Images strings:", req.body.listingAndImages.imagesInfo);

  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new NotFoundError("Listing not found"));
  }

  if (req.user._id.toString() !== listing.user._id.toString()) {
    return next(new UnAuthorizedError("Unauthorized to edit this listing"));
  }

  // new data,comes from frontend
  const reqListingData = req.body.listingAndImages.listingData;

  const images = [];
  const cloudinary_ids = [];

  const { urls, types } = req.body.listingAndImages.imagesInfo;

  // check if any new image is uploaded,if not set already uploaded listing images to reqListingData.images property
  if (urls.length === 0) {
    reqListingData.images = listing.images;
  } else {
    // check if every uploaded file is image
    const areTypesGood = types.map((type) => {
      if (type.startsWith("image")) {
        return true;
      }
      return false;
    });

    if (!areTypesGood.includes(false)) {
      // wait for all images to upload then execute rest part of code
      await Promise.all(
        urls.map(async (url) => {
          let uploadedResponse = await cloudinary.uploader.upload(url, {
            upload_preset: "real-estates",
          });
          images.push(uploadedResponse.secure_url);
          cloudinary_ids.push(uploadedResponse.public_id);
        })
      );

      // merge two arrays. Since there is a chance we have already some image urls, we just add on new urls to the ones that are already there. Same is with cloudinary_ids.
      const newImagesArray = [...listing.images, ...images];
      const newCloudinaryArray = [...listing.cloudinary_ids, ...cloudinary_ids];

      reqListingData.images = newImagesArray;
      reqListingData.cloudinary_ids = newCloudinaryArray;
    } else {
      res.status(500).json({ success: true, error: "Could not upload images" });
    }
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, reqListingData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, listing });
});

// @desc    Delete Listing
// @route   DELETE /api/v1/listings/:id
// @access  Private
export const deleteListing = asyncHandler(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new NotFoundError("Listing not found"));
  }

  if (req.user._id.toString() !== listing.user._id.toString()) {
    return next(new UnAuthorizedError("Unauthorized to delete this listing"));
  }

  await Promise.all(
    listing.cloudinary_ids.map(async (id) => {
      await cloudinary.uploader.destroy(id);
    })
  );

  await listing.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Remove Listing Image
// @route   DELETE /api/v1/listings/:id/images/:image_id
// @access  Private
export const removeListingImage = asyncHandler(async (req, res, next) => {
  // console.log("Listing id:", req.params.id);
  // console.log("Image id:", req.params.image_id);

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new NotFoundError("Listing not found"));
  }

  if (req.user._id.toString() !== listing.user._id.toString()) {
    return next(new UnAuthorizedError("Unauthorized to edit this listing"));
  }

  try {
    await cloudinary.uploader.destroy(req.params.image_id, async () => {
      const cloudinary_ids_updated = listing.cloudinary_ids.filter(
        (id) => id !== req.params.image_id
      );

      const images_updated = listing.images.filter(
        (img) => !img.includes(req.params.image_id)
      );

      listing.cloudinary_ids = cloudinary_ids_updated;
      listing.images = images_updated;

      await listing.save();
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to finish operation" });
  }
});
