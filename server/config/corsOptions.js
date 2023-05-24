import dotenv from "dotenv";

dotenv.config();                             //TODO: Delete  
const whitelist = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2];


const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      //puede consultar la API
      callback(null, true);
    } else {
      //No esta en lista blanca asi k no puede
      callback(new Error("Error de Cors"));
    }
  },
   
}

export default corsOptions;