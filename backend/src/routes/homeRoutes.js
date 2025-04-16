import express from 'express';
import { getHomeData } from '../controller/homeController.js';
import multer from 'multer';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });
// Define home route
router.get('/home', getHomeData);

export default router;
