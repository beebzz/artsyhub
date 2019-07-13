const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  apikey: process.env.API_KEY,
  myport: process.env.PORT
};
