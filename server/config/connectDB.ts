import mongoose from "mongoose";

const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "ChatApp", appName: "HowRU", retryWrites: true, w: "majority" })
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
    })
    .catch((error) => {
      throw error;
    });
};

export default connectDB;