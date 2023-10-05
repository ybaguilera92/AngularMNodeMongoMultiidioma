import mongoose from "mongoose";

const connect = async () => {
  try {    
    const connect_ = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${connect_.connection.host}:${connect_.connection.port}`;
    console.log(`MongoDB running on: ${url}`);
    
  } catch (e) {
    console.log(`error: ${e.message}`);
    process.exit(1);
  }
};

export default connect;