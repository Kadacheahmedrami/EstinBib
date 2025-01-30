import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // Base URL for API calls
  headers: {
    "Content-Type": "application/json", // Set default content type for requests
  },
});

export default API;
