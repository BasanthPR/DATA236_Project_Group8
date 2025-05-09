// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     unique: true,
//     default: () => new mongoose.Types.ObjectId().toHexString()
//   },
//   role: { type: String, enum: ['customer', 'driver'], required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);
// export default User;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toHexString()
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['customer', 'driver', 'admin'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;