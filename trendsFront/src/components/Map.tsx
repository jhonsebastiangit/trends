import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import { Trend } from "../types";
import { Box, IconButton, Tooltip } from "@mui/material";
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

type RoutingProps = {
  from: [number, number];
  to: [number, number];
};

export const Routing = ({ from, to }: RoutingProps) => {
  const map = useMap();
  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1]),
      ],
      lineOptions: {
        styles: [{ color: '#1E293B', weight: 6 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    } as any).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to]);

  return null;
};


type Props = {
  selectedTrend: Trend | undefined;
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
  clusterRef: React.RefObject<any>;
};

export const FlyAndOpenPopup = ({ selectedTrend, markerRefs, clusterRef }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!selectedTrend || !clusterRef.current) return;

    const marker = markerRefs.current[selectedTrend._id];
    if (!marker) return;

    clusterRef.current.zoomToShowLayer(marker, () => {
      const latlng = marker.getLatLng();
      map.flyTo(latlng, 18, { duration: 1 });
      setTimeout(() => {
        marker.openPopup();
      }, 1600);
    });

  }, [selectedTrend, markerRefs, clusterRef, map]);

  return null;
};

type MapProps = {
  trends: Trend[]
  location: { latitude: number; longitude: number } | null
  selectedTrend: Trend | undefined
  setSelectedTrend: React.Dispatch<React.SetStateAction<Trend | undefined>>
  setOpenModalTrend: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Map({ trends, location, selectedTrend, setSelectedTrend, setOpenModalTrend }: MapProps) {

  const markerRefs = useRef<Record<string, L.Marker>>({});
  const clusterRef = useRef<any>(null);
  const [showRoute, setShowRoute] = useState(false)

  useEffect(() => {
    if (selectedTrend && markerRefs.current[selectedTrend._id]) {
      markerRefs.current[selectedTrend._id].openPopup();
    }
  }, [selectedTrend]);

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535188.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const markers = useMemo(() => (
    <MarkerClusterGroup
      ref={clusterRef}
      disableClusteringAtZoom={18}
    >
      {trends.map((trend) => (
        <Marker
          key={trend._id}
          position={[trend.coordinates[0], trend.coordinates[1]]}
          icon={customIcon}
          ref={(markerRef) => {
            if (markerRef) {
              markerRefs.current[trend._id] = markerRef;
            }
          }}
        >
          <Popup>
            <strong>{trend.name}</strong> <br />
            <Box className="mt-5 flex justify-center items-center gap-3">
              <Tooltip title="Ir" placement="top-end" arrow
                sx={{
                  backgroundColor: "#1E293B",
                  color: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: "#1E293B",
                  },
                }}
                onClick={() => setShowRoute(true)}
              >
                <IconButton>
                  <DirectionsWalkIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ver" placement="top-end" arrow
                sx={{
                  backgroundColor: "#1E293B",
                  color: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: "#1E293B",
                  },
                }}
                onClick={() => {
                    setOpenModalTrend(true)
                    setSelectedTrend(trend)
                  }
                }
              >
                <IconButton>
                  <RemoveRedEyeIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  ), [trends, selectedTrend]);

  return (
    <div className="flex flex-col items-center w-full">
      {location && (
        <MapContainer center={[location.latitude, location.longitude]} zoom={15} className="w-full h-[70vh] md:h-[550px]">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />
          {markers}
          <FlyAndOpenPopup
            selectedTrend={selectedTrend}
            markerRefs={markerRefs}
            clusterRef={clusterRef}
          />
          {location && selectedTrend && showRoute}
          {location && selectedTrend && showRoute && (
            <Routing
              from={[location.latitude, location.longitude]}
              to={[selectedTrend.coordinates[0], selectedTrend.coordinates[1]]}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
}