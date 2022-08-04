export const PRODUCTION_CLIENT_BASE_URL = "http://localhost:5173/";
export const DEVELOPMENT_CLIENT_BASE_URL = "http://localhost:5173/";

export const API_BASE_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_API_BASE_URL : DEVELOPMENT_API_BASE_URL;