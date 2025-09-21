import express from "express";
import dotenv from "dotenv";
import { conn } from "./connection/dbConnect.js";
import fileUpload from "express-fileupload";
import cors from "cors";

// Routes import
import authRoute from "./routes/authRoute.js";
import noteRoute from "./routes/noteRoute.js";
import tenantRoute from "./routes/tenantRoute.js";
import userRoute from "./routes/userRoute.js";
import healthRoute from "./routes/healthRoute.js";

dotenv.config();
conn();

const app = express();
const port = process.env.PORT;

// Enable CORS **before routes**
app.use(cors());

// JSON body middleware
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use(fileUpload());

// Routes
app.use("/", authRoute);
app.use("/notes", noteRoute);
app.use("/tenant", tenantRoute);
app.use("/", userRoute);
app.use("/health", healthRoute);

// Start server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
