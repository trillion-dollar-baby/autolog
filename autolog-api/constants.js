const PRODUCTION_CLIENT_BASE_URL = "http://localhost:3001/";
const DEVELOPMENT_CLIENT_BASE_URL = "http://localhost:3001/";
const CLIENT_BASE_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_CLIENT_BASE_URL : DEVELOPMENT_CLIENT_BASE_URL;

module.exports = {
    CLIENT_BASE_URL
}