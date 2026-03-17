// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const connectDB = async () => {
//   try {
//     const DB_URI = `${process.env.DATABASE_URL}/${process.env.DB_NAME}`;

//     if (!process.env.DATABASE_URL || !process.env.DB_NAME) {
//       throw new Error("DATABASE_URL or DB_NAME is missing in .env");
//     }

//     const connection = await mongoose.connect(DB_URI);

//     console.log(`Database connected successfully: ${connection.connection.host}`);
//   } catch (error) {
//     console.error(`Database connection failed  : ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);

    console.log("Database connected successfully");
    console.log("DB Name:", connection.connection.name);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;