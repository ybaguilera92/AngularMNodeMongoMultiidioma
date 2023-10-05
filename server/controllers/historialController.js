import historialSchema from "../models/historialModel.js";
import userSchema from "../models/userModel.js";

const addHistorial = async (req, res, next) => {
    try {
        await new historialSchema({
            user: req.user,
            password: req.password,
        }).save();
    } catch (e) {
        console.error(e);
        next(e);
    }
}
export default addHistorial;