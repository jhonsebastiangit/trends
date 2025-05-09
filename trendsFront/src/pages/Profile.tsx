import { useEffect, useState } from "react";
import {
    Avatar, Button, Drawer, IconButton, List, ListItem, ListItemText,
    Typography, Dialog, DialogTitle, DialogContent,
    ListItemAvatar
} from "@mui/material";
import { History, Favorite, Delete, ExpandMore, Close, InfoOutlined, Comment, Share } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Modal, TextField } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Close as CloseIcon } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";

const likedPlaces = [
    { id: 1, name: "Café Moderno", image: "https://picsum.photos/300/200?1" },
    { id: 2, name: "Museo Arte Contemporáneo", image: "https://picsum.photos/300/200?2" },
    { id: 3, name: "Parque Central", image: "https://picsum.photos/300/200?3" },
];

const visitedPlaces = [
    { id: 4, name: "Restaurante Gourmet", image: "https://picsum.photos/300/200?4", date: "Hace 2 días" },
    { id: 5, name: "Cine IMAX", image: "https://picsum.photos/300/200?5", date: "Hace 1 semana" },
    { id: 6, name: "Centro Comercial", image: "https://picsum.photos/300/200?6", date: "Hace 3 semanas" },
    { id: 7, name: "Centro 1", image: "https://picsum.photos/300/200?6", date: "Hace 3 semanas" },
    { id: 8, name: "Centro 2", image: "https://picsum.photos/300/200?7", date: "Hace 4 semanas" },
    { id: 9, name: "Centro 3", image: "https://picsum.photos/300/200?8", date: "Hace 5 semanas" },
    { id: 10, name: "Centro 4", image: "https://picsum.photos/300/200?9", date: "Hace 6 semanas" },
];

const initialsearchesHistory = [
    { name: "Café en Bogotá", date: "Hace 2 días" },
    { name: "Mejores museos", date: "Hace 1 semana" },
    { name: "Eventos en mi ciudad", date: "Hace 3 semanas" },
];

const followers = [
    { id: 1, name: "Café Moderno", image: "https://picsum.photos/50?1", category: "Cafetería", description: "Un lugar acogedor con el mejor café de la ciudad." },
    { id: 2, name: "Museo Arte Contemporáneo", image: "https://picsum.photos/50?2", category: "Museo", description: "Exposiciones únicas y eventos culturales." },
    { id: 3, name: "Restaurante Italiano", image: "https://picsum.photos/50?3", category: "Restaurante", description: "Auténtica comida italiana con ingredientes frescos." },
    { id: 4, name: "Parque Central", image: "https://picsum.photos/50?4", category: "Parque", description: "Un espacio verde perfecto para relajarse." },
    { id: 5, name: "Tienda de Moda", image: "https://picsum.photos/50?5", category: "Moda", description: "Las últimas tendencias en ropa y accesorios." },
];

interface Comment {
    text: string,
    user: string,
    createdAt: Date
}

interface Media {
    type: 'video' | 'photo'
    url: string
}

interface Like {
    user: string,
    createdAt: Date
}

interface SearchHistory {
    user: string,
    place: string,
    review?: string,
    medias: Media[]
    comments: Comment[],
    likes: Like[],
    createdAt: Date,
}

const initialSearchHistory: SearchHistory[] = [
    {
        user: 'Jhon Sebastian',
        place: 'Hamburguesas',
        review: 'Excelente lugar para compartir',
        medias: [
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?1'
            },
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?2'
            }
        ],
        comments: [{
            text: 'Me encantó y texto más y más y más y más y más largo',
            user: 'Laura Valentina',
            createdAt: new Date(Date.now())
        }],
        likes: [
            {
                user: 'Hector Mosquera',
                createdAt: new Date(Date.now())
            },
            {
                user: 'Laura Valentina',
                createdAt: new Date(Date.now())
            }
        ],
        createdAt: new Date(Date.now())
    },
    {
        user: 'Laura Valentina',
        place: 'Sushi',
        review: 'Me encantó el sushi aquí',
        medias: [
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?3'
            },
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?4'
            },
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?5'
            }
        ],
        comments: [
            {
                text: 'Me encantó',
                user: 'Jhon Sebastian',
                createdAt: new Date(Date.now())
            },
            {
                text: 'Quisiera ir',
                user: 'Hector Mosquera',
                createdAt: new Date(Date.now())
            },
            {
                text: 'Espectacular',
                user: 'Hector Mosquera',
                createdAt: new Date(Date.now())
            }
        ],
        likes: [
            {
                user: 'Hector Mosquera',
                createdAt: new Date(Date.now())
            },
            {
                user: 'Laura Valentina',
                createdAt: new Date(Date.now())
            },
            {
                user: 'Jhon Sebastia',
                createdAt: new Date(Date.now())
            }
        ],
        createdAt: new Date(Date.now())
    },
    {
        user: 'Hector Mosquera',
        place: 'Pescado',
        review: 'Excelente pescado',
        medias: [
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?6'
            },
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?7'
            },
            {
                type: 'photo',
                url: 'https://picsum.photos/700/400?8'
            }
        ],
        comments: [
            {
                text: 'Me encantó',
                user: 'Jhon Sebastian',
                createdAt: new Date(Date.now())
            },
            {
                text: 'Quisiera ir',
                user: 'Laura Valentina',
                createdAt: new Date(Date.now())
            }
        ],
        likes: [
            {
                user: 'Hector Mosquera',
                createdAt: new Date(Date.now())
            },
            {
                user: 'Laura Valentina',
                createdAt: new Date(Date.now())
            },
            {
                user: 'Jhon Sebastia',
                createdAt: new Date(Date.now())
            }
        ],
        createdAt: new Date(Date.now())
    }
]

