import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt";


const historialSchema = new Schema(
    {
    user: {type: Schema.ObjectId, ref:'usuario'},
    password: { type:String, maxlength:64, required:true},
    createdAt: { type: Date, default: Date.now },
    }
);
historialSchema.methods.existPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password);
};
export default mongoose.model('Historial', historialSchema);


