import { Router } from 'express';
import { getOAuthClient } from '../utils/driveClient';
import { google } from 'googleapis';

const router = Router();

router.post('/', async (req, res) => {
  const { link } = req.body;
  const tokens = req.session.tokens;
  if (!tokens) return res.json({ success: false, message: 'Not logged in' });

  const oAuth2Client = getOAuthClient();
  oAuth2Client.setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  try {
    const fileMetadata = { name: link.split('/').pop() || 'file.txt' };
    const media = { mimeType: 'text/plain', body: Buffer.from(link) };
    await drive.files.create({ requestBody: fileMetadata, media });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

export default router;
