import mdl_user from "../userModel.js";
import fn_generateSerial from "../../helpers/generateSerial.js";

export default async function userSeeder() {
	const data = await mdl_user.find({}).exec();
	if (data.length !== 0) {
		// Data exists, no need to seed.
		return;
	}

	await new mdl_user({
		_id:process.env._ID,
		name: process.env.NAME,
		lastName: process.env.LASTNAME,
		username: process.env.USERNAME,
		email:process.env.EMAIL,
		password:process.env.PASSWORD,
		role:process.env.ROLE,
		token:fn_generateSerial(),
	}).save();
}
