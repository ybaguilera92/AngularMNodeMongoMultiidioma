import express from "express";
import Auth from "../middleware/Auth.js";

import {
    fn_signIn,
    fn_signOut,
    fn_createOne,
    fn_changePassword,
    fn_updateOne,
    fn_getAll,
    fn_getOne,
    fn_deleteOne,
    fn_changeStatus,
    fn_perfil,
    fn_register
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", fn_signIn);
router.post("/signOut/:_res", fn_signOut);
router.post("/register", fn_register);
router.post("/createOne", Auth, fn_createOne);
router.get("/getAll", Auth, fn_getAll);

router
    .route("/modify-user/:_id")
    .post(Auth, fn_changePassword)
    .get(Auth, fn_getOne)
    .put(Auth, fn_updateOne)
    .patch(Auth, fn_changeStatus)
    .delete(Auth, fn_deleteOne);

router.get("/profile", Auth, fn_perfil);

export default router;
