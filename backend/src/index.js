// import dotenv from 'dotenv';
// import connectDB from './db/db.js';
// import app from './app.js';
// dotenv.config();
// connectDB();
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

// Connect DB
connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});