import mongoose from "mongoose";

export default  () => {
   mongoose.connect(process.env.MONGODB_URI,)
      .then(() => console.log("Connected to database successfully"))
      .catch((err) => {
         console.log("Issue in DB connection");
         console.error(err);
         process.exit(1);
      })
};