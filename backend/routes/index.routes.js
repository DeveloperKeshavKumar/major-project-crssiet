import { Router } from 'express';
import AuthRoutes from './auth.routes.js';
import AttendanceRoutes from './attendance.routes.js';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/attendance', AttendanceRoutes);
router.get('/', (req, res) => {
   res.status(200).json({ message: 'Major Project API is running' });
});

router.use((error, req, res, next) => {
   console.log(error.stack);
   res.status(500).json({ message: "Internal Server Error" });
});

export default router;