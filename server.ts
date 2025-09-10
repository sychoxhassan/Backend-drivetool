import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
