require('dotenv').config();
require('colors');

// get port from .env or development port
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// get secret key
const SECRET_KEY = process.env.SECRET_KEY || "CHANGE_ME";

function getDatabaseUri() {
    const dbUser = process.env.DATABASE_USER || 'postgres'
    const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS) : 'Youngqueen8$';
    const dbHost = process.env.DATABASE_HOST || 'localhost'
    const dbPort = process.env.DATABASE_PORT || 5432
    const dbName = process.env.DATABASE_NAME || 'autolog'

    // if DATABASE_URL use it, otherwise use what is provided
    return process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
}

// work factor for hashing
const BCRYPT_WORK_FACTOR = Number(process.env.BCRYPT_WORK_FACTOR) || 13;

console.log("App Config".red)
console.log("PORT:".blue, PORT)
console.log("SECRET_KEY:".blue, SECRET_KEY);
console.log("Database URI:".blue, getDatabaseUri())
console.log("---")

module.exports = {
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    SECRET_KEY
}