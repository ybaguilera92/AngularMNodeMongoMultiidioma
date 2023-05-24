import mongoose from "mongoose";

const shm_logact = mongoose.Schema(
    {      
        name:     { type: String, trim: true },
        user:     { type: String, trim: true },
        viewSend: { type: String, trim: true },
        action:   { type: String, trim: true },
        response: { type: String, trim: true },
    },
    { timestamps: true }
);

export default mongoose.model("Logact", shm_logact);
