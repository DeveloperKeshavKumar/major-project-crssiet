import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true, select: false },
   role: {
      type: String,
      enum: ['professor', 'student'],
      required: true
   },
   department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
   classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
   publicKey: { type: String }, // Store user's public key for digital signatures
   createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;