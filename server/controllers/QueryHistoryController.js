const categories = require("../data/categories");
const QueryHistory = require("../models/QueryHistory");
const pluralize = require("pluralize");

const registerSearch = async (req, res) => {
    const { query } = req.params
    const { latitude, longitude } = req.body
    const userId = req.user.id
    try {
        const radiusInRadians = 3000 / 6378137;

        const matchedCategories = categories.filter(category => {
            const singular = pluralize.singular(category.name).toLowerCase();
            const plural = pluralize.plural(category.name).toLowerCase();
            const lowerQuery = query.toLowerCase();

            return singular.includes(lowerQuery) || plural.includes(lowerQuery);
        });

        const existingQuery = await QueryHistory.findOne({
            query: {
                $in: matchedCategories.flatMap(cat => [
                    new RegExp(pluralize.singular(cat.name), "i"),
                    new RegExp(pluralize.plural(cat.name), "i")
                ])
            },
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radiusInRadians]
                }
            }
        });

        if (existingQuery) {
            existingQuery.count += 1;
            await existingQuery.save();
            return res.status(200).json({
                message: 'ok'
            })
        } else {
            //TODO: Base de datos de categories
            categories.push({ name: query })
            await QueryHistory.create({
                count: 1,
                query,
                coordinates: [longitude || 0, latitude || 0],
                userId
            });
            return res.status(200).json({
                message: 'ok'
            })
        }
    } catch (error) {
        return res.status(200).json({
            message: 'error'
        })
    }
};

const getSearchNear = async (req, res) => {
    const { latitude, longitude } = req.params
    try {
        const radiusInRadians = 2000 / 6378137;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const options = {
            page,
            limit,
            sort: { createdAt: -1 }
        };

        const query = {
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radiusInRadians]
                }
            }
        };

        const results = await QueryHistory.paginate(query, options);

        return res.status(200).json({
            message: "ok",
            searches: results.docs,
            totalPages: results.totalPages,
            currentPage: results.page,
            totalResults: results.totalDocs,
            hasNextPage: results.hasNextPage,
            hasPrevPage: results.hasPrevPage
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const getGeneralSearch = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const options = {
            page,
            limit,
            sort: { createdAt: -1 }
        };

        const results = await QueryHistory.paginate({}, options);

        return res.status(200).json({
            message: "ok",
            searches: results.docs,
            totalPages: results.totalPages,
            currentPage: results.page,
            totalResults: results.totalDocs,
            hasNextPage: results.hasNextPage,
            hasPrevPage: results.hasPrevPage
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const getSearchUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        const options = {
            page,
            limit,
            sort: { createdAt: -1 }
        };
    
        const query = { userId: userId };
    
        const results = await QueryHistory.paginate(query, options);
    
        return res.status(200).json({
            message: "ok",
            searches: results.docs,
            totalPages: results.totalPages,
            currentPage: results.page,
            totalResults: results.totalDocs,
            hasNextPage: results.hasNextPage,
            hasPrevPage: results.hasPrevPage
        });
    
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    registerSearch,
    getSearchNear,
    getGeneralSearch,
    getSearchUser
}