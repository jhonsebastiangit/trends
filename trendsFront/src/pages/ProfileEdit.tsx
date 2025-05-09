import { useState } from "react";
import { Avatar, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";

export default function ProfileEdit() {
  const [name, setName] = useState("Usuario Ejemplo");
  const [email] = useState("usuario@ejemplo.com"); // Solo lectura
  const [bio, setBio] = useState("Amante de los viajes y la aventura.");
  const [phone, setPhone] = useState("+34 123 456 789");
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatar(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Avatar Editable */}
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            <Avatar sx={{ width: 90, height: 90 }} src={avatar || undefined} />
          </label>
          <h2 className="text-xl font-bold">{name}</h2>
        </div>

        {/* Formulario de edición */}
        <div className="mt-6 space-y-4">
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Correo electrónico"
            variant="outlined"
            value={email}
            disabled
          />
          <TextField
            fullWidth
            label="Biografía"
            variant="outlined"
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <TextField
            fullWidth
            label="Teléfono"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Botón Guardar */}
        <motion.div whileTap={{ scale: 0.95 }} className="mt-6">
          <Button variant="contained" sx={{ background: 'rgb(30, 41, 59)' }} fullWidth>
            Guardar Cambios
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}