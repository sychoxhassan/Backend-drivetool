import { Router } from "express";
import { oauth2Client } from "../utils/googleClient";
import { google } from "googleapis";

const router = Router();

// 🔹 Step 1: Redirect to Google login
router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ],
  });
  res.redirect(url);
});

// 🔹 Step 2: Handle callback
router.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) return res.status(400).send("No code returned from Google");

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // User info fetch
  const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
  const { data } = await oauth2.userinfo.get();

  res.json({
    message: "Login successful",
    user: data,
    tokens
  });
});

export default router;
