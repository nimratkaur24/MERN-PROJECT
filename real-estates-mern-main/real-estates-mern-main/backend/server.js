import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import hpp from "hpp";
import mongoSanitze from "express-mongo-sanitize";
import xss from "xss-clean";
import path from "path";

// load env vars
dotenv.config();

// connect db
connectDB();

// Route files
import authRoutes from "./routes/auth.js";
import listingsRoutes from "./routes/listings.js";

// Express init
const app = express();

const __dirname = path.resolve();

// body parser
app.use(express.json({ limit: "40mb" }));

app.use(mongoSanitze());
app.use(hpp());
app.use(xss());

// Mount routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingsRoutes);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.get("/api/v1", (req, res) => {
    res.send("API is running");
  });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// not found & other erros handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// starting server
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
