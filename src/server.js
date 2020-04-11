const express = require('express');
const app = express();
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const saltRounds = 12;
require('dotenv').config();

const { users } = require('./services');

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(bodyParser.json())
app.use(cors());

app.get('/api/status', (req, res) => {
  res.status(200).end();
});

// app.get('/token', (req, res) => {
//   const { identity, roomName } = req.query;
//   const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
//     ttl: MAX_ALLOWED_SESSION_DURATION,
//   });
//   token.identity = identity;
//   const videoGrant = new VideoGrant({ room: roomName });
//   token.addGrant(videoGrant);
//   res.send(token.toJwt());
//   console.log(`issued token for ${identity} in room ${roomName}`);
// });

app.post('/api/create-account', async (req, res) => {
  const { email, password, first_name, last_name, mobile, type } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    await users.createUser(
      email,
      hash,
      first_name,
      last_name,
      mobile,
      type
    );

    res.status(200).json('Successfully created user!');
  } catch (error) {
    console.error(error);
    res.status(500).json('Something went wrong');
  }
});

app.post('/api/login', async (req, res) => {
  console.log('POST - /api/login');
  const { email, password } = req.body;

  try {
    const user = await users.findUser(email);

    if (user[0]) {
      const result = await bcrypt.compare(password, user[0].password);
      if (result) {
        res.status(200).send(result);
      } else {
        console.log('Incorrect password');
        res.status(400).json('Incorrect username or password');
      }
    } else {
      console.log('No user found');
      res.status(400).json('Incorrect username or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Something went wrong');
  }
});

module.exports = { app };
