import { useState } from "react";
import { Box, Typography, Rating, TextField, Button } from "@mui/material";
import { Review } from "../types";

interface ReviewListProps {
    reviews: Review[];
    onAddReview: (review: Review) => void;
}

export default function ReviewList({ reviews, onAddReview }: ReviewListProps) {
    const [newReview, setNewReview] = useState({ user: "", comment: "", rating: 3 });

    const handleSubmit = () => {
        if (!newReview.user || !newReview.comment) return alert("Todos los campos son obligatorios.");
        if (newReview.rating < 1) return alert("La calificación debe ser de al menos 1 estrella.");
        
        const reviewToAdd: Review = {
            id: Date.now().toString(),
            user: newReview.user,
            comment: newReview.comment,
            rating: newReview.rating,
        };
        
        onAddReview(reviewToAdd);
        setNewReview({ user: "", comment: "", rating: 3 });
    };

    return (
        <Box className="mt-4">
            {/* Formulario para agregar una reseña */}
            <Box className="mt-4 p-4 border rounded">
                <Typography variant="h6">Deja tu reseña</Typography>
                <TextField
                    fullWidth
                    label="Tu nombre"
                    variant="outlined"
                    size="small"
                    className="mb-2"
                    value={newReview.user}
                    onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                />
                <Rating
                    sx={{mt: 2}}
                    value={newReview.rating}
                    onChange={(_, newValue) => setNewReview({ ...newReview, rating: newValue || 1 })}
                />
                <TextField
                    fullWidth
                    label="Comentario"
                    variant="outlined"
                    multiline
                    rows={3}
                    className="mt-2"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
                <Button sx={{mt: 2, background: 'rgb(30, 41, 59)'}} variant="contained" onClick={handleSubmit}>Publicar</Button>
            </Box>
            <Typography variant="h6">Reseñas:</Typography>
            {reviews.length === 0 ? <Typography color="text.secondary">No hay reseñas aún.</Typography> : null}
            {reviews.map((review) => (
                <Box key={review.id} className="border p-2 my-2 rounded">
                    <Typography variant="subtitle2" fontWeight="bold">{review.user}</Typography>
                    <Rating value={review.rating} readOnly />
                    <Typography>{review.comment}</Typography>
                </Box>
            ))}
        </Box>
    );
}