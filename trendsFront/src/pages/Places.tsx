import { useState } from "react";
import { Container, Typography, Button, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import { Category, Place, Review } from "../types";
import ReviewList from "../components/ReviewList";
import { Link } from "react-router-dom";
import { categories as categoriesData } from "../data/categories";
import PlaceCard from "../components/PlaceCard";

export default function Places() {

    const CATEGORIES = categoriesData

    const [ placesData,  ] = useState<Place[]>([]);
    const [category, setCategory] = useState<Category>(CATEGORIES[0]);
    const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    const handleAddReview = (review: Review) => {
        if (selectedPlace) {
            const updatedPlace = {
                ...selectedPlace,
                reviews: [...selectedPlace.review, review],
            };

            setSelectedPlace(updatedPlace);
            setVisiblePlaces(
                visiblePlaces.map((c) => (c._id === updatedPlace._id ? updatedPlace : c))
            );
        }
    };

    return (
        <Container maxWidth="lg" className="py-6">
            <Typography variant="h4" fontWeight="bold" className="text-center mb-6">
                Descubre Lugares Geniales
            </Typography>

            <Box className="flex flex-wrap justify-center gap-4 mb-6">
                {CATEGORIES.map((cat) => (
                    <Button key={cat.id} variant={category.name === cat.name ? "contained" : "outlined"} onClick={() => setCategory(cat)}>
                        {cat.name}
                    </Button>
                ))}
            </Box>

            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visiblePlaces.map((place) => (
                    <motion.div key={place._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onClick={() => setSelectedPlace(place)}>
                        <PlaceCard place={place} onClick={() => setSelectedPlace(place)} />
                    </motion.div>
                ))}
            </Box>

            {visiblePlaces.length < placesData.length && (
                <Box className="text-center mt-6">
                    <Button variant="contained"
                    sx={{
                        backgroundColor: "#1E293B",
                        color: "white",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            backgroundColor: "#1E293B",
                        },
                    }}
                    >
                        Cargar Más
                    </Button>
                </Box>
            )}

            {selectedPlace && (
                <Modal open={!!selectedPlace} onClose={() => setSelectedPlace(null)}>
                    <Box
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96"
                        sx={{ maxHeight: "80vh", overflowY: "auto" }}
                    >
                        <Box className="relative">
                            <Box>
                                <Typography variant="h5" fontWeight="bold">{selectedPlace.name}</Typography>
                                <Typography color="text.secondary">{selectedPlace.categories[0].name}</Typography>
                            </Box>
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={() => setSelectedPlace(null)}
                                aria-label="close"
                                sx={{
                                    position: "absolute",
                                    top: 5,
                                    right: 0,
                                    color: "black",
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Lista de reseñas con scroll interno */}
                        <Box sx={{ maxHeight: "50vh", overflowY: "auto", mt: 2, pr: 1 }}>
                            <ReviewList reviews={selectedPlace.review} onAddReview={handleAddReview} />
                        </Box>

                        <Box className="flex justify-between items-center">
                            <Button sx={{ mt: 4 }} className="mt-4" variant="contained" onClick={() => setSelectedPlace(null)}>
                                <Link to={'/tendencia-perfil'}>
                                    Ver lugar
                                </Link>
                            </Button>
                            <Button sx={{ mt: 4 }} className="mt-4" variant="contained" onClick={() => setSelectedPlace(null)}>
                                Cerrar
                            </Button>
                        </Box>

                    </Box>
                </Modal>
            )}

        </Container>
    );
}