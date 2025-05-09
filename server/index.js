const express = require("express");
const path = require('path');
const { default: axios } = require("axios");
const cors = require("cors");
const cron = require('node-cron');
const Trend = require("./models/Trend");
const OwnApi = require("./models/OwnApi");
const ownApi = require("./routes/ownapi")
const post = require("./routes/post")
const queryHistory = require("./routes/queryHistory");
const user = require("./routes/user");
const place = require("./routes/place");
const cities = require("./data/cities");
const categories = require("./data/categories");

require("dotenv").config();
require('./db/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Rutas
app.use("/api/user", user);
app.use("/api/places", place);
app.use("/api/ownApi", ownApi);
app.use("/api/posts", post)
app.use("/api/queryHistory", queryHistory)

const updateTrends = async (locality) => {
  categories.forEach(async (category) => {
    try {
      const response = await axios.get(process.env.FOURSQUARE_API_URL, {
        headers: { Authorization: process.env.FOURSQUARE_API_KEY },
        params: {
          query: category.name,
          ll: `${locality.lat},${locality.lon}`,
          radius: 3000,
          limit: 50,
          fields: 'fsq_id,name,rating,location,geocodes,photos,categories,popularity,price,tips'
        }
      });

      const places = response.data.results;
      for (const place of places) {
        console.log(place)
        const trendData = {
          fsq_id: place.fsq_id,
          query: category.name,
          name: place.name,
          rating: place.rating || 0,
          popularity: place.popularity || 0,
          price: place.price || null,
          location: {
            address: place.location?.address || '',
            country: place.location?.country || '',
            cross_street: place.location?.cross_street || '',
            locality: place.location?.locality || '',
            region: place.location?.region || ''
          },
          coordinates: [place.geocodes?.main.latitude || 0, place.geocodes?.main.longitude || 0],
          categories: place.categories?.map(cat => ({ id: cat.id, name: cat.name })) || [],
          photos: place.photos?.map(photo => ({ url: photo.prefix + 'original' + photo.suffix })) || [],
          createdAt: new Date()
        };

        await Trend.findOneAndUpdate({ fsq_id: trendData.fsq_id }, trendData, { upsert: true });
      }

    } catch (error) {
      console.log(error)
    }
  })
}

const updateDataFromTrends = async () => {
  try {
    // Obtener todos los registros de la tabla trends
    const trendsData = await Trend.find();

    trendsData.forEach(async (trend) => {
      // Construir el objeto de actualización
      const update = {
        name: trend.name,
        query: trend.query,
        rating: trend.rating,
        popularity: trend.popularity,
        price: trend.price,
        location: trend.location,
        coordinates: trend.coordinates,
        categories: trend.categories,
        photos: trend.photos,
        updatedAt: new Date()
      };

      // Buscar y actualizar en OwnApi, o insertar si no existe
      await OwnApi.findOneAndUpdate(
        { fsq_id: trend.fsq_id },
        update,
        { upsert: true, new: true } // upsert: crea si no existe, new: devuelve el actualizado
      );
    })

  } catch (error) {
    console.error(error);
  }
};
//cron para actualizar la tabla trends
let contador = 0
// cron.schedule('1 */2 * * *', async () => {
//   await updateTrends(cities[contador]);
//   contador = contador === cities.length - 1 ? 0 : contador + 1;
// });
// //cron para actualizar tabla ownapi
// cron.schedule('1 0 */14 * *', async () => {
//  await updateDataFromTrends();
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));