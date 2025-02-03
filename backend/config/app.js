import express from 'express';
import cors from 'cors';
import routes from '../routes/index.routes.js';
import connectDB from '../config/connectDB.js';

connectDB();

const app = express();

app.use(cors({
   origin: '*',
   credentials: true
}));
app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
app.use(routes);

export default app;