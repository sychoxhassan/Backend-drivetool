import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import loginRoute from './routes/login';
import callbackRoute from './routes/callback';
import submitRoute from './routes/submit';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5500', credentials: true })); // Frontend URL
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true
}));

app.use('/login', loginRoute);
app.use('/auth/callback', callbackRoute);
app.use('/submit-link', submitRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
