const jwt = require("express-jwt");
const jwks = require('jwks-rsa');


module.exports = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://justwrite.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "http://localhost:3000/api/",
  issuer: "https://justwrite.us.auth0.com/",
  algorithms: ["RS256"],
});
