import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { validationResult } from 'express-validator';



const generateKeyPair = () => {
   return crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
   });
};

export const register = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const { publicKey, privateKey } = generateKeyPair();

      const newUser = new User({ name, email, password: hashedPassword, role, publicKey });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully', privateKey });

   } catch (error) {
      throw new Error(error);
   }
};

export const login = async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, privateKey } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (!privateKey ) {
         return res.status(400).json({ message: 'Invalid or missing private key' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

      try {
         console.log('Private Key:', privateKey);
         const sign = crypto.createSign('SHA256');
         sign.update(token);
         sign.end();
         const digitalSignature = sign.sign(privateKey, 'base64');

         res.status(200).json({ token, digitalSignature });
      } catch (cryptoError) {
         console.log('Crypto Error:', cryptoError);
         return res.status(500).json({ message: 'Invalid private key' });
      }

   } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message })
   }
};