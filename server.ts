import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import driveRoutes from "./routes/drive";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(express.json());

app.set("trust proxy", 1);
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use("/auth", driveRoutes);
app.get("/", (req, res) => res.send("✅ Backend running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
