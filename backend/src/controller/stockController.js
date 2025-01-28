import Stock from '../models/StockSchema.js';

export const createStock = async (req, res) => {
    const { name, quantity, price, formerName } = req.body;
    const image = req.file.path;

    try {
        const stock = new Stock({ name, quantity, price, image, formerName });
        await stock.save();
        res.status(201).json(stock);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const getAllStocks = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', ...searchParams } = req.query;

        const query = {};
        Object.keys(searchParams).forEach(key => {
            query[key] = new RegExp(searchParams[key], 'i'); // for case-insensitive search
        });

        req.session.latestSearches = req.session.latestSearches || [];
        req.session.latestSearches.unshift(req.query.search || '');
        if (req.session.latestSearches.length > 5) {
            req.session.latestSearches.pop();
        }

        const stocks = await Stock.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Stock.countDocuments(query);

        res.status(200).json({
            stocks,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const getStockById = async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        res.status(200).json(stock);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateStock = async (req, res) => {
    const { name, quantity, price, formerName } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ error: 'Stock item not found' });
        }

        stock.name = name;
        stock.formerName = formerName;
        stock.quantity = quantity;
        stock.price = price;
        if (image) {
            stock.image = image;
        }

        await stock.save();
        res.status(200).json(stock);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteStock = async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ error: 'Stock item not found' });
        }

        await stock.remove();
        res.status(200).json({ message: 'Stock item deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
