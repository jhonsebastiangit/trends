import { useState } from "react";
import { TextField, Button, IconButton, InputAdornment, Avatar, LinearProgress } from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Email, Lock, CalendarToday, PhotoCamera } from "@mui/icons-material";
import useAuthUser from "../hooks/AuthUser";

export default function Login() {
    const { login, error, setError, loading } = useAuthUser()
    
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        birthdate: "",
        photo: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setError('')
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement && e.target.type === "file") {
            const files: FileList = e.target.files!;
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isRegister) {
            // Validación de edad mínima
            const birthDate = new Date(formData.birthdate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
                alert("Debes ser mayor de edad para registrarte.");
                return;
            }
        } else {
            login(formData)
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleMode = () => {
        setIsRegister((prev) => !prev);
        setFormData({
            name: "",
            email: "",
            password: "",
            birthdate: "",
            photo: null,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            {
                loading ?
                    (<LinearProgress />)
                    :
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-2">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>
                        <h2 className="text-sm font-bold text-center mb-6 text-red-900"> {error} </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {isRegister && (
                                <>
                                    <TextField
                                        name="name"
                                        label="Nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle className="text-slate-800" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        name="birthdate"
                                        type="date"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        label="Fecha de nacimiento"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarToday className="text-slate-800" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <div className="flex items-center gap-4">
                                        {formData.photo ? (
                                            <Avatar src={URL.createObjectURL(formData.photo)} alt="Foto" />
                                        ) : (
                                            <Avatar sx={{ background: 'rgb(30, 41, 59)' }} />
                                        )}
                                        <Button
                                            variant="contained"
                                            component="label"
                                            className="hover:bg-slate-700"
                                            sx={{ background: "rgb(30, 41, 59)" }}
                                            startIcon={<PhotoCamera className="text-slate-100" />}
                                        >
                                            Subir foto
                                            <input hidden accept="image/*" type="file" name="photo" onChange={handleChange} />
                                        </Button>
                                    </div>
                                </>
                            )}

                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email className="text-slate-800" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                name="password"
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock className="text-slate-800" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff className="text-slate-800" /> : <Visibility className="text-slate-800" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                className="hover:bg-slate-700"
                                sx={{ background: "rgb(30, 41, 59)" }}
                            >
                                {isRegister ? "Registrarse" : "Iniciar sesión"}
                            </Button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-slate-800 hover:underline"
                            >
                                {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                            </button>
                        </div>
                    </div>
            }
        </div>
    );
}