const { saveToDatabase, fetchFromFoursquare, fetchFromFoursquareNear, fetchTrendingFromFoursquare } = require('../helper/ownApiActions');
const OwnApi = require('../models/OwnApi');
const NewQuery = require('../models/NewQuery');
const QueryHistory = require('../models/QueryHistory');
const categories = require('../data/categories');
const pluralize = require("pluralize");

const searchQuery = async (req, res) => {
    const { query } = req.params
    const { latitude, longitude } = req.query
    const userId = req.user.id
    try {
        const radiusInRadians = 3000 / 6378137;

        const matchedCategories = categories.filter(category => {
            const singular = pluralize.singular(category.name).toLowerCase();
            const plural = pluralize.plural(category.name).toLowerCase();
            const lowerQuery = query.toLowerCase();

            return singular.includes(lowerQuery) || plural.includes(lowerQuery);
        });

        let queryFilters = matchedCategories.flatMap(cat => [
            { query: { $regex: new RegExp(pluralize.singular(cat.name), "i") } },
            { query: { $regex: new RegExp(pluralize.plural(cat.name), "i") } }
        ]);

        let results = queryFilters.length > 0 ? await OwnApi.find({
            $or: queryFilters,
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[latitude, longitude], radiusInRadians]
                }
            }
        }).sort({ popularity: -1, rating: -1 }) : []

        if (results.length < 3) {
            const foursquareResults = await fetchFromFoursquare(query, latitude, longitude);
            if (foursquareResults.length > 0) {
                results = [...results, ...foursquareResults];
                //guardar el nuevo query
                const coordinates = [longitude || 0, latitude || 0]
                const newQuery = new NewQuery({ query, coordinates })
                await newQuery.save()
            }
        }

        // // 4️⃣ Eliminar duplicados si hay coincidencias repetidas
        const uniqueResults = results.filter((obj, index, self) =>
            index === self.findIndex((t) => t.fsq_id === obj.fsq_id)
        );

        //guardar el query
        const existingQuery = await QueryHistory.findOne({
            query: query,
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radiusInRadians]
                }
            }
        });

        if (existingQuery) {
            existingQuery.count += 1;
            await existingQuery.save();
        } else {
            //TODO: Base de datos de categories
            categories.push({ name: query })
            await QueryHistory.create({
                count: 1,
                query,
                coordinates: [longitude || 0, latitude || 0],
                userId
            });
        }

        // 5️⃣ Responder con los datos combinados
        return res.status(200).json({
            message: 'ok',
            query,
            results: uniqueResults
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchNearby = async (req, res) => {
    const { latitude, longitude } = req.query;
    const radiusInRadians = 3000 / 6378137;

    try {
        let results = await OwnApi.find({
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[latitude, longitude], radiusInRadians]
                }
            }
        }).sort({ popularity: -1 });

        // 2️⃣ Si hay menos de 3 resultados, buscar en Foursquare
        if (results.length < 3) {
            const foursquareResults = await fetchFromFoursquareNear(latitude, longitude);
            if (foursquareResults.length > 0) {
                results = [...results, ...foursquareResults];
            }
        }

        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        const uniqueResults = results.filter((obj, index, self) =>
            index === self.findIndex((t) => t.fsq_id === obj.fsq_id)
        );

        return res.status(200).json({
            message: 'ok',
            results: uniqueResults
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const searchTrends = async (req, res) => {
    try {
        // 1️⃣ Buscar tendencias en la base de datos (ordenadas por popularidad)
        let results = await OwnApi.find().sort({ popularity: -1 }).limit(50);

        if (results.length < 3) {
            const foursquareResults = await fetchTrendingFromFoursquare(latitude, longitude);
            if (foursquareResults.length > 0) {
                results = [...results, ...foursquareResults];
            }
        }
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        const uniqueResults = results.filter((obj, index, self) =>
            index === self.findIndex((t) => t.fsq_id === obj.fsq_id)
        );

        return res.status(200).json({
            message: 'ok',
            results: uniqueResults
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    searchQuery,
    searchNearby,
    searchTrends
}