import express from "express";
import { createAd, deleteAd, getAdById, getAllAds } from "../controller/AdController.js";
import multer from 'multer';

const adRoute = express.Router();

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

adRoute.get("/",getAllAds);
adRoute.post("/", upload.single('image'), createAd)
adRoute.get('/:id', getAdById);
adRoute.delete('/:id', deleteAd);

export default adRoute;
