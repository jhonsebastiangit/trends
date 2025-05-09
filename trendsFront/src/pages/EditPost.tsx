import { useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Media {
    type: "photo" | "video";
    url: string;
}

interface SearchHistory {
    user: string;
    place: string;
    review: string;
    medias: Media[];
}

const post: SearchHistory = {
    user: "Jhon Sebastian",
    place: "Hamburguesas",
    review: "Excelente lugar para compartir",
    medias: [
      { type: "photo", url: "https://picsum.photos/700/400?1" },
      { type: "photo", url: "https://picsum.photos/700/400?2" },
    ],
  };

export default function EditPost() {
    const [place, setPlace] = useState(post.place);
    const [review, setReview] = useState(post.review);
    const [images, setImages] = useState<Media[]>(post.medias);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages: Media[] = Array.from(e.target.files).map((file) => ({
                type: "photo",
                url: URL.createObjectURL(file),
            }));

            setImages((prev) => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-xl font-bold text-center">Editar Publicación</h2>

                <div className="mt-6 space-y-4">
                    <TextField fullWidth label="Lugar visitado" variant="outlined" value={place} onChange={(e) => setPlace(e.target.value)} />
                    <TextField fullWidth label="Reseña" variant="outlined" multiline rows={3} value={review} onChange={(e) => setReview(e.target.value)} />

                    {/* Input para subir imágenes */}
                    <div className="border p-4 rounded-lg bg-gray-50 text-center cursor-pointer">
                        <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                        <label htmlFor="image-upload" className="flex items-center justify-center gap-2 text-gray-600 cursor-pointer">
                            <CloudUpload />
                            <span>Subir Fotos</span>
                        </label>
                    </div>

                    {/* Vista previa de imágenes */}
                    <div className="flex gap-2 flex-wrap mt-2">
                        {images.map((img, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img src={img.url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg shadow" />
                                <IconButton size="small" className="absolute -top-2 -right-2 bg-white rounded-full" onClick={() => removeImage(index)}>
                                    <Close fontSize="small" className="text-red-500" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 flex gap-2">
                    <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button variant="contained" sx={{ background: 'rgb(30, 41, 59)' }} fullWidth>
                            Guardar Cambios
                        </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button variant="outlined" color="error" fullWidth>
                            Cancelar
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}