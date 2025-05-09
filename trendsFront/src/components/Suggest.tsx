import { useMemo } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const initialSuggest = [
    { place: "Hamburguesas" },
    { place: "Sushi" },
    { place: "Pescado" },
];

export default function Suggest() {
    const suggests = useMemo(() => initialSuggest, []);

    return (
        <Box className="w-full h-[500px] overflow-y-auto custom-scrollbar p-4 bg-gray-100 rounded-lg shadow-md">
            <Box className="flex flex-col items-start gap-6 pb-6">
                {suggests.map((search, index) => (
                    <Card
                        key={index}
                        sx={{
                            display: "flex",
                            flex: "1 0 auto",
                            cursor: "pointer",
                            width: "100%",
                            background: "rgb(30, 41, 59)",
                            color: "white",
                            borderRadius: 2,
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                            },
                        }}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Link to="/tendencia-perfil" className="text-white font-bold text-lg hover:underline">
                                <Typography variant="h6" sx={{ textAlign: "center", fontSize: '14px' }}>{search.place}</Typography>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
