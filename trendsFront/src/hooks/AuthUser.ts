import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
    name: string,
    email: string,
    password: string,
    birthdate: string,
    photo: null,
}

export default function useAuthUser() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const login = async (formData:FormData) => {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/user/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json()
        data.status === 'success' ? navigate('/') : setError('Usuario y/o contraseña incorrecta')
        setLoading(false)
    }

    return {
        login,
        error,
        setError,
        loading
    }
}