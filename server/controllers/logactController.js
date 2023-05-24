import shm_logact from "../models/logact.js";
import { getAll } from "./handlerFactory.js";

const logact = async (req, view, actn, res) => {
    try {
        await new shm_logact({
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

const fn_getAll = getAll(shm_logact);

export { logact, fn_getAll };
