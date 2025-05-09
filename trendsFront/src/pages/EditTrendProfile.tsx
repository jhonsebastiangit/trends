import { useState, useEffect } from "react";
import { TextField, Button, Typography, IconButton } from "@mui/material";
import { Delete, AddAPhoto } from "@mui/icons-material";
import { motion } from "framer-motion";

interface ImageWithTag {
    url: string;
    tag: string;
}

interface TrendProfile {
    name: string;
    address: string;
    description: string;
    images: ImageWithTag[];
}

// Datos simulados (mock)
const mockProfile: TrendProfile = {
    name: "Tendencia Burger",
    address: "Calle 123, Ciudad",
    description: "Las mejores hamburguesas gourmet de la ciudad.",
    images: [
        { url: "https://picsum.photos/700/400?1", tag: "Hamburguesa Doble" },
        { url: "https://picsum.photos/700/400?2", tag: "Papas Fritas Extra" },
    ],
};

export default function EditTrendProfile() {
    const [profile, setProfile] = useState<TrendProfile | null>(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<ImageWithTag[]>([]);

    useEffect(() => {
        // Simular fetch de datos
        setProfile(mockProfile);
        setName(mockProfile.name);
        setAddress(mockProfile.address);
        setDescription(mockProfile.description);
        setImages(mockProfile.images);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages: ImageWithTag[] = Array.from(e.target.files).map(
                (file) => ({
                    url: URL.createObjectURL(file),
                    tag: "Nuevo Producto",
                })
            );
            setImages((prev) => [...prev, ...newImages]);
        }
    };

    const handleImageDelete = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        console.log("Guardando perfil...", { name, address, description, images });
        // Aquí harías una petición PUT para actualizar el perfil
    };

    if (!profile) return <Typography>Cargando...</Typography>;

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            {/* Tarjeta de edición */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <Typography variant="h5" fontWeight="bold">
                    Editar Perfil de Tendencia
                </Typography>

                {/* Campos de texto */}
                <TextField
                    label="Nombre del lugar"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mt: 5 }}
                />

                <TextField
                    label="Dirección"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ mt: 5 }}
                />

                <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 5 }}
                />

                {/* Sección de imágenes */}
                <div className={"mt-5 w-full"}>
                    <Typography variant="subtitle1">Imágenes y Productos Relacionados:</Typography>
                    <div className="w-full flex flex-wrap gap-4 mt-2">
                        <div className="w-full flex flex-wrap gap-4 mt-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group w-full md:w-1/4">
                                    {/* Imagen */}
                                    <img
                                        src={image.url}
                                        alt="Preview"
                                        className="w-full object-cover rounded-lg shadow-md transition-all duration-300 group-hover:scale-105"
                                    />

                                    {/* Etiqueta del producto */}
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                                        {image.tag}
                                    </div>

                                    {/* Botón de eliminar */}
                                    <IconButton
                                        onClick={() => handleImageDelete(index)}
                                        className="absolute top-2 right-2 bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        size="small"
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </div>
                            ))}

                            {/* Botón de agregar imagen */}
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-full md:w-1/4 h-32 border-2 border-dashed border-gray-400 rounded-lg text-gray-500 hover:border-gray-700 hover:text-gray-700 transition-all duration-300">
                                <span className="text-xs mt-1">Agregar imagen</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    id="image-upload"
                                    hidden
                                    multiple
                                />
                                <label htmlFor="image-upload">
                                    <IconButton color="primary" component="span">
                                        <AddAPhoto />
                                    </IconButton>
                                </label>
                            </label>
                        </div>

                    </div>
                </div>

                {/* Botón de guardar */}
                <Button
                    variant="contained"
                    sx={{ background: "rgb(30, 41, 59)", marginTop: "16px", width: {xs:'100%', md: '25%'} }}
                    onClick={handleSave}
                >
                    Guardar Cambios
                </Button>
            </motion.div>
        </div>
    );
};