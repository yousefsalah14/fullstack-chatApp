import axios from "axios";
export const axiosInstance = axios.create({
    RL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://chattna.vercel.app/api",
    withCredentials :true , // to send cookie to every single request 
})
