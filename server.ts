import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import driveRoutes from "./routes/drive";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/drive", driveRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
