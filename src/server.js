const express = require('express');
const app = express();
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 12;
require('dotenv').config();

const { users } = require('./services');

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(bodyParser.json())

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

app.post('/api/create-account', (req, res) => {
  const { email, password, first_name, last_name, mobile } = req.body;

  bcrypt.hash(password, saltRounds, function(err, hash){
    try {
      users.createUser(
        email,
        hash,
        first_name,
        last_name,
        mobile
      );
      console.log("Successfully saved user")
    } catch (error) {
      console.log(error);
    }
  })
});

module.exports = { app };
