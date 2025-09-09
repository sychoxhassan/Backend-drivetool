import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

export const getOAuthClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  return oAuth2Client;
};
