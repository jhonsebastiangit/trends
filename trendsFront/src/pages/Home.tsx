import { Autocomplete, Box, TextField, ToggleButton, ToggleButtonGroup, Button, Modal, IconButton, Typography, Divider, Stack, Chip, Drawer, List, ListItem, ListItemText, ListItemIcon, Rating, Card, CardContent, Avatar, ListItemButton } from "@mui/material";
import { useEffect, useState } from "react";
import Map from "../components/Map";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import Search from "../components/Search";
import Suggest from "../components/Suggest";
import { Category, Comment, POST, Trend } from "../types";
import { categories as categoriesData } from '../data/categories'
import { Favorite } from "@mui/icons-material";

const INITIALPOST = {
    id: '',
    comment: '',
    userId: {
        id: '',
        name: '',
        photo: {
            url: ''
        }
    },
    comments: [
        {
            id: '',
            description: '',
            created_at: "",
            user: {
                id: '',
                name: '',
                photo: {
                    url: ''
                }
            }
        }
    ],
    likes: [
        {
            user: {
                id: '',
                name: '',
                photo: {
                    url: ''
                }
            },
            createdAt: ''
        }
    ],
    media: [
        {
            type: "",
            path: "",
            description: ""
        }
    ],
    createdAt: "",
    placeId: {
        _id: "",
        name: "",
        createdAt: "",
        photos: [],
        popularity: 0,
        rating: 0,
        coordinates: [],
        location: {
            address: "",
            country: "",
            cross_street: "",
            locality: "",
            region: "",
            _id: ""
        },
        review: [
            {
                id: "",
                user: {
                    id: '',
                    name: '',
                    photo: {
                        url: ''
                    }
                },
                comment: "",
                rating: 0,
            }
        ],
        categories: [
            {
                id: "",
                name: "",
                label: ""
            }
        ]
    }
}

