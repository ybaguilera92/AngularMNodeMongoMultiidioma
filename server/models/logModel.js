import mongoose from "mongoose";

const logSchema = mongoose.Schema(
    {      
        name:     { type: String, trim: true },
        user:     { type: String, trim: true },
        viewSend: { type: String, trim: true },
        action:   { type: String, trim: true },
        response: { type: String, trim: true },
    },
    { timestamps: true }
);

export default mongoose.model("Log", logSchema);
