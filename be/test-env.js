import dotenv from "dotenv";
dotenv.config();

console.log("PORT from env:", process.env.PORT);
console.log("MONGO_URI from env:", process.env.MONGO_URI ? "Loaded" : "Not loaded");