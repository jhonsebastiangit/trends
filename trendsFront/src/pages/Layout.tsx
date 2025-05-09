import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import GradeIcon from '@mui/icons-material/Grade';
import StoreIcon from '@mui/icons-material/Store';
import { NavLink, Outlet } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { Place } from '@mui/icons-material';
import { motion } from "framer-motion";

const drawerWidthResponsive = 240;
const drawerWidth = 240;

interface Props {
    window?: () => Window;
}

interface MenuItem {
    text: string,
    to: string,
    icon: React.ReactNode
}

export default function Layout(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const textRef = React.useRef<HTMLDivElement>(null);
    const [textWidth, setTextWidth] = React.useState(0);


    React.useEffect(() => {
        if (textRef.current) {
            setTextWidth(textRef.current.offsetWidth);
        }
    }, []);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const fontSize = ['22px', '22px', '22px']

    const menuItems: MenuItem[] = [
        {
            text: 'Inicio',
            to: '/',
            icon: <HomeIcon sx={{ fontSize: { xs: fontSize[0], md: fontSize[1], lg: fontSize[2] } }} />
        },
        {
            text: 'Lugares',
            to: '/lugares',
            icon: <Place sx={{ fontSize: { xs: fontSize[0], md: fontSize[1], lg: fontSize[2] } }} />
        },
        {
            text: 'Perfil',
            to: '/perfil',
            icon: <AccountCircleIcon sx={{ fontSize: { xs: fontSize[0], md: fontSize[1], lg: fontSize[2] } }} />
        },
        {
            text: 'Perfil Tendencia',
            to: '/tendencia-perfil',
            icon: <StoreIcon sx={{ fontSize: { xs: fontSize[0], md: fontSize[1], lg: fontSize[2] } }} />
        },
        {
            text: 'Publicaciones',
            to: '/vistas',
            icon: <DynamicFeedIcon sx={{ fontSize: { xs: fontSize[0], md: fontSize[1], lg: fontSize[2] } }} />
        },
        {
            text: 'Más buscado',
            to: '/busquedas',
            icon: <GradeIcon sx={{ fontSize: { xs: fontSize[0], md: fontSize[1], lg: fontSize[2] } }} />
        }
    ];

    const drawer = (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="cursor-pointer"
            >
                <Toolbar className="w-full p-5 flex items-center justify-center bg-slate-800 text-gray-300 shadow-md relative">

                    {/* Punto animado alrededor de "Tendencias" */}
                    {textWidth > 0 && (
                        <motion.div
                            className="absolute w-2 h-2 bg-gray-300 rounded-full"
                            animate={{
                                x: [
                                    `-${textWidth / 2}px`, `${textWidth / 2}px`,
                                    `${textWidth / 2}px`, `-${textWidth / 2}px`,
                                    `-${textWidth / 2}px`
                                ],
                                y: [
                                    "-12px", "-10px", "10px", "10px", "-10px"
                                ],
                                scale: [1, 0.7, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )}

                    {/* Texto Tendencias */}
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                        <Typography
                            ref={textRef} // Capturamos el ancho del texto
                            sx={{
                                textAlign: "center",
                                display: "inline-block",
                                fontSize: { xs: "20px", md: "20px", lg: "20px" },
                                fontWeight: 600,
                                letterSpacing: 1,
                            }}
                        >
                            Tendencias
                        </Typography>
                    </motion.div>
                </Toolbar>
            </motion.div>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `w-full flex items-center ${isActive ? "bg-slate-800 text-gray-300" : "text-gray-500"}`
                            }
                            onClick={()=>setMobileOpen(false)}
                        >
                            {({ isActive }) => (
                                <ListItemButton selected={isActive}>
                                    <ListItemIcon sx={{ color: isActive ? "#D1D5DB" : "#6B7280" }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    fontSize: { xs: "20px", md: "20px", lg: "20px" },
                                                },
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            )}
                        </NavLink>
                    </ListItem>
                ))}
            </List>
            <List>
                <ListItem disablePadding>
                    <Button sx={{ background: 'rgb(30, 41, 59)', width: '100%', borderRadius: 0 }} variant='contained'>
                        Cerrar Sesión
                    </Button>
                </ListItem>
            </List>
        </div>
    );


    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box className="flex overflow-hidden">
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: { sm: 'slategray', md: 'slategray' },
                    boxShadow: 'none'
                }}
            >
                <Toolbar className="bg-slate-800">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidthResponsive,
                            borderRadius: '0px 15px 15px 0px',
                            paddingLeft: 0
                        }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}