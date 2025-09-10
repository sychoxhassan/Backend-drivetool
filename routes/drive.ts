import { Router } from "express";
import { google } from "googleapis";
import { oauth2Client } from "../utils/googleClient";

const router = Router();

// Google login
router.get("/login", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/drive.file"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes
  });
  res.redirect(url);
});

// Callback after Google login
router.get("/callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send("Missing code");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    (req.session as any).tokens = tokens;

    const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontend}/main.html`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).send("Authentication error");
  }
});

// Submit a link -> create text file in Drive
router.post("/submit", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) return res.status(401).json({ success: false, message: "Not logged in" });

  const link = req.body.link as string | undefined;
  if (!link) return res.status(400).json({ success: false, message: "Missing link" });

  try {
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const fileMetadata = { name: `link-${Date.now()}.txt` };
    const media = { mimeType: "text/plain", body: link };

    const created = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id,webViewLink"
    });

    return res.json({ success: true, file: created.data });
  } catch (err) {
    console.error("Drive submit error:", err);
    return res.status(500).json({ success: false, message: "Drive API error" });
  }
});

export default router;
