import dotenv from "dotenv";
dotenv.config();

const serverConfig = {
  PORT: process.env.PORT || 3000,
};
export default serverConfig