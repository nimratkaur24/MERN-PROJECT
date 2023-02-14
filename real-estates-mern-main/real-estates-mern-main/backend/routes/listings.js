import express from "express";
import {
  createListing,
  deleteListing,
  editListing,
  getListing,
  getListings,
  getUserListings,
  removeListingImage,
} from "../controllers/listings.js";
import { advacnedResponse } from "../middleware/advancedResponse.js";
import { authenticate } from "../middleware/auth.js";
import Listing from "../models/Listing.js";

const router = express.Router();

router
  .route("/")
  .get(advacnedResponse(Listing), getListings)
  .post(authenticate, createListing);
router.route("/user").get(authenticate, getUserListings);
router.route("/:id/images/:image_id").delete(authenticate, removeListingImage);
router
  .route("/:id")
  .get(getListing)
  .put(authenticate, editListing)
  .delete(authenticate, deleteListing);

export default router;