export default function Home() {

    const CATEGORIES = categoriesData

    const [searchCriteria, setsearchCriteria] = useState("near");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<POST>(INITIALPOST);
    const [posts, setPosts] = useState<POST[]>([]);
    const [, setCurrentIndex] = useState(0);
    const [trends, setTrends] = useState<Trend[]>([]);
    const [selectedTrend, setSelectedTrend] = useState<Trend>()
    const [searchValue, setSearchValue] = useState("");
    const [searchMedia, setSearchMedia] = useState(0);
    const [visibilitySearch, setVisibilitySearch] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [drawerOpenMoreTrends, setDrawerOpenMoreTrends] = useState(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openModalTrend, setOpenModalTrend] = useState(false);
    const [currentIndexTrendPhoto, setCurrentIndexTrendPhoto] = useState(0);
    const [, setComments] = useState<Comment[]>();
    const [newComment, setNewComment] = useState("");
    const [openModalFavorite, setOpenModalFavorite] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("La geolocalización no está soportada por este navegador.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (err) => {
                setError(err.message);
            }
        );
    }, []);

    useEffect(() => {
        if (location) {
            fetchTrends();
        }
    }, [location]);

    useEffect(() => {
        if (location === null) {
            return;
        }

        fetchTrends();
    }, [searchCriteria]);

    useEffect(() => {
        if (selectedCategory && selectedCategory.name !== "" && location) {
            setSearchValue(selectedCategory.name)
            setVisibilitySearch(true)
            setsearchCriteria('near')
            fetchTrends(selectedCategory.name);
        }
    }, [selectedCategory, location]);

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchTrends = async (query: string = "") => {
        let criteria = 'searchNearby'
        if (query === "") {
            criteria = searchCriteria === 'near' ? 'searchNearby' : 'searchTrends'
        } else {
            criteria = `searchQuery/${query}`
        }
        const trends = await fetch(`http://localhost:5000/api/ownApi/${criteria}?latitude=${location?.latitude}&longitude=${location?.longitude}`, {
            headers: {
                authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY3ZGMzNjQwYjU1NjliMjk2ZGU0MDc4OSIsImlhdCI6MTc0Mjk5NzE2MSwiZXhwIjoxNzQ1NTg5MTYxfQ.QuSrQYBFZtRxaYU-YqGm7v_SFN3U7A28iirHTCDOdvA'
            }
        })
        const data = await trends.json();
        if (data.message !== "ok") {
            setError('Hubo un error. Vuelve a intentarlo más tarde')
            return;
        }
        setTrends(data.results)
    }

    const handleSearchCriteria = (
        _event: React.MouseEvent<HTMLElement>,
        newSearchCriteria: string
    ) => {
        setsearchCriteria(newSearchCriteria);
        setSearchValue("")
        setSelectedCategory(null);
    };

    const fetchPosts = async () => {
        const posts = await fetch(`http://localhost:5000/api/posts/getPosts`, {
            headers: {
                authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY3ZGMzNjQwYjU1NjliMjk2ZGU0MDc4OSIsImlhdCI6MTc0Mjk5NzE2MSwiZXhwIjoxNzQ1NTg5MTYxfQ.QuSrQYBFZtRxaYU-YqGm7v_SFN3U7A28iirHTCDOdvA'
            }
        })
        const data = await posts.json();
        if (data.message !== "ok") {
            setError('Hubo un error. Vuelve a intentarlo más tarde')
            return;
        }
        setPosts(data.results)
    }

    const openPost = (post: POST, index: number) => {
        setSelectedPost(post);
        setCurrentIndex(index);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPost(INITIALPOST);
    };

    const nextTrendPhoto = () => {
        const nextIndex = (currentIndexTrendPhoto + 1) % (selectedTrend?.photos?.length || 1);
        setCurrentIndexTrendPhoto(nextIndex);
    };

    const prevTrendPhoto = () => {
        const prevIndex = (currentIndexTrendPhoto - 1 + (selectedTrend?.photos?.length || 1)) % (selectedTrend?.photos?.length || 1);
        setCurrentIndexTrendPhoto(prevIndex);
    };

    const nextReel = () => {
        const nextIndex = (searchMedia + 1) % (selectedPost?.media.length || 0);
        setSearchMedia(nextIndex);
    };

    const prevReel = () => {
        const prevIndex = (searchMedia - 1 + (selectedPost?.media.length || 0)) % (selectedPost?.media.length || 0); // Volver al último reel si está en el primero
        setSearchMedia(prevIndex);
    };

    const addComment = async () => {
        if (newComment.trim()) {
            const newCommentObject: Comment = {
                id: '',
                description: newComment,
                user: {
                    id: '67dc3626b5569b296de40785',
                    name: 'Laura Valentina',
                    photo: {
                        url: ''
                    }
                },
                created_at: new Date(Date.now()).toString()
            }
            const copyComments = [...selectedPost.comments, newCommentObject]
            selectedPost.comments = copyComments
            setSelectedPost(selectedPost)
            setComments(copyComments);
            setNewComment("");
            await fetchComments();
        }
    };

    const fetchComments = async () => {
        await fetch(`http://localhost:5000/api/posts/comments/67f6835f01625520fc99334d`, {
            method: 'PUT',
            body: JSON.stringify({
                description: 'Me encanta',
                userId: '67dc3626b5569b296de40785'
            }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY3ZGMzNjQwYjU1NjliMjk2ZGU0MDc4OSIsImlhdCI6MTc0Mjk5NzE2MSwiZXhwIjoxNzQ1NTg5MTYxfQ.QuSrQYBFZtRxaYU-YqGm7v_SFN3U7A28iirHTCDOdvA'
            }
        })
    }

    return (
        <>
            <Box className="relative h-[70vh] md:h-screen w-full">
                <Box
                    className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-6 pt-6 pb-6 px-8 transition-all duration-500 ease-in-out ${isPanelOpen ? "opacity-0" : "opacity-100"}`}
                >
                    <Autocomplete
                        options={CATEGORIES}
                        value={selectedCategory}
                        onChange={(_, newValue) => {
                            setSelectedCategory(newValue);
                        }}
                        disablePortal
                        sx={{
                            width: 250,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "20px",
                                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                "& fieldset": {
                                    borderColor: "#1E293B",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#1E293B",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#1E293B",
                                    boxShadow: "0 0 8px rgba(255, 64, 129, 0.7)",
                                },
                            },
                        }}
                        className="bg-slate-50"
                        renderInput={(params) => <TextField {...params} label="Categoría" />}
                    />
                </Box>

                <Box
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30"
                    onClick={() => {
                        setIsPanelOpen((prev) => !prev)
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#1E293B",
                            color: "white",
                            borderRadius: "50%",
                            width: 60,
                            height: 60,
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                                backgroundColor: "#1E293B",
                            },
                        }}
                    >
                        {isPanelOpen ? <CloseIcon /> : <AddIcon />}
                    </Button>
                </Box>

                <Box className={`absolute top-0 left-0 right-0 pt-6 pb-6 px-8 bg-white bg-opacity-75 rounded-xl shadow-lg transition-all duration-500 ease-in-out ${isPanelOpen ? "opacity-100 translate-y-0 z-20" : "opacity-0 translate-y-16 z-10"}`}>
                    <Box className='flex flex-col md:flex-row items-end md:items-center justify-center gap-6'>
                        <ToggleButtonGroup
                            value={searchCriteria}
                            exclusive
                            onChange={handleSearchCriteria}
                            aria-label="searchCriteria"
                        >
                            <ToggleButton
                                value="near"
                                aria-label="near trends"
                                sx={{
                                    bgcolor: "transparent",
                                    color: "black",
                                    borderRadius: "20px",
                                    width: "100px",
                                    height: "40px",
                                    marginRight: '2px',
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    "&.Mui-selected": { bgcolor: "#1E293B", color: "white" },
                                    "&:hover": {
                                        bgcolor: "#1E293B",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    },
                                    transition: "background-color 0.3s, box-shadow 0.3s",
                                }}
                            >
                                Cerca
                            </ToggleButton>
                            <ToggleButton
                                value="general"
                                aria-label="general trend"
                                sx={{
                                    bgcolor: "transparent",
                                    color: "black",
                                    borderRadius: "20px",
                                    width: "100px",
                                    height: "40px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    "&.Mui-selected": { bgcolor: "#1E293B", color: "white" },
                                    "&:hover": {
                                        bgcolor: "#1E293B",
                                        color: "white",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    },
                                    transition: "background-color 0.3s, box-shadow 0.3s",
                                }}
                            >
                                General
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Autocomplete
                            options={CATEGORIES}
                            value={selectedCategory}
                            onChange={(_, newValue) => {
                                setSelectedCategory(newValue);
                                setSearchValue("");
                            }}
                            disablePortal
                            sx={{
                                width: 250,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "20px",
                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                    "& fieldset": {
                                        borderColor: "#1E293B",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#1E293B",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#1E293B",
                                        boxShadow: "0 0 8px rgba(255, 64, 129, 0.7)",
                                    },
                                },
                            }}
                            className="bg-slate-50"
                            renderInput={(params) => <TextField {...params} label="Categoría" />}
                        />
                    </Box>
                    <Box className="pt-7">
                        <Divider />
                        <Typography> {error} </Typography>
                        <Box className="flex gap-5 justify-start items-center py-5">
                            <Typography>
                                {searchCriteria === 'near' ? `Estas son las tendencias que hemos encontrado cerca de ti${!visibilitySearch ? '.' : ` para tu búsqueda ${searchValue.toLocaleUpperCase()}`}` : 'Estas son las tendencias del momento'}
                            </Typography>
                            <Button onClick={() => setDrawerOpenMoreTrends(true)} sx={{ color: '#1E293B' }}> Click aquí para ver más </Button>
                        </Box>
                        <Stack direction="row" className="mt-4" spacing={1}>
                            {trends.slice(0, 3).map((trendItem, index) => (
                                <Chip
                                    key={index}
                                    onClick={() => {
                                        setSelectedTrend(trendItem)
                                        setIsPanelOpen((prev) => !prev)
                                    }}
                                    label={trendItem.name}
                                    size="medium"
                                    sx={{
                                        bgcolor: selectedTrend?.name === trendItem.name ? "#1E293B" : '',
                                        color: selectedTrend?.name === trendItem.name ? "white" : 'black'
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                <Box className="absolute top-0 left-0 bottom-0 right-0 z-10">
                    <Map trends={trends} location={location} selectedTrend={selectedTrend} setSelectedTrend={setSelectedTrend} setOpenModalTrend={setOpenModalTrend} />
                </Box>
            </Box>

            <Box className="flex flex-col md:flex-row gap-4 pb-4">
                <Box className="w-full md:w-1/3 rounded-xl shadow-lg bg-white hidden md:block">
                    <h2 className="font-semibold text-xl px-4 mb-4">Publicaciones</h2>
                    <Box className="h-[500px] overflow-y-auto custom-scrollbar">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.2, delay: index * 0.1 }}
                            >
                                <Box
                                    className="mb-6 cursor-pointer rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 group border-2 border-transparent hover:border-pink-500 hover:shadow-2xl"
                                    onClick={() => openPost(post, index)}
                                >
                                    <img
                                        src={`http://localhost:5000/${post.media[0].path.replace(/\\/g, "/")}`}
                                        alt={post.media[0].description}
                                        className="w-full h-64 object-cover rounded-t-lg"
                                    />

                                    <Box className="absolute inset-0 p-4 flex flex-col justify-between items-start bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-black bg-opacity-50 p-2 rounded-lg">
                                            <p className="font-semibold text-white">{post.userId.name}</p>
                                            <p className="text-sm text-white">{post.createdAt.toString()}</p>
                                        </div>

                                        <Box className="mt-4 text-white text-sm line-clamp-3">
                                            {post.media[0].description}
                                        </Box>
                                    </Box>

                                    <Box className="p-4 absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-4 bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="text-gray-300 hover:text-red-600 transition-colors duration-300 p-2 rounded-full"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setOpenModalFavorite(true)
                                            }}
                                        >
                                            <FavoriteIcon className="text-2xl" />
                                        </button>
                                        <button className="text-gray-300 hover:text-blue-600 transition-colors duration-300 p-2 rounded-full">
                                            <CommentIcon className="text-2xl" />
                                        </button>
                                        <button className="text-gray-300 hover:text-green-600 transition-colors duration-300 p-2 rounded-full">
                                            <ShareIcon className="text-2xl" />
                                        </button>
                                        <button className="text-gray-300 hover:text-gray-600 transition-colors duration-300 p-2 rounded-full">
                                            <BookmarkIcon className="text-2xl" />
                                        </button>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Box>

                <Box className="flex-grow rounded-xl px-2 mt-5 md:mt-0">
                    <h2 className="font-semibold text-xl mb-4 text-center">Tus publicaciones</h2>
                    <Search />
                </Box>

                <Box className="flex-grow rounded-xl px-2 hidden md:block">
                    <h2 className="font-semibold text-xl mb-4">Sugerencias para tí</h2>
                    <Suggest />
                </Box>
            </Box>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
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
                            {selectedPost?.userId.name} - {selectedPost?.placeId.name}
                        </Typography>
                        <Typography>
                            {selectedPost?.media[searchMedia].description}
                        </Typography>
                    </Box>
                    <Box className="absolute top-2 right-0 z-50">
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon className="text-white md:text-black" />
                        </IconButton>
                    </Box>

                    <Box className="flex flex-col md:flex-row h-full">
                        <Box className="relative inset-0 w-full md:w-[65%] h-full left-0">
                            <img
                                src={`http://localhost:5000/${selectedPost?.media[searchMedia].path.replace(/\\/g, "/")}`}
                                alt={selectedPost?.media[searchMedia].description}
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
                        <Box className="w-full md:w-[35%] h-4/5 md:h-[80vh] overflow-y-auto custom-scrollbar px-1 py-1">
                            <Box className="h-4/5 mt-10 space-y-3 overflow-y-auto custom-scrollbar">
                                <Card className="p-1 bg-gray-50 border-2 border-slate-800">
                                    <CardContent>
                                        <Box className="flex items-center">
                                            <Avatar>{selectedPost?.userId.name[0]}</Avatar>
                                            <Typography sx={{ ml: 1 }} className="ml-3 font-medium">{selectedPost?.userId.name}</Typography>
                                        </Box>
                                        <Typography sx={{ mt: 1, ml: 1 }} className="mt-2 text-gray-700">{selectedPost?.comment}</Typography>
                                    </CardContent>
                                </Card>
                                {selectedPost?.comments.map((comment, index) => (
                                    <Card key={index} className="p-1 bg-gray-50">
                                        <CardContent>
                                            <Box className="flex items-center">
                                                {/* <Avatar>{comment.user[0]}</Avatar> */}
                                                <Avatar>J</Avatar>
                                                <Typography sx={{ ml: 1 }} className="ml-3 font-medium">jh</Typography>
                                            </Box>
                                            <Typography sx={{ mt: 1, ml: 1 }} className="mt-2 text-gray-700">{comment.description}</Typography>
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

            <Drawer
                anchor="right"
                open={drawerOpenMoreTrends}
                onClose={() => setDrawerOpenMoreTrends(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 320,
                        p: 3,
                        borderRadius: '12px 0 0 12px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <div className="p-6 w-full">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Más tendencias {searchCriteria === 'near' ? 'cerca de ti' : 'actuales'}
                        </Typography>
                        <IconButton onClick={() => setDrawerOpenMoreTrends(false)} sx={{ color: '#555' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <List>
                        {trends.map((trend, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: '#f0f4ff',
                                        transform: 'scale(1.02)'
                                    },
                                    '&:active': {
                                        bgcolor: '#dce3ff'
                                    }
                                }}
                                onClick={() => {
                                    setDrawerOpenMoreTrends(false)
                                    setSelectedTrend(trend)
                                    setIsPanelOpen((prev) => !prev)
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: '#1E88E5' }}>
                                    <ArrowRightAltIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={trend.name}
                                    primaryTypographyProps={{
                                        fontWeight: 500,
                                        color: '#333'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <Modal
                open={openModalTrend}
                onClose={() => setOpenModalTrend(false)}
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
                            {selectedTrend?.name}
                        </Typography>
                        <Rating value={(selectedTrend?.rating ?? 0) / 2} precision={0.5} readOnly emptyIcon={<StarOutlineIcon sx={{ color: '#cbd5e1' }} />} />
                    </Box>
                    <Box className="absolute top-2 right-0 z-50">
                        <IconButton onClick={() => setOpenModalTrend(false)}>
                            <CloseIcon className="text-white md:text-black" />
                        </IconButton>
                    </Box>

                    <Box className="flex flex-col md:flex-row h-full">
                        <Box className="relative inset-0 w-full md:w-[75%] h-full left-0">
                            {
                                selectedTrend && selectedTrend.photos.length > 0 ?
                                    (
                                        <>
                                            <img
                                                src={selectedTrend?.photos[currentIndexTrendPhoto].url}
                                                alt='descripción lugar'
                                                className="h-full object-cover rounded-lg"
                                            />
                                            <Box className="absolute bottom-1 left-1/4 transform flex gap-4 z-50 bg-black bg-opacity-50 p-4 rounded-lg">
                                                <IconButton onClick={prevTrendPhoto} className="text-white">
                                                    <ArrowBackIosNewIcon className="text-gray-300" />
                                                </IconButton>
                                                <IconButton onClick={nextTrendPhoto} className="text-gray-300">
                                                    <ArrowForwardIosIcon className="text-gray-300" />
                                                </IconButton>
                                            </Box>
                                        </>
                                    )
                                    :
                                    (
                                        <Box className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                                            <Typography variant="h6" className="text-gray-500 italic">
                                                No hay imágenes disponibles
                                            </Typography>
                                        </Box>

                                    )
                            }
                        </Box>
                        <Box className="w-full md:w-[25%] h-4/5 md:h-[80vh] overflow-y-auto custom-scrollbar">
                            <Box className="h-4/5 mt-10 space-y-3 overflow-y-auto custom-scrollbar">
                                {selectedTrend?.tip && selectedTrend.tip.length > 0 ? (
                                    selectedTrend.tip.map((tip, index) => (
                                        <Card key={index} className="p-1 bg-gray-50">
                                            <CardContent>
                                                <Box className="flex items-center">
                                                    <Typography sx={{ ml: 1 }} className="ml-3 font-medium">{tip.created_at}</Typography>
                                                </Box>
                                                <Typography sx={{ mt: 1, ml: 1 }} className="mt-2 text-gray-700">{tip.text}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Box className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-4">
                                        <Typography variant="body1" className="text-gray-500 italic">
                                            No hay comentarios para este lugar
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openModalFavorite}
                onClose={() => setOpenModalFavorite(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[80vh] bg-white rounded-lg shadow-lg p-8 relative">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6" fontWeight="bold">
                            Likes
                        </Typography>
                        <IconButton onClick={() => setOpenModalFavorite(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {selectedPost && selectedPost.likes.map((like, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton >
                                <ListItemIcon>
                                    <Favorite />
                                </ListItemIcon>
                                <Box className="flex items-center justify-between w-full">
                                    <ListItemText primary={like.user.name} />
                                    <ListItemText primary={`${like.createdAt}`} />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </Box>
            </Modal>
        </>
    );
}