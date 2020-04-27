const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioMobileNumber = process.env.TWILIO_MOBILE_NUMBER;

const AccessToken = require('twilio').jwt.AccessToken;
const contactClient = require('twilio')(twilioAccountSid, twilioAuthToken);
const VideoGrant = AccessToken.VideoGrant;

const getAccessToken = () => {
    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKeySID,
        twilioApiKeySecret,
        {
            ttl: MAX_ALLOWED_SESSION_DURATION,
        }
    );

    return token;
};

const getVideoGrant = (roomName) => {
    const videoGrant = new VideoGrant({ room: roomName });

    return videoGrant;
};

const sendMessageToStudent = async (className, mobileNumber, res) => {
    contactClient.messages
        .create({
            body: `You missed today's ${className.name} lesson, please make sure you catch up on content and attend the next one! If you are not able to attend for any reason please let me know!`,
            from: twilioMobileNumber,
            to: mobileNumber,
        })
        .then((message) => {
            console.log(message.sid);
            res.status(200).json('ok');
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json('An error occured contacting student');
        });
};

module.exports = {
    getAccessToken,
    getVideoGrant,
    sendMessageToStudent,
};
