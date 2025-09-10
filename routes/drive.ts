import { Router } from "express";
import { google } from "googleapis";
import { getOAuthClient } from "../utils/googleClient";

const router = Router();

router.get("/files", async (req, res) => {
  try {
    const oauth2Client = getOAuthClient();

    // In real case, tokens should be stored in DB / session
    if (!req.query.access_token) {
      return res.status(400).json({ error: "Access token required" });
    }

    oauth2Client.setCredentials({ access_token: req.query.access_token as string });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const response = await drive.files.list({
      pageSize: 10,
      fields: "files(id, name, mimeType, webViewLink)"
    });

    res.json(response.data.files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
