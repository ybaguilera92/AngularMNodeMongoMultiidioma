import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
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
  count: {
    type: Number,
    default: 0
  },
  // =================================
  enabled: {
    type: Boolean,
    default: true
  },
  deleteAt: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

userSchema.methods.checkoutPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

export default mongoose.model("User", userSchema);