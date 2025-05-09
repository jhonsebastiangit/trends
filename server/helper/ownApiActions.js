const OwnApi = require('../models/OwnApi');
require("dotenv").config();
const axios = require("axios");
const Trend = require('../models/Trend');

const fetchFromFoursquare = async (query, lat, lng) => {
    try {
        const response = await axios.get(process.env.FOURSQUARE_API_URL, {
            headers: { Authorization: process.env.FOURSQUARE_API_KEY },
            params: {
                query,
                ll: `${lat},${lng}`,
                radius: 3000,
                limit: 50,
                fields: 'fsq_id,name,rating,location,geocodes,photos,categories,popularity,price'
            }
        });

        const places = response.data.results;

        const trendEntries = places.map(place => ({
            fsq_id: place.fsq_id,
            query,
            name: place.name,
            rating: place.rating ?? 0,
            popularity: place.popularity ?? 0,
            price: place.price ?? null,
            location: {
                address: place.location?.address ?? '',
                country: place.location?.country ?? '',
                cross_street: place.location?.cross_street ?? '',
                locality: place.location?.locality ?? '',
                region: place.location?.region ?? ''
            },
            coordinates: [
                place.geocodes?.main.latitude ?? 0,
                place.geocodes?.main.longitude ?? 0
            ],
            categories: place.categories?.map(cat => ({ id: cat.id, name: cat.name })) ?? [],
            photos: place.photos?.map(photo => ({ url: `${photo.prefix}original${photo.suffix}` })) ?? [],
            createdAt: new Date()
        }));

        // Guarda en la base de datos en paralelo
        await Promise.all(
            trendEntries.flatMap(trendData => [
                Trend.findOneAndUpdate({ fsq_id: trendData.fsq_id }, trendData, { upsert: true }),
                OwnApi.findOneAndUpdate({ fsq_id: trendData.fsq_id }, trendData, { upsert: true })
            ])
        );

        return trendEntries;
    } catch (error) {
        throw error;
    }

};

const fetchFromFoursquareNear = async (lat, lng) => {
    try {
        const response = await axios.get(process.env.FOURSQUARE_API_URL, {
            headers: { Authorization: process.env.FOURSQUARE_API_KEY },
            params: {
                ll: `${lat},${lng}`,
                radius: 3000,
                limit: 50,
                fields: 'fsq_id,name,rating,location,geocodes,photos,categories,popularity,price'
            }
        });
        const places = response.data.results;
        const trendEntries = places.map(place => ({
            fsq_id: place.fsq_id,
            name: place.name,
            rating: place.rating ?? 0,
            popularity: place.popularity ?? 0,
            price: place.price ?? null,
            location: {
                address: place.location?.address ?? '',
                country: place.location?.country ?? '',
                cross_street: place.location?.cross_street ?? '',
                locality: place.location?.locality ?? '',
                region: place.location?.region ?? ''
            },
            coordinates: [
                place.geocodes?.main.latitude ?? 0,
                place.geocodes?.main.longitude ?? 0
            ],
            categories: place.categories?.map(cat => ({ id: cat.id, name: cat.name })) ?? [],
            photos: place.photos?.map(photo => ({ url: `${photo.prefix}original${photo.suffix}` })) ?? [],
            createdAt: new Date()
        }));
        return trendEntries
    } catch (error) {
        throw error;
    }
};

const fetchTrendingFromFoursquare = async () => {
    try {
        const response = await axios.get(process.env.FOURSQUARE_API_URL, {
            headers: { Authorization: process.env.FOURSQUARE_API_KEY },
            params: {
                radius: 3000,
                limit: 50,
                fields: 'fsq_id,name,rating,location,geocodes,photos,categories,popularity,price'
            }
        });
        const places = response.data.results;
        const trendEntries = places.map(place => ({
            fsq_id: place.fsq_id,
            name: place.name,
            rating: place.rating ?? 0,
            popularity: place.popularity ?? 0,
            price: place.price ?? null,
            location: {
                address: place.location?.address ?? '',
                country: place.location?.country ?? '',
                cross_street: place.location?.cross_street ?? '',
                locality: place.location?.locality ?? '',
                region: place.location?.region ?? ''
            },
            coordinates: [
                place.geocodes?.main.latitude ?? 0,
                place.geocodes?.main.longitude ?? 0
            ],
            categories: place.categories?.map(cat => ({ id: cat.id, name: cat.name })) ?? [],
            photos: place.photos?.map(photo => ({ url: `${photo.prefix}original${photo.suffix}` })) ?? [],
            createdAt: new Date()
        }));
        return trendEntries;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchFromFoursquare,
    fetchFromFoursquareNear,
    fetchTrendingFromFoursquare
}