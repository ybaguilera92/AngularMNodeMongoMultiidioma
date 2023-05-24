import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import historyApiFallback from "connect-history-api-fallback";

import fn_connect from "./config/db.js";
import corsOptions from "./config/corsOptions.js";

import userRouter from "./routers/userRoutes.js";
import reportRouter from "./routers/reportRoutes.js";

import allSeeders from "./models/seeds/allSeeds.js";

import I18n from "./node_modules/i18n/i18n.js"
import path from "path";

const app = express();
app.use(express.json());
app.use(express.json({
    limit: "4mb"
}));
app.use(express.urlencoded({
    extended: true
}));

// const i18n = new I18n({
//     locales: ['en', 'uk','es'],
//     defaultLocale: 'es',
//     directory: path.join('./', 'locales')
// });
// console.log(i18n.getLocales());
// console.log(i18n.getLocale()); // 'en'
// console.log(i18n.__('Authenticate')); // 'Hello'
//console.log(i18n.__n('You have %s message', 5));

app.use(morgan('dev'));
app.use(cors(corsOptions));

/*app.use(historyApiFallback({
    disableDotRule: true,
    verbose: true
}));*/

dotenv.config();

fn_connect();
app.listen(process.env.PORT || 4000, () => console.log("Server running on port 4000"));

allSeeders();
app.use("/API/USER", userRouter);
app.use("/API/report", reportRouter);