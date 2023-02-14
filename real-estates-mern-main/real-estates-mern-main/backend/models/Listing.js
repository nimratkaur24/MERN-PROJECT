import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    address: {
      type: String,
      required: [true, "Please provide address"],
    },
    bathrooms: { type: Number },
    bedrooms: { type: Number },
    floors: { type: Number },
    rooms: { type: Number },
    building: {
      type: String,
      required: [true, "Please provide building type"],
      enum: ["house", "apartment"],
    },
    city: {
      type: String,
      required: [true, "Please provide city"],
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
    },
    images: [
      {
        type: String,
      },
    ],
    cloudinary_ids: [
      {
        type: String,
      },
    ],
    geolocation: {
      lat: {
        type: Number,
        required: [true, "Plase provide lattitude"],
        max: [90, "Latitude cannot be higher than 90"],
        min: [-90, "Latitude cannot be lower than -90"],
      },
      lng: {
        type: Number,
        required: [true, "Plase provide longitude"],
        max: [180, "Longitude cannot be higher than 180"],
        min: [-180, "Longitude cannot be lower than -180"],
      },
    },
    offer: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    garage: {
      type: Boolean,
      default: false,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    regularPrice: {
      type: Number,
      required: [true, "Please provide price"],
      default: 0,
    },
    surface: {
      type: Number,
      required: [true, "Please provide surface"],
      default: 0,
    },
    type: {
      type: String,
      enum: ["sell", "rent"],
      default: "sell",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", ListingSchema);
