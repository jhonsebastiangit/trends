import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, Typography, Avatar, Rating, TextField, Button, Drawer, IconButton, Modal, Box } from "@mui/material";
import { Close as CloseIcon, Edit, Favorite } from "@mui/icons-material";
import { Review } from "../types";
import ReviewList from "../components/ReviewList";
import { Link } from "react-router-dom";

const images = [
    "https://picsum.photos/700/400?1",
    "https://picsum.photos/700/400?2",
    "https://picsum.photos/700/400?3",
    "https://picsum.photos/700/400?4",
    "https://picsum.photos/700/400?5",
    "https://picsum.photos/700/400?6",
    "https://picsum.photos/700/400?7",
    "https://picsum.photos/700/400?8",
    "https://picsum.photos/700/400?9",
    "https://picsum.photos/700/400?10",
];

const reviewData: Review[] = [
    { id: "1", user: "Ana", comment: "Excelente café!", rating: 5 },
    { id: "2", user: "Carlos", comment: "Muy acogedor.", rating: 4 },
]

export default function TrendProfile() {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [comments, setComments] = useState<{ user: string; text: string }[]>([
        { user: "Juan Pérez", text: "Excelente tienda, me encantó la atención." },
        { user: "Ana Gómez", text: "Productos de calidad, muy recomendados!" },
        { user: "Carlos Díaz", text: "Buena relación calidad-precio." },
        { user: "María López", text: "Un poco caro, pero vale la pena." },
        { user: "Pedro Ramírez", text: "Atención al cliente impecable." }
    ]);
    const [newComment, setNewComment] = useState("");
    const [visibleCommentIndex, setVisibleCommentIndex] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openModalReview, setModalReview] = useState(false);
    const [reviews, setReviews] = useState(reviewData);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleCommentIndex((prevIndex) => (prevIndex + 1) % comments.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [comments]);

    const addComment = () => {
        if (newComment.trim()) {
            setComments([...comments, { user: "Usuario Anónimo", text: newComment }]);
            setNewComment("");
        }
    };

    const handleAddReview = (review: Review) => {
        if (review) {
            const updatedReview = [...reviews, review]
            setReviews(updatedReview);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-start gap-4 w-full p-4 md:p-6 bg-gray-100">
                {/* Información de la tienda */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full md:w-1/3 p-6 bg-white rounded-xl shadow-lg"
                >
                    <Box className="flex justify-between items-center">
                        <Typography variant="h4" fontWeight="bold">Tienda Elegante</Typography>
                        <Button variant="contained" sx={{ background: 'rgb(30, 41, 59)' }} className="ml-auto">
                            <Link to={'/editar-perfil-tendencia'}><Edit /></Link>
                        </Button>
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" className="mt-2">
                        📍 Ubicación: Calle Principal #123, Ciudad
                    </Typography>

                    <div className="flex flex-col items-start justify-start mt-4">
                        <Rating value={4.5} readOnly />
                        <span className="text-gray-600">4.5 (120 calificaciones)</span>
                        <div className="flex items-center gap-2">
                            <IconButton aria-label="favorite">
                                <Favorite className="text-red-700" />
                            </IconButton>
                            <span className="text-slate-800">(10)</span>
                            <Button className="text-gray-600" onClick={() => setModalReview(true)}>Reseñas</Button>
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="mt-6">
                        <Typography variant="h6" fontWeight="bold">Comentarios</Typography>
                        <Button sx={{ color: 'rgb(30, 41, 59)', border: '1px solid rgb(30, 41, 59)' }} variant="outlined" onClick={() => setDrawerOpen(true)}>
                            Mostrar más
                        </Button>

                        {/* Comentario animado */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={visibleCommentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2"
                            >
                                <Card className="p-3 bg-gray-50">
                                    <CardContent>
                                        <div className="flex items-center">
                                            <Avatar sx={{ background: 'rgb(30, 41, 59)' }}>{comments[visibleCommentIndex].user[0]}</Avatar>
                                            <Typography sx={{ ml: 1 }} className="ml-3 font-medium">{comments[visibleCommentIndex].user}</Typography>
                                        </div>
                                        <Typography sx={{ ml: 1, mt: 1 }} className="mt-2 text-gray-700">{comments[visibleCommentIndex].text}</Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>

                        {/* Agregar comentario */}
                        <div className="mt-4 flex flex-col md:flex-row gap-2">
                            <TextField
                                size="small"
                                label="Añadir comentario"
                                fullWidth
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button sx={{ background: 'rgb(30, 41, 59)' }} variant="contained" onClick={addComment}>
                                Enviar
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-[90vw] md:w-2/3 flex flex-col items-center justify-center"
                >
                    <Swiper
                        modules={[Navigation, Thumbs]}
                        navigation
                        loop
                        spaceBetween={10}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="w-full h-[250px] sm:h-[350px] flex md:h-96 rounded-lg shadow-lg"
                    >
                        {images.map((src, index) => (
                            <SwiperSlide key={index}>
                                <img src={src} alt={`Store ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Miniaturas */}
                    <Swiper
                        modules={[Navigation, Thumbs]}
                        onSwiper={setThumbsSwiper}
                        spaceBetween={8}
                        slidesPerView={3}
                        breakpoints={{
                            640: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                        watchSlidesProgress
                        className="w-full mt-4 px-2"
                    >
                        {images.map((src, index) => (
                            <SwiperSlide key={index}>
                                <img src={src} alt={`Thumb ${index + 1}`} className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-lg cursor-pointer border-2 border-gray-300 hover:border-gray-600 transition-all duration-200" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>

            {/* Drawer para mostrar todos los comentarios */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div className="w-80 p-4">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6" fontWeight="bold">
                            Todos los Comentarios
                        </Typography>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <div className="mt-4 space-y-3">
                        {comments.map((comment, index) => (
                            <Card key={index} className="p-3 bg-gray-50">
                                <CardContent>
                                    <div className="flex items-center">
                                        <Avatar sx={{ background: 'rgb(30, 41, 59)', mr: 1, mb: 1 }}>{comment.user[0]}</Avatar>
                                        <Typography className="ml-3 font-medium">{comment.user}</Typography>
                                    </div>
                                    <Typography className="mt-2 text-gray-700">{comment.text}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </Drawer>

            {reviews && (
                <Modal open={!!openModalReview} onClose={() => setModalReview(false)}>
                    <Box
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-96"
                        sx={{ maxHeight: "80vh", overflowY: "auto" }}
                    >
                        <Box className="relative">
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={() => setModalReview(false)}
                                aria-label="close"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    color: "black",
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Lista de reseñas con scroll interno */}
                        <Box sx={{ maxHeight: "50vh", overflowY: "auto", mt: 4, pr: 1 }}>
                            <ReviewList reviews={reviews} onAddReview={handleAddReview} />
                        </Box>

                        <Box className="flex justify-between items-center">
                            <Button sx={{ mt: 4, background: 'rgb(30, 41, 59)' }} variant="contained" onClick={() => setModalReview(false)}>
                                Cerrar
                            </Button>
                        </Box>

                    </Box>
                </Modal>
            )}
        </>
    );
}