import Stock from '../models/StockSchema.js';

export const getHomeData = async (req, res) => {
    try {
        const latestSearches = req.session.latestSearches || [];

        // Fetch suggestions based on the latest search queries
        let suggestions = [];
        if (latestSearches.length) {
            suggestions = await Stock.find({ name: { $regex: new RegExp(latestSearches[0], 'i') } })
                                     .limit(5)
                                     .exec();
        }

        // Fetch top sale items in each category
        const topSaleItems = await Stock.aggregate([
            { $sort: { sales: -1 } }, 
            { $group: { _id: '$category', topItem: { $first: '$$ROOT' } } }
        ]);

        // Fetch list of all categories
        const categories = await Stock.distinct('category');

        res.status(200).json({
            suggestions,
            topSaleItems,
            categories
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
