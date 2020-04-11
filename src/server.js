const express = require('express');
const app = express();
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

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

module.exports = { app };
