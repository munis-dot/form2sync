import express from 'express';
import multer from 'multer';
import { 
    createStock, 
    getAllStocks, 
    getStockById, 
    updateStock, 
    deleteStock 
} from '../controller/stockController.js';

const stockRoutes = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Define routes
stockRoutes.post('/', upload.single('image'), createStock);
stockRoutes.get('/', getAllStocks);
stockRoutes.get('/:id', getStockById);
stockRoutes.put('/:id', upload.single('image'), updateStock);
stockRoutes.delete('/:id', deleteStock);

export default stockRoutes;