export default function Profile() {
    const [history, setHistory] = useState(initialsearchesHistory);
    const [searchHistory, setSearchHistory] = useState(initialSearchHistory)
    const [expandedReview, setExpandedReview] = useState(false);
    const [drawerOpenPlaces, setDrawerOpenPlaces] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [, setSelectedItem] = useState<{ name: string; image?: string } | null>(null);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [drawerData, setDrawerData] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visitedIndex, setVisitedIndex] = useState(0);
    const [followersOpen, setFollowersOpen] = useState(false);
    const [openModalAlbumUserTrend, setOpenModalAlbumUserTrend] = useState(false);
    const [search, setSearch] = useState(0);
    const [searchMedia, setSearchMedia] = useState(0);
    const [, setComments] = useState<Comment[]>();
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % likedPlaces.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisitedIndex((prevIndex) => {
                if (prevIndex + 3 >= visitedPlaces.length) {
                    return 0;
                }
                return prevIndex + 3;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const openDrawer = (title: string, data: any[]) => {
        setDrawerTitle(title);
        setDrawerData(data);
        setDrawerOpen(true);
    };

    const openDrawerPlaces = (title: string, data: any[]) => {
        setDrawerTitle(title);
        setDrawerData(data);
        setDrawerOpenPlaces(true);
    };

    const getVisiblePlaces = () => {
        return [
            searchHistory[visitedIndex % searchHistory.length],
            searchHistory[(visitedIndex + 1) % searchHistory.length],
            searchHistory[(visitedIndex + 2) % searchHistory.length]
        ];
    };



    const nextReel = () => {
        const nextIndex = (searchMedia + 1) % searchHistory[search].medias.length; // Volver al primer reel si llega al final
        setSearchMedia(nextIndex);
    };

    // Cambiar al reel anterior
    const prevReel = () => {
        const prevIndex = (searchMedia - 1 + searchHistory[search].medias.length) % searchHistory[search].medias.length; // Volver al último reel si está en el primero
        setSearchMedia(prevIndex);
    };

    const addComment = () => {
        if (newComment.trim()) {
            const newCommentObject = { user: "Usuario Anónimo", text: newComment, createdAt: new Date(Date.now()) }
            const copyComments = [...searchHistory[search].comments, newCommentObject]
            setComments(copyComments);
            setNewComment("");
            const newSearchHistory = [...searchHistory]
            newSearchHistory[search].comments = copyComments
            setSearchHistory(newSearchHistory)

        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            {/* Perfil */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
                <Avatar sx={{ width: 64, height: 64 }}>U</Avatar>
                <div>
                    <Typography variant="h5" fontWeight="bold">Usuario Ejemplo</Typography>
                    <Typography variant="subtitle1" color="text.secondary"> <span className="cursor-pointer underline" onClick={() => setFollowersOpen(true)}>120 lugares visitados</span></Typography>
                </div>
                <Button variant="contained" sx={{ background: 'rgb(30, 41, 59)' }} className="ml-auto"><Link to={'/editar-perfil'}> Editar Perfil </Link></Button>
                <Button variant="contained" sx={{ background: 'rgb(30, 41, 59)' }} className="ml-auto"><Link to={'/crear-publicacion'}> Crear nueva publicación </Link></Button>
            </motion.div>

            {/* Secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Historial de búsqueda */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-4 rounded-lg shadow-md col-span-2">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6" fontWeight="bold">
                            <History className="inline-block mr-2 text-xl" /> Historial de Búsqueda
                        </Typography>
                        <IconButton onClick={() => setHistory([])}><Delete /></IconButton>
                    </div>
                    <List>
                        {history.slice(0, 3).map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={item.name} secondary={item.date} />
                            </ListItem>
                        ))}
                    </List>
                    <Button sx={{ color: 'rgb(30, 41, 59)' }} fullWidth startIcon={<ExpandMore />} onClick={() => openDrawer("Historial de búsqueda", history)}>Mostrar más</Button>
                </motion.div>

                {/* Lugares que le han gustado */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-4 rounded-lg shadow-md col-span-2">
                    <Typography variant="h6" fontWeight="bold">
                        <Favorite className="inline-block mr-2 text-xl" /> Lugares que te han gustado
                    </Typography>
                    <Swiper spaceBetween={10} slidesPerView={1} className="mt-4" onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}>
                        {likedPlaces.map((place, index) => (
                            <SwiperSlide key={place.id} className={index === currentIndex ? "block" : "hidden"}>
                                <div className="relative cursor-pointer" onClick={() => setSelectedItem(place)}>
                                    <img src={place.image} alt={place.name} className="w-full h-40 object-cover rounded-lg shadow-md" />
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">{place.name}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Button sx={{ color: 'rgb(30, 41, 59)' }} fullWidth startIcon={<ExpandMore />} onClick={() => openDrawer("Lugares que te han gustado", likedPlaces)}>Mostrar más</Button>
                </motion.div>

                {/* Lugares visitados */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-4 rounded-lg shadow-md col-span-2"
                >
                    <Typography variant="h6" fontWeight="bold">📍 Lugares visitados</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {getVisiblePlaces().map((search, index) => (
                            <Card sx={{ display: 'flex', flex: '1 0 auto', cursor: 'pointer' }} key={index}
                                onClick={() => {
                                    setSearch(index)
                                    setOpenModalAlbumUserTrend(true)
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: "1 0 auto", maxWidth: 200 }}>
                                        <Link to={'/perfil'}>
                                            <Typography component="div" variant="h5">
                                                {search.user}
                                            </Typography>
                                        </Link>
                                        <Link to={'/tendencia-perfil'}>
                                            {search.place}
                                        </Link>
                                        <Typography
                                            variant="subtitle1"
                                            component="div"
                                            sx={{
                                                color: "text.secondary",
                                                width: "100%",
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: expandedReview ? "unset" : 1,
                                                overflow: expandedReview ? "visible" : "hidden",
                                                textOverflow: expandedReview ? "unset" : "ellipsis",
                                            }}
                                        >
                                            {search.review}
                                        </Typography>
                                        {search.review && search.review.length > 20 && (
                                            <Button
                                                size="small"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setExpandedReview(!expandedReview)
                                                }
                                                }
                                                sx={{ textTransform: "none", marginTop: 1 }}
                                            >
                                                {expandedReview ? "Read Less" : "Read More"}
                                            </Button>
                                        )}
                                    </CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, gap: 3 }}>
                                        <Button className="flex items-center">
                                            <IconButton aria-label="favorite">
                                                <Favorite className="text-red-700" />
                                            </IconButton>
                                            <span>
                                                ({search.likes.length})
                                            </span>
                                        </Button>
                                        <Button className="flex items-center">
                                            <IconButton aria-label="play/pause">
                                                <Comment />
                                            </IconButton>
                                            <span>
                                                ({search.comments.length})
                                            </span>
                                        </Button>
                                        <Button className="flex items-center">
                                            <IconButton aria-label="next">
                                                <Share />
                                            </IconButton>
                                        </Button>
                                        <Button className="flex items-center">
                                            <IconButton aria-label="next">
                                                <Share />
                                            </IconButton>
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </div>
                    <Button sx={{ color: 'rgb(30, 41, 59)' }} fullWidth startIcon={<ExpandMore />} onClick={() => openDrawerPlaces("Lugares visitados", visitedPlaces)}>
                        Mostrar más
                    </Button>
                </motion.div>
            </div>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div className="p-6 w-80">
                    <Typography variant="h6" fontWeight="bold">{drawerTitle}</Typography>
                    <List>
                        {drawerData.map((item, index) => (
                            <ListItem key={index}>
                                <NavLink
                                    to={'/tendencia-perfil'}
                                >
                                    <ListItemText primary={item.name} />
                                </NavLink>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <Drawer anchor="right" open={drawerOpenPlaces} onClose={() => setDrawerOpenPlaces(false)}>
                <div className="p-6 w-80">
                    <Typography variant="h6" fontWeight="bold">{drawerTitle}</Typography>
                    <List>
                        {drawerData.map((item, index) => (
                            <ListItem key={index} sx={{ cursor: 'pointer' }} onClick={() => {
                                setSearch(index)
                                setOpenModalAlbumUserTrend(true)
                            }}>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <Dialog open={followersOpen} onClose={() => setFollowersOpen(false)} maxWidth="sm" fullWidth>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Encabezado del diálogo */}
                    <DialogTitle className="flex justify-between items-center border-b">
                        <span className="font-bold text-lg">Seguidores</span>
                        <IconButton onClick={() => setFollowersOpen(false)}>
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    {/* Contenido */}
                    <DialogContent>
                        <List className="space-y-3">
                            {followers.map((follower) => (
                                <motion.div
                                    key={follower.id}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ListItem className="bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition p-3 flex flex-wrap items-center gap-4 cursor-pointer">
                                        {/* Avatar */}
                                        <ListItemAvatar>
                                            <Avatar
                                                src={follower.image}
                                                alt={follower.name}
                                                sx={{ width: 48, height: 48 }}
                                                className="sm:w-14 sm:h-14"
                                            />
                                        </ListItemAvatar>

                                        {/* Información del seguidor */}
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {follower.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {follower.category}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.primary">
                                                        {follower.description}
                                                    </Typography>
                                                </>
                                            }
                                            className="flex-1 min-w-0"
                                        />

                                        {/* Botón "Ver más" */}
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<InfoOutlined />}
                                            className="ml-auto text-xs px-3 py-1 sm:text-sm sm:px-4"
                                        >
                                            <Link to={'/tendencia-perfil'}>Ver más</Link>
                                        </Button>
                                    </ListItem>
                                </motion.div>
                            ))}
                        </List>
                    </DialogContent>
                </motion.div>
            </Dialog>


            <Modal
                open={openModalAlbumUserTrend}
                onClose={() => setOpenModalAlbumUserTrend(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[80vh] bg-white rounded-lg shadow-lg relative">
                    <Box className='absolute top-10 md:top-2 left-1 z-50 max-w-full md:max-w-[70%] bg-black bg-opacity-50 p-4 rounded-lg text-white'>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                width: "100%",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                                overflow: 'hidden',
                                textOverflow: "ellipsis",
                                fontSize: { xs: '15px', md: '20px' }
                            }}
                        >
                            {searchHistory[search].user} - {searchHistory[search].place}
                        </Typography>
                    </Box>
                    <Box className="absolute top-2 right-0 z-50">
                        <IconButton onClick={() => setOpenModalAlbumUserTrend(false)}>
                            <CloseIcon className="text-white md:text-black" />
                        </IconButton>
                    </Box>

                    <Box className="flex flex-col md:flex-row h-full">
                        <Box className="relative inset-0 w-full md:w-[65%] h-full left-0">
                            <img
                                src={searchHistory[search]?.medias[searchMedia].url}
                                alt='descripción lugar'
                                className="h-full object-cover rounded-lg"
                            />
                            <Box className="absolute bottom-1 left-1/4 transform flex gap-4 z-50 bg-black bg-opacity-50 p-4 rounded-lg">
                                <IconButton onClick={prevReel} className="text-white">
                                    <ArrowBackIosNewIcon className="text-gray-300" />
                                </IconButton>
                                <IconButton onClick={nextReel} className="text-gray-300">
                                    <ArrowForwardIosIcon className="text-gray-300" />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box className="w-full md:w-[35%] h-4/5 md:h-[80vh] overflow-y-auto custom-scrollbar">
                            <Box className="h-4/5 mt-10 space-y-3 overflow-y-auto custom-scrollbar">
                                {searchHistory[search]?.comments.map((comment, index) => (
                                    <Card key={index} className="p-1 bg-gray-50">
                                        <CardContent>
                                            <Box className="flex items-center">
                                                <Avatar>{comment.user[0]}</Avatar>
                                                <Typography sx={{ ml: 1 }} className="ml-3 font-medium">{comment.user}</Typography>
                                            </Box>
                                            <Typography sx={{ mt: 1, ml: 1 }} className="mt-2 text-gray-700">{comment.text}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                            <Box className="flex px-1 gap-2 py-3">
                                <TextField
                                    size="small"
                                    label="Añadir comentario"
                                    fullWidth
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button variant="contained" color="primary" onClick={addComment}>
                                    Enviar
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}