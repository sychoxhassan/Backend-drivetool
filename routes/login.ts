import { Router } from 'express';
import { getOAuthClient } from '../utils/driveClient';

const router = Router();

router.get('/', (req, res) => {
  const oAuth2Client = getOAuthClient();
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file']
  });
  res.redirect(authUrl);
});

export default router;
