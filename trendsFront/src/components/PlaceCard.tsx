import { Card, CardContent, Typography, CardMedia, Rating } from "@mui/material";
import { Place } from "../types";

interface Props {
  place: Place;
  onClick: () => void;
}

export default function PlaceCard({ place, onClick }: Props) {
  return (
    <Card onClick={onClick} className="cursor-pointer shadow-lg hover:shadow-xl transition">
      <CardMedia component="img" height="180" image={place.photos[0].url} alt={place.name} />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{place.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {place.categories[0].name} · {place.location.address}
        </Typography>
        <Rating value={place.rating} readOnly />
      </CardContent>
    </Card>
  );
}