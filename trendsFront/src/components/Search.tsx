import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, Button, Drawer, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, TextField } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Comment, Favorite, Share, Close as CloseIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

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

export default function Search() {
    const [, setVisibleStories] = useState(0);
    const [searchHistory, setSearchHistory] = useState(initialSearchHistory)
    const [expandedReview, setExpandedReview] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalAlbumUserTrend, setOpenModalAlbumUserTrend] = useState(false);
    const [comments, setComments] = useState<Comment[]>();
    const [search, setSearch] = useState(0);
    const [searchMedia, setSearchMedia] = useState(0);
    const [likes, setLikes] = useState<Like[]>();
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const threshold = 250;
            setVisibleStories(Math.min(Math.floor(scrollPosition / threshold), searchHistory.length));
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        <>
            <Box className="w-full h-[700px] md:h-[500px] overflow-y-auto custom-scrollbar">
                <Box className="w-full flex flex-col items-center md:items-start gap-10 pb-12">
                    {searchHistory.map((search, index) => (
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
                                    <Button className="flex items-center" onClick={(event) => {
                                        event.stopPropagation();
                                        setLikes(search.likes)
                                        setOpenModal(true)
                                    }}>
                                        <Favorite className="text-red-700" />
                                        <span>
                                            ({search.likes.length})
                                        </span>
                                    </Button>
                                    <Button className="flex items-center" onClick={(event) => {
                                        event.stopPropagation();
                                        setComments(search.comments)
                                        setDrawerOpen(true)
                                    }}>
                                        <Comment />
                                        <span>
                                            ({search.comments.length})
                                        </span>
                                    </Button>
                                    <Button className="flex items-center">
                                        <Share />
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    ))}
                </Box>
            </Box>
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

                    <Box className="mt-4 space-y-3">
                        {comments && comments.map((comment, index) => (
                            <Card key={index} className="p-3 bg-gray-50">
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Avatar sx={{ background: 'rgb(30, 41, 59)' }}>{comment.user[0]}</Avatar>
                                        <Typography className="ml-3 font-medium">{comment.user}</Typography>
                                    </div>
                                    <Typography sx={{ mt: 1 }} className="text-gray-700">{comment.text}</Typography>
                                    <Typography sx={{ mt: 1 }} className="text-gray-700">{comment.createdAt.getFullYear()}/{comment.createdAt.getMonth() + 1}/{comment.createdAt.getDate()}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </div>
            </Drawer>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[80vh] bg-white rounded-lg shadow-lg p-8 relative">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6" fontWeight="bold">
                            Likes
                        </Typography>
                        <IconButton onClick={() => setOpenModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {likes && likes.map((like, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton >
                                <ListItemIcon>
                                    <Favorite />
                                </ListItemIcon>
                                <Box className="flex items-center justify-between w-full">
                                    <ListItemText primary={like.user} />
                                    <ListItemText primary={`${like.createdAt.getFullYear()}/${like.createdAt.getMonth() + 1}/${like.createdAt.getDate()}`} />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </Box>
            </Modal>

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
        </>
    );
}