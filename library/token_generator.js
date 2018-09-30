require('dotenv').load();

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

function tokenGenerator(identity, room) {
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
        'ACaf8a3482574c2af68f08926a140cf84b',
        'SKaff070348745c626eceaa7a25464e19c',
        'gBWwxVHYkl60f5rqDUeiYWy0GcrIu2SA'

    );

    // Assign identity to the token
    token.identity = identity;

    // Grant the access token Twilio Video capabilities
    const grant = new VideoGrant();
    grant.room = room;
    token.addGrant(grant);

    // Serialize the token to a JWT string
    return token.toJwt();
}

module.exports = tokenGenerator;