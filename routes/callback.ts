import { Router } from 'express';
import { getOAuthClient } from '../utils/driveClient';
import { google } from 'googleapis';

const router = Router();

router.get('/', async (req, res) => {
  const code = req.query.code as string;
  const oAuth2Client = getOAuthClient();
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    req.session.tokens = tokens;
    res.redirect('http://localhost:5500/main.html'); // Frontend dashboard
  } catch (err) {
    console.error(err);
    res.send('Error during authentication');
  }
});

export default router;
