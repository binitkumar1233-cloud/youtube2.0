import axiosLib from "axios";

const axiosInstance = axiosLib.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;