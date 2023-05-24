import mongoose, {
  Schema
} from "mongoose";
import bcrypt from "bcrypt";

const shm_user = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
    // unidad: {
    //   type: Schema.ObjectId,
    //   ref: 'unidad'
    // },
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  username: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 64,
  },
  role: {
    type: String,
    require: true,
    enum: ['Administrator', 'Other']
  },
  token: {
    type: String,
  },
  // =================================
  enabled: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

shm_user.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

shm_user.methods.checkoutPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

export default mongoose.model("User", shm_user);