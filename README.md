# oauth2-linkedin

Serverside Oauth2 LinkedIn Signin using Node.js

### Overview

1. Setup/Configure your [LinkedIn App](https://developer.linkedin.com/docs/oauth2)
2. Send => (redirect) the user to the linkedin.com sign in and/or authorization URL: [signInUrl](lib/sign-in-url.spec.js)
3. Receive => `code` and `state` then use them to get an access token: [getAccessToken](lib/get-access-token.spec.js)
4. Receive => `token` and use it to make an api request for the user's profile: [getProfile](lib/get-profile.spec.js)
