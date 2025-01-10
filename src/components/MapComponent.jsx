import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { Icon } from "leaflet";
import { Box, Typography, Paper, Chip } from "@mui/material";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with React
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomMarkerIcon = (available, total) => {
  const percentage = (available / total) * 100;
  let color;
  if (available === 0) {
    color = "#ef4444"; // Red for full
  } else if (percentage <= 25) {
    color = "#f97316"; // Orange for nearly full
  } else if (percentage <= 50) {
    color = "#eab308"; // Yellow for half full
  } else {
    color = "#22c55e"; // Green for good availability
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 100 100">
      <path fill="${color}" d="M50 0C32.8 0 19 13.8 19 31c0 7.8 2.9 14.9 7.6 20.3L50 80l23.4-28.7C78.1 45.9 81 38.8 81 31 81 13.8 67.2 0 50 0zm0 43c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z"/>
    </svg>
  `;
};
// Extended parking spots data
const parkingSpots = [
  {
    id: 1,
    position: [18.5204, 73.8567],
    name: "FC Road Parking",
    available: 15,
    total: 20,
    rate: "₹40/hr",
  },
  {
    id: 2,
    position: [18.529, 73.8745],
    name: "Koregaon Park Plaza",
    available: 0,
    total: 25,
    rate: "₹50/hr",
  },
  {
    id: 3,
    position: [18.5108, 73.8271],
    name: "Deccan Parking Zone",
    available: 3,
    total: 15,
    rate: "₹30/hr",
  },
  {
    id: 4,
    position: [18.5622, 73.9187],
    name: "Viman Nagar Mall",
    available: 8,
    total: 30,
    rate: "₹45/hr",
  },
  {
    id: 5,
    position: [18.4974, 73.8507],
    name: "Swargate Station",
    available: 2,
    total: 12,
    rate: "₹25/hr",
  },
  {
    id: 6,
    position: [18.5598, 73.8074],
    name: "Aundh Road",
    available: 0,
    total: 18,
    rate: "₹35/hr",
  },
  {
    id: 7,
    position: [18.5089, 73.9259],
    name: "Magarpatta City",
    available: 20,
    total: 40,
    rate: "₹40/hr",
  },
  {
    id: 8,
    position: [18.5793, 73.8432],
    name: "Baner High Street",
    available: 5,
    total: 22,
    rate: "₹45/hr",
  },
];

// Extended traffic points
const trafficPoints = [
  { position: [18.5204, 73.8567], level: "high", speed: "15 km/h" }, // FC Road
  { position: [18.529, 73.8745], level: "medium", speed: "30 km/h" }, // Koregaon Park
  { position: [18.5108, 73.8271], level: "low", speed: "45 km/h" }, // Deccan
  { position: [18.5622, 73.9187], level: "high", speed: "12 km/h" }, // Viman Nagar
  { position: [18.4974, 73.8507], level: "medium", speed: "25 km/h" }, // Swargate
  { position: [18.5598, 73.8074], level: "high", speed: "18 km/h" }, // Aundh
  { position: [18.5089, 73.9259], level: "low", speed: "40 km/h" }, // Magarpatta
  { position: [18.5793, 73.8432], level: "medium", speed: "28 km/h" }, // Baner
];

// Air quality monitoring points
const airQualityPoints = [
  {
    position: [18.5204, 73.8567],
    level: "moderate",
    aqi: 121,
    name: "FC Road",
  },
  {
    position: [18.529, 73.8745],
    level: "good",
    aqi: 82,
    name: "Koregaon Park",
  },
  { position: [18.5108, 73.8271], level: "poor", aqi: 168, name: "Deccan" },
  {
    position: [18.5622, 73.9187],
    level: "moderate",
    aqi: 115,
    name: "Viman Nagar",
  },
  { position: [18.4974, 73.8507], level: "poor", aqi: 178, name: "Swargate" },
  { position: [18.5598, 73.8074], level: "good", aqi: 75, name: "Aundh" },
  {
    position: [18.5089, 73.9259],
    level: "moderate",
    aqi: 110,
    name: "Magarpatta",
  },
  { position: [18.5793, 73.8432], level: "good", aqi: 65, name: "Baner" },
];
const MapComponent = ({
  showTraffic = false,
  showParking = false,
  showAirQuality = false,
}) => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const center = [18.5204, 73.8567]; // Pune center coordinates

  const getMarkerColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (available === 0) return "#ef4444"; // Red for full
    if (percentage <= 25) return "#f97316"; // Orange for nearly full
    if (percentage <= 50) return "#eab308"; // Yellow for half full
    return "#22c55e"; // Green for good availability
  };

  const getAQIColor = (aqi) => {
    if (aqi > 150) return "#ef4444"; // Poor
    if (aqi > 100) return "#f97316"; // Moderate
    return "#22c55e"; // Good
  };

  // return (
  //   <Box sx={{ height: 400, width: "100%", position: "relative" }}>
  return (
    <Box
      sx={{
        // height: { xs: 300, sm: 400 },
        height: "50vh",
        width: "100%",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showTraffic &&
          trafficPoints.map((point, index) => (
            <CircleMarker
              key={index}
              center={point.position}
              radius={15}
              pathOptions={{
                color:
                  point.level === "high"
                    ? "#ef4444"
                    : point.level === "medium"
                    ? "#f97316"
                    : "#22c55e",
                fillOpacity: 0.6,
              }}
            >
              <Popup className="custom-popup">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Traffic Level: {point.level}
                  <br />
                  Speed: {point.speed}
                </Typography>
              </Popup>
            </CircleMarker>
          ))}

        {showParking &&
          parkingSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={spot.position}
              icon={
                new Icon({
                  iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                })
              }
            >
              <Popup className="custom-popup">
                <Paper sx={{ p: 1, maxWidth: 200 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {spot.name}
                  </Typography>
                  <Chip
                    label={spot.available > 0 ? "Available" : "Full"}
                    color={spot.available > 0 ? "success" : "error"}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Available: {spot.available}/{spot.total} spots
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    Rate: {spot.rate}
                  </Typography>
                </Paper>
              </Popup>
            </Marker>
          ))}

        {showAirQuality &&
          airQualityPoints.map((point, index) => (
            <CircleMarker
              key={index}
              center={point.position}
              radius={20}
              pathOptions={{
                color: getAQIColor(point.aqi),
                fillOpacity: 0.6,
              }}
            >
              <Popup className="custom-popup">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {point.name}
                  <br />
                  AQI: {point.aqi}
                  <br />
                  Level: {point.level}
                </Typography>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {/* Map Legend */}
      {(showTraffic || showAirQuality || showParking) && (
        <Paper
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            p: 1,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
            {showTraffic
              ? "Traffic Levels"
              : showAirQuality
              ? "Air Quality Index"
              : "Parking Availability"}
          </Typography>
          {showTraffic &&
            ["High", "Medium", "Low"].map((level) => (
              <Box
                key={level}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor:
                      level === "High"
                        ? "#ef4444"
                        : level === "Medium"
                        ? "#f97316"
                        : "#22c55e",
                  }}
                />
                <Typography variant="caption">{level}</Typography>
              </Box>
            ))}
        </Paper>
      )}
    </Box>
  );
};

export default MapComponent;
