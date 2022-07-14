const app = require("./app");

// get port from environment variable if available
const PORT = process.env.port || 3001

// get base url from environment variable if available
const API_BASE_URL = process.env.api_base_url || `http://localhost:`

// init API client
app.listen(PORT, () => {
    console.log(`Server running on ${API_BASE_URL}${PORT}`);
})