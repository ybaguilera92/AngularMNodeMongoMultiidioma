import logSchema from "../models/logModel.js";
import { getAll } from "./handlerFactory.js";

const addLog = async (req, view, actn, res) => {
    try {
        await new logSchema({
            name: req.user ? req.user.name  : req ? req.name  : "unknow",
            user: req.user ? req.user.email : req ? req.email : req,
            viewSend: view,
            action: actn,
            response: res,
        }).save();
    } catch (e) {
        console.log(e);
    }
};

const getLogs = getAll(logSchema);

export {
    addLog,
    getLogs
};
