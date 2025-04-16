import Ad from '../models/Ad.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new ad (POST /ads)
export const createAd = async (req, res) => {
    try {
        const { title, description, postedBy } = req.body;

        if (!req.file || !title || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const ad = new Ad({ title, description, imageUrl, postedBy });
        await ad.save();

        res.status(201).json({ message: 'Ad posted successfully', ad });
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ message: 'Server error while creating ad' });
    }
};

// Get all ads (GET /ads)
export const getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.status(200).json(ads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ads' });
    }
};

// Get a single ad by ID (GET /ads/:id)
export const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ad' });
    }
};

// Delete an ad by ID (DELETE /ads/:id)
export const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);

        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        const imagePath = path.join(__dirname, '..', 'uploads', path.basename(ad.imageUrl));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await ad.deleteOne();

        res.status(200).json({ message: 'Ad deleted successfully' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ message: 'Server error while deleting ad' });
    }
};
// Update an ad by ID (PUT /ads/:id)