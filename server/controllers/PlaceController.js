const Place = require("../models/Place")
const fs = require('fs');

const create = async (req, res) => {
    try {
        const { name, description, phone, email, address, latitude, longitude } = req.body
        const photos = req.files?.length > 0
            ? req.files.map(file => ({
                path: file.path,
                filename: file.filename,
                size: file.size
            }))
            : [];
        const newPlace = new Place({
            name, description, phone, email, address: address || '',
            coordinates: [longitude || 0, latitude || 0],
            photos
        })
        await newPlace.save()
        return res.status(200).json({
            message: 'places',
            newPlace
        })
    } catch (error) {
        return res.status(500).json({
            message: 'No se pudo completar la acción'
        })
    }
}

const edit = async (req, res) => {
    const { idPlace } = req.params;
    const { name, description, phone, email, address, latitude, longitude } = req.body;

    try {
        // Buscar el lugar
        const place = await Place.findById(idPlace);
        if (!place) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }

        if (name) place.name = name;
        if (description) place.description = description;
        if (phone) place.phone = phone;
        if (email) place.email = email;
        if (address) place.address = address;
        place.coordinates = [longitude || 0, latitude || 0]

        // Si se envían nuevas fotos, agregarlas
        if (req.files?.length > 0) {
            if (place.photos.length > 0) {
                place.photos.forEach(photo => {
                    fs.unlink(photo.path, (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    });
                })
                await Place.updateOne({ _id: idPlace }, { $unset: { photos: "" } });
            }

            const newPhotos = req.files.map(file => ({
                path: file.path,
                filename: file.filename,
                size: file.size
            }));
            place.photos.push(...newPhotos);
        }

        // Guardar cambios en la base de datos
        await place.save();

        return res.status(200).json({
            message: "Lugar actualizado exitosamente",
            place
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar el lugar",
            error: error.message
        });
    }
};

const specialSuggest = async (req, res) => {
    const { idPlace } = req.params;
    const { comment, name, price } = req.body;

    try {
        // Buscar el lugar
        const place = await Place.findById(idPlace);
        if (!place) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }
        let photos = []
        // Si hay archivos en `req.files`, asignarlos al producto
        if (req.files && req.files.length > 0) {
            photos = req.files.map(file => ({
                path: file.path,
                filename: file.filename,
                size: file.size,
                uploadedAt: new Date()
            }));
        }

        // Crear la sugerencia especial con un solo producto
        const newSpecialSuggest = {
            comment,
            active: true,
            name,
            price,
            rating: 0,
            photos
        };

        // Agregar la sugerencia especial a `specialProducts`
        place.specialProducts.push(newSpecialSuggest);

        // Guardar cambios en MongoDB
        await place.save();

        return res.status(200).json({
            message: "Sugerencia especial agregada exitosamente",
            specialSuggest: newSpecialSuggest
        });

    } catch (error) {
        return res.status(500).json({
            message: "No se pudo agregar la sugerencia especial",
            error: error.message
        });
    }
};

const editSpecialSuggest = async (req, res) => {
    const { idPlace, idSpecialSuggest } = req.params;
    const { comment, name, price, rating, active } = req.body;

    try {
        // Buscar el lugar
        const place = await Place.findById(idPlace)
        if (!place) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }
        const suggests = place.specialProducts.map(suggest => {
            if (suggest._id.toString() === idSpecialSuggest) {
                let photos = suggest.photos
                if (req.files?.length > 0) {
                    if (suggest.photos.length > 0) {
                        suggest.photos.forEach(photo => {
                            fs.unlink(photo.path, (err) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Internal server error' });
                                }
                            });
                        })
                        suggest.photos = []
                    }
                    photos = req.files.map(file => ({
                        path: file.path,
                        filename: file.filename,
                        size: file.size
                    }));
                }
                suggest.comment = comment
                suggest.active = active
                suggest.name = name
                suggest.price = price
                suggest.rating = rating,
                    suggest.photos = photos
            }
            return suggest
        })
        place.specialProducts = suggests
        await place.save()

        return res.status(200).json({
            message: "Sugerencia especial agregada exitosamente",
            place: place
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "No se pudo agregar la sugerencia especial",
            error: error.message
        });
    }
};

const deletePlace = async (req, res) => {
    const { idPlace } = req.params;

    try {
        const place = await Place.findById(idPlace)
        if (place.photos.length > 0) {
            place.photos.forEach(photo => {
                fs.unlink(photo.path, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                });
            })
        }

        place.specialProducts.forEach(suggest => {
            if (suggest.photos.length > 0) {
                suggest.photos.forEach(photo => {
                    fs.unlink(photo.path, (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    });
                })
            }
        })

        const deletedPlace = await Place.findByIdAndDelete(idPlace);

        if (!deletedPlace) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }

        return res.status(200).json({
            message: "Lugar eliminado correctamente",
            deletedPlace
        });

    } catch (error) {
        return res.status(500).json({
            message: "No se pudo eliminar el lugar",
            error: error.message
        });
    }
};

const getPlace = async (req, res) => {
    const { idPlace } = req.params;

    try {
        const place = await Place.findById(idPlace);

        if (!place) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }

        return res.status(200).json({
            message: "Lugar encontrado",
            place
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el lugar",
            error: error.message
        });
    }
};

const getPlacesByProductName = async (req, res) => {
    const { productName } = req.params;

    try {
        // Buscar lugares que tengan un producto con el nombre dado
        const places = await Place.find({ "products.name": productName });

        if (places.length === 0) {
            return res.status(404).json({ message: "No se encontraron lugares con ese producto" });
        }

        return res.status(200).json({
            message: "Lugares encontrados",
            places
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener lugares",
            error: error.message
        });
    }
};

const getPlacesBySpecialSuggest = async (req, res) => {
    const { specialSuggestId } = req.params;

    try {
        // Buscar lugares que tengan una sugerencia especial con el ID dado
        const places = await Place.find({ "specialProducts._id": specialSuggestId });

        if (places.length === 0) {
            return res.status(404).json({ message: "No se encontraron lugares con esa sugerencia especial" });
        }

        return res.status(200).json({
            message: "Lugares encontrados",
            places
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener lugares",
            error: error.message
        });
    }
};

const getTopRatedPlaces = async (req, res) => {
    try {
        // Obtener el número de lugares a traer desde req.query.limit
        const limit = parseInt(req.query.limit) || 10;

        // Buscar los lugares con mejor rating, ordenados de mayor a menor
        const topPlaces = await Place.find().sort({ rating: -1 }).limit(limit);

        if (!topPlaces.length) {
            return res.status(404).json({ message: "No se encontraron lugares registrados" });
        }

        return res.status(200).json({
            message: `Top ${limit} lugares con mejor rating encontrados`,
            places: topPlaces
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los lugares con mejor rating",
            error: error.message
        });
    }
};

const getMostReviewedPlaces = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const places = await Place.find()
            .sort({ reviews: -1 })
            .limit(limit);

        return res.status(200).json({
            message: "Lugares con más reseñas",
            places
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo completar la acción",
            error: error.message
        });
    }
};

const getAllPlaces = async (req, res) => {
    try {
        const places = await Place.find(); // Obtiene todos los lugares

        return res.status(200).json({
            message: "Lista de todos los lugares",
            places
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo completar la acción",
            error: error.message
        });
    }
};

const getPlacesNear = async (req, res) => {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitud y longitud son requeridas" });
    }
    try {
        let places = await OwnApi.find({
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radius / 6378100] // Radio en metros convertido a radianes
                }
            }
        }).sort({ popularity: -1 });

        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener lugares cercanos", error });
    }
};


const getPlacesWithDiscounts = async (req, res) => {
    try {
        const places = await Place.find({ "specialProducts.active": true });

        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener lugares con descuentos", error });
    }
};

const getTopSoldProducts = async (req, res) => {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    try {
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }

        const topProducts = place.products
            .sort((a, b) => b.soldLastWeek - a.soldLastWeek)
            .slice(0, Number(limit));

        res.status(200).json(topProducts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos más vendidos", error });
    }
};


module.exports = {
    create,
    edit,
    specialSuggest,
    editSpecialSuggest,
    deletePlace,
    getPlace,
    getPlacesByProductName,
    getPlacesBySpecialSuggest,
    getTopRatedPlaces,
    getMostReviewedPlaces,
    getAllPlaces,
    getPlacesNear,
    getPlacesWithDiscounts,
    getTopSoldProducts
}