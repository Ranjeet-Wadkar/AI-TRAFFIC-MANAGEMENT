import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Typography,
  Card,
  CardContent,
  Modal,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Badge,
  Chip,
} from "@mui/material";
import {
  FaTrafficLight,
  FaParking,
  FaMapMarkerAlt,
  FaBuilding,
  FaHospital,
  FaShoppingCart,
  FaRoad,
  FaCircle,
} from "react-icons/fa";
import { IoMdCloudy } from "react-icons/io";
import { AiOutlineBell } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#2563eb", // Blue
//       light: "#3b82f6",
//       dark: "#1d4ed8",
//     },
//     secondary: {
//       main: "#8b5cf6", // Purple
//       light: "#a78bfa",
//       dark: "#7c3aed",
//     },
//     background: {
//       default: "#f1f5f9", // Light slate
//       paper: "#ffffff",
//     },
//     gradients: {
//       blue: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
//       purple: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
//       dark: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", sans-serif',
//     h5: {
//       fontWeight: 700,
//       letterSpacing: "-0.01em",
//     },
//     h6: {
//       fontWeight: 600,
//       letterSpacing: "-0.01em",
//     },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow:
//             "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
//         },
//       },
//     },
//     MuiCardContent: {
//       styleOverrides: {
//         root: {
//           "&:last-child": {
//             paddingBottom: 16,
//           },
//         },
//       },
//     },
//   },
// });
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0EA5E9", // Sky blue
      light: "#38BDF8",
      dark: "#0284C7",
    },
    secondary: {
      main: "#2563EB", // Blue
      light: "#60A5FA",
      dark: "#1D4ED8",
    },
    background: {
      default: "linear-gradient(135deg, #7DD3FC 0%, #1D4ED8 100%)", // Light blue to blue gradient
      paper: "#ffffff",
    },
    gradients: {
      blue: "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)",
      purple: "linear-gradient(135deg, #9333EA 0%, #C084FC 100%)",
      dark: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 8px 32px -4px rgba(0, 0, 0, 0.1), 0 4px 16px -2px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
  },
});

// Traffic congestion levels for roads
const trafficCongestion = {
  "Central Avenue": { level: "high", speed: "15 km/h" },
  Broadway: { level: "medium", speed: "30 km/h" },
  "North Street": { level: "low", speed: "45 km/h" },
  "South Street": { level: "high", speed: "10 km/h" },
  "Market Road": { level: "medium", speed: "25 km/h" },
  "Park Road": { level: "low", speed: "40 km/h" },
  "East Lane": { level: "medium", speed: "28 km/h" },
  "West Lane": { level: "high", speed: "12 km/h" },
  "Middle Lane": { level: "low", speed: "42 km/h" },
  "Grove Street": { level: "medium", speed: "32 km/h" },
  "NW Avenue": { level: "high", speed: "18 km/h" },
  "SE Avenue": { level: "low", speed: "38 km/h" },
  "SW Avenue": { level: "medium", speed: "27 km/h" },
  "NE Avenue": { level: "high", speed: "14 km/h" },
};

// Traffic incidents
const trafficIncidents = [
  {
    id: 1,
    type: "accident",
    location: { x: 150, y: 150 },
    severity: "high",
    time: "10 mins ago",
  },
  {
    id: 2,
    type: "construction",
    location: { x: 250, y: 200 },
    severity: "medium",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "roadblock",
    location: { x: 180, y: 280 },
    severity: "low",
    time: "30 mins ago",
  },
];
const roadNetwork = [
  // Main roads
  { id: "r1", type: "main", points: "20,200 380,200", name: "Central Avenue" },
  { id: "r2", type: "main", points: "200,20 200,380", name: "Broadway" },
  // Secondary roads
  {
    id: "r3",
    type: "secondary",
    points: "50,100 350,100",
    name: "North Street",
  },
  {
    id: "r4",
    type: "secondary",
    points: "50,300 350,300",
    name: "South Street",
  },
  {
    id: "r5",
    type: "secondary",
    points: "20,150 380,150",
    name: "Market Road",
  },
  { id: "r6", type: "secondary", points: "20,250 380,250", name: "Park Road" },
  // Connecting roads
  { id: "r7", type: "connecting", points: "100,20 100,380", name: "East Lane" },
  { id: "r8", type: "connecting", points: "300,20 300,380", name: "West Lane" },
  {
    id: "r9",
    type: "connecting",
    points: "150,20 150,380",
    name: "Middle Lane",
  },
  {
    id: "r10",
    type: "connecting",
    points: "250,20 250,380",
    name: "Grove Street",
  },
  // Diagonal roads
  { id: "r11", type: "connecting", points: "20,20 150,150", name: "NW Avenue" },
  {
    id: "r12",
    type: "connecting",
    points: "250,250 380,380",
    name: "SE Avenue",
  },
  {
    id: "r13",
    type: "connecting",
    points: "20,380 150,250",
    name: "SW Avenue",
  },
  {
    id: "r14",
    type: "connecting",
    points: "250,150 380,20",
    name: "NE Avenue",
  },
];

// Roundabouts
const roundabouts = [
  { id: 1, x: 200, y: 200, radius: 20 },
  { id: 2, x: 100, y: 100, radius: 15 },
  { id: 3, x: 300, y: 300, radius: 15 },
];

const notifications = [
  {
    id: 1,
    type: "traffic",
    message: "Heavy traffic on Central Avenue",
    time: "10 mins ago",
  },
  {
    id: 2,
    type: "pollution",
    message: "High pollution alert in Downtown",
    time: "30 mins ago",
  },
];
// Mock traffic data
const trafficData = [
  { hour: "6 AM", congestion: 40, prediction: 45 },
  { hour: "7 AM", congestion: 70, prediction: 75 },
  { hour: "8 AM", congestion: 90, prediction: 85 },
  { hour: "9 AM", congestion: 60, prediction: 65 },
  { hour: "10 AM", congestion: 50, prediction: 55 },
  { hour: "11 AM", congestion: 45, prediction: 40 },
];

// Mock buildings data
const buildings = [
  { id: 1, type: "mall", name: "Central Mall", x: 80, y: 80 },
  { id: 2, type: "hospital", name: "City Hospital", x: 180, y: 120 },
  { id: 3, type: "shop", name: "Shopping Center", x: 250, y: 180 },
  { id: 4, type: "building", name: "Office Complex", x: 130, y: 220 },
  { id: 5, type: "building", name: "Business Park", x: 280, y: 150 },
  { id: 6, type: "shop", name: "Market Place", x: 150, y: 300 },
  { id: 7, type: "building", name: "Tech Hub", x: 220, y: 250 },
  { id: 8, type: "hospital", name: "Medical Center", x: 320, y: 280 },
  { id: 9, type: "mall", name: "Retail Park", x: 100, y: 180 },
  { id: 10, type: "building", name: "Corporate Tower", x: 350, y: 120 },
];

// Mock parking locations
const parkingLocations = [
  {
    id: 1,
    name: "Central Parking",
    position: { x: 100, y: 100 },
    available: 5,
    total: 10,
    rate: 15,
  },
  {
    id: 2,
    name: "West Station",
    position: { x: 200, y: 150 },
    available: 3,
    total: 8,
    rate: 12,
  },
  {
    id: 3,
    name: "Mall Complex",
    position: { x: 150, y: 250 },
    available: 0,
    total: 15,
    rate: 20,
  },
  {
    id: 4,
    name: "East Plaza",
    position: { x: 300, y: 200 },
    available: 8,
    total: 12,
    rate: 18,
  },
];

// Mock pollution zones
const pollutionZones = [
  { id: 1, x: 100, y: 100, radius: 50, level: "high", aqi: 156 },
  { id: 2, x: 250, y: 150, radius: 40, level: "medium", aqi: 89 },
  { id: 3, x: 150, y: 250, radius: 45, level: "low", aqi: 45 },
];
// Building icon component
const BuildingIcon = ({ type, x, y, name }) => {
  const getIcon = () => {
    switch (type) {
      case "mall":
        return <FaShoppingCart />;
      case "hospital":
        return <FaHospital />;
      case "shop":
        return <FaShoppingCart />;
      default:
        return <FaBuilding />;
    }
  };

  return (
    <Tooltip title={name}>
      <IconButton
        sx={{
          position: "absolute",
          left: x,
          top: y,
          color: "text.secondary",
          transform: "scale(0.8)",
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};
// Update the MockMap component

const MockMap = ({
  onClick,
  selectedLocation,
  showPollution = false,
  showTraffic = false,
}) => {
  // Helper function to get traffic color
  const getTrafficColor = (level) => {
    switch (level) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#22c55e";
      default:
        return "#cbd5e1";
    }
  };

  // Traffic incident icon component
  const TrafficIncidentIcon = ({ type, x, y, severity }) => {
    const getIcon = () => {
      switch (type) {
        case "accident":
          return "🚨";
        case "construction":
          return "🚧";
        case "roadblock":
          return "⛔";
        default:
          return "⚠️";
      }
    };

    return (
      <Tooltip
        title={`${
          type.charAt(0).toUpperCase() + type.slice(1)
        } - ${severity} severity`}
      >
        <div
          style={{
            position: "absolute",
            left: x - 10,
            top: y - 10,
            fontSize: "20px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          {getIcon()}
        </div>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 400,
        bgcolor: "#f1f5f9",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Roads Network */}
        {roadNetwork.map((road) => (
          <g key={road.id}>
            {/* Road base */}
            <polyline
              points={road.points}
              stroke={
                showTraffic
                  ? getTrafficColor(trafficCongestion[road.name]?.level)
                  : road.type === "main"
                  ? "#cbd5e1"
                  : "#e2e8f0"
              }
              strokeWidth={road.type === "main" ? 14 : 10}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={showTraffic ? 0.8 : 1}
            />
            {/* Road border */}
            <polyline
              points={road.points}
              stroke={road.type === "main" ? "#94a3b8" : "#cbd5e1"}
              strokeWidth={road.type === "main" ? 16 : 12}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.5"
            />

            {/* Road name label */}
            {showTraffic && (
              <text
                x={road.points.split(" ")[2]}
                y={parseInt(road.points.split(" ")[3]) + 20}
                fill="#1e293b"
                fontSize="10"
                textAnchor="middle"
              >
                {trafficCongestion[road.name]?.speed}
              </text>
            )}
          </g>
        ))}

        {/* Roundabouts */}
        {roundabouts.map((roundabout) => (
          <g key={roundabout.id}>
            <circle
              cx={roundabout.x}
              cy={roundabout.y}
              r={roundabout.radius}
              fill="#cbd5e1"
              strokeWidth="2"
              stroke="#94a3b8"
            />
            <circle
              cx={roundabout.x}
              cy={roundabout.y}
              r={roundabout.radius - 4}
              fill="#e2e8f0"
            />
          </g>
        ))}

        {/* Pollution Zones */}
        {showPollution &&
          pollutionZones.map((zone) => (
            <circle
              key={zone.id}
              cx={zone.x}
              cy={zone.y}
              r={zone.radius}
              fill={
                zone.level === "high"
                  ? "rgba(239, 68, 68, 0.2)"
                  : zone.level === "medium"
                  ? "rgba(234, 179, 8, 0.2)"
                  : "rgba(34, 197, 94, 0.2)"
              }
              stroke={
                zone.level === "high"
                  ? "#ef4444"
                  : zone.level === "medium"
                  ? "#eab308"
                  : "#22c55e"
              }
              strokeWidth="2"
            />
          ))}
      </svg>

      {/* Traffic Incidents */}
      {showTraffic &&
        trafficIncidents.map((incident) => (
          <TrafficIncidentIcon
            key={incident.id}
            type={incident.type}
            x={incident.location.x}
            y={incident.location.y}
            severity={incident.severity}
          />
        ))}

      {/* Buildings */}
      {buildings.map((building) => (
        <BuildingIcon
          key={building.id}
          type={building.type}
          x={building.x}
          y={building.y}
          name={building.name}
        />
      ))}

      {/* Parking Spots */}
      {!showPollution &&
        !showTraffic &&
        parkingLocations.map((location) => (
          <Tooltip
            key={location.id}
            title={`${location.name} - ${location.available} spots`}
          >
            <IconButton
              onClick={() => onClick(location)}
              sx={{
                position: "absolute",
                left: location.position.x,
                top: location.position.y,
                padding: "4px",
                color: location.available === 0 ? "#ef4444" : "#1174bc",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "white",
                  transform: "scale(1.1)",
                },
              }}
            >
              <FaParking size={16} />
            </IconButton>
          </Tooltip>
        ))}

      {/* Map Legend for Traffic */}
      {showTraffic && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            bgcolor: "white",
            borderRadius: 1,
            p: 1,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
            Traffic Levels
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {["high", "medium", "low"].map((level) => (
              <Box
                key={level}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: getTrafficColor(level),
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ textTransform: "capitalize" }}
                >
                  {level}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Map Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <IconButton
          sx={{
            bgcolor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "white" },
          }}
        >
          <Typography variant="h6">+</Typography>
        </IconButton>
        <IconButton
          sx={{
            bgcolor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "white" },
          }}
        >
          <Typography variant="h6">−</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

function MobileTrafficApp() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    time: "",
    vehicle: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  const handleLocationSelect = (location) => {
    if (location.available > 0) {
      setSelectedLocation(location);
      setOpenBookingModal(true);
    }
  };

  const handleBookingSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenBookingModal(false);
      setSnackBarOpen(true);

      // Add booking notification
      const newNotification = {
        id: notificationList.length + 1,
        type: "parking",
        message: `Parking booked at ${selectedLocation.name} for ${bookingDetails.vehicle}`,
        time: "Just now",
      };
      setNotificationList([newNotification, ...notificationList]);

      setSelectedLocation(null);
    }, 1500);
  };

  const renderContent = () => {
    switch (selectedTab) {
      // case 0: // Traffic
      //   return (
      //     <Box sx={{ p: 3 }}>
      //       <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
      //         Traffic Overview
      //       </Typography>

      //       {/* Traffic Map */}
      //       <Card sx={{ mb: 3 }}>
      //         <CardContent>
      //           <Box
      //             sx={{
      //               display: "flex",
      //               justifyContent: "space-between",
      //               alignItems: "center",
      //               mb: 2,
      //             }}
      //           >
      //             <Typography variant="h6">Live Traffic Map</Typography>
      //             <Box sx={{ display: "flex", gap: 1 }}>
      //               <Chip
      //                 label="Live"
      //                 size="small"
      //                 color="success"
      //                 sx={{ "& .MuiChip-label": { px: 1 } }}
      //               />
      //             </Box>
      //           </Box>
      //           <MockMap showTraffic={true} />
      //         </CardContent>
      //       </Card>

      //       {/* Quick Stats */}
      //       <Box
      //         sx={{
      //           display: "grid",
      //           gridTemplateColumns: "1fr 1fr",
      //           gap: 2,
      //           mb: 3,
      //         }}
      //       >
      //         <Card sx={{ bgcolor: "primary.main", color: "white" }}>
      //           <CardContent>
      //             <Typography variant="body2" sx={{ mb: 1 }}>
      //               Average Speed
      //             </Typography>
      //             <Typography variant="h4">27</Typography>
      //             <Typography variant="caption">km/h</Typography>
      //           </CardContent>
      //         </Card>
      //         <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
      //           <CardContent>
      //             <Typography variant="body2" sx={{ mb: 1 }}>
      //               Active Incidents
      //             </Typography>
      //             <Typography variant="h4">
      //               {trafficIncidents.length}
      //             </Typography>
      //             <Typography variant="caption">reported</Typography>
      //           </CardContent>
      //         </Card>
      //       </Box>

      //       {/* Traffic Forecast */}
      //       <Card
      //         sx={{
      //           mb: 3,
      //           background: theme.palette.gradients.blue,
      //           color: "white",
      //         }}
      //       >
      //         <CardContent>
      //           <Typography variant="h6" sx={{ mb: 2 }}>
      //             Congestion Forecast
      //           </Typography>
      //           <ResponsiveContainer width="100%" height={200}>
      //             <AreaChart data={trafficData}>
      //               <defs>
      //                 <linearGradient
      //                   id="congestion"
      //                   x1="0"
      //                   y1="0"
      //                   x2="0"
      //                   y2="1"
      //                 >
      //                   <stop
      //                     offset="5%"
      //                     stopColor="#ffffff"
      //                     stopOpacity={0.3}
      //                   />
      //                   <stop
      //                     offset="95%"
      //                     stopColor="#ffffff"
      //                     stopOpacity={0}
      //                   />
      //                 </linearGradient>
      //               </defs>
      //               <XAxis dataKey="hour" stroke="#ffffff" />
      //               <YAxis hide />
      //               <RechartsTooltip
      //                 contentStyle={{
      //                   backgroundColor: "white",
      //                   color: "#1e293b",
      //                 }}
      //               />
      //               <Area
      //                 type="monotone"
      //                 dataKey="congestion"
      //                 stroke="#ffffff"
      //                 fillOpacity={1}
      //                 fill="url(#congestion)"
      //               />
      //               <Line
      //                 type="monotone"
      //                 dataKey="prediction"
      //                 stroke="#ffffff"
      //                 strokeDasharray="5 5"
      //                 strokeWidth={2}
      //               />
      //             </AreaChart>
      //           </ResponsiveContainer>
      //         </CardContent>
      //       </Card>

      //       {/* Traffic Incidents */}
      //       <Box sx={{ mb: 2 }}>
      //         <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
      //           Active Incidents
      //         </Typography>
      //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      //           {trafficIncidents.map((incident) => (
      //             <Card
      //               key={incident.id}
      //               sx={{
      //                 borderLeft: 6,
      //                 borderColor:
      //                   incident.severity === "high"
      //                     ? "error.main"
      //                     : incident.severity === "medium"
      //                     ? "warning.main"
      //                     : "success.main",
      //               }}
      //             >
      //               <CardContent
      //                 sx={{ display: "flex", alignItems: "center", gap: 2 }}
      //               >
      //                 <Box
      //                   sx={{
      //                     p: 1,
      //                     borderRadius: 1,
      //                     bgcolor:
      //                       incident.severity === "high"
      //                         ? "error.lighter"
      //                         : incident.severity === "medium"
      //                         ? "warning.lighter"
      //                         : "success.lighter",
      //                   }}
      //                 >
      //                   {incident.type === "accident"
      //                     ? "🚨"
      //                     : incident.type === "construction"
      //                     ? "🚧"
      //                     : "⛔"}
      //                 </Box>
      //                 <Box sx={{ flex: 1 }}>
      //                   <Typography
      //                     variant="subtitle1"
      //                     sx={{ fontWeight: 600 }}
      //                   >
      //                     {incident.type.charAt(0).toUpperCase() +
      //                       incident.type.slice(1)}
      //                   </Typography>
      //                   <Typography variant="body2" color="text.secondary">
      //                     Reported {incident.time}
      //                   </Typography>
      //                 </Box>
      //                 <Chip
      //                   label={incident.severity.toUpperCase()}
      //                   size="small"
      //                   color={
      //                     incident.severity === "high"
      //                       ? "error"
      //                       : incident.severity === "medium"
      //                       ? "warning"
      //                       : "success"
      //                   }
      //                 />
      //               </CardContent>
      //             </Card>
      //           ))}
      //         </Box>
      //       </Box>
      //     </Box>
      //   );
      case 0: // Traffic
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
              Traffic Overview
            </Typography>

            {/* Traffic Map with new MapComponent */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Live Traffic Map</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label="Live"
                      size="small"
                      color="success"
                      sx={{ "& .MuiChip-label": { px: 1 } }}
                    />
                  </Box>
                </Box>
                <MapComponent showTraffic={true} />
              </CardContent>
            </Card>

            {/* Quick Stats - Keeping the same */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 3,
              }}
            >
              <Card sx={{ bgcolor: "primary.main", color: "white" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Average Speed
                  </Typography>
                  <Typography variant="h4">27</Typography>
                  <Typography variant="caption">km/h</Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Active Incidents
                  </Typography>
                  <Typography variant="h4">
                    {trafficIncidents.length}
                  </Typography>
                  <Typography variant="caption">reported</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Traffic Forecast - Keeping the same */}
            <Card
              sx={{
                mb: 3,
                background: theme.palette.gradients.blue,
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Congestion Forecast
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient
                        id="congestion"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ffffff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ffffff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#ffffff" />
                    <YAxis hide />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        color: "#1e293b",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="congestion"
                      stroke="#ffffff"
                      fillOpacity={1}
                      fill="url(#congestion)"
                    />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      stroke="#ffffff"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Traffic Incidents - Keeping the same */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
                Active Incidents
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {trafficIncidents.map((incident) => (
                  <Card
                    key={incident.id}
                    sx={{
                      borderLeft: 6,
                      borderColor:
                        incident.severity === "high"
                          ? "error.main"
                          : incident.severity === "medium"
                          ? "warning.main"
                          : "success.main",
                    }}
                  >
                    <CardContent
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor:
                            incident.severity === "high"
                              ? "error.lighter"
                              : incident.severity === "medium"
                              ? "warning.lighter"
                              : "success.lighter",
                        }}
                      >
                        {incident.type === "accident"
                          ? "🚨"
                          : incident.type === "construction"
                          ? "🚧"
                          : "⛔"}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {incident.type.charAt(0).toUpperCase() +
                            incident.type.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reported {incident.time}
                        </Typography>
                      </Box>
                      <Chip
                        label={incident.severity.toUpperCase()}
                        size="small"
                        color={
                          incident.severity === "high"
                            ? "error"
                            : incident.severity === "medium"
                            ? "warning"
                            : "success"
                        }
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        );
      // case 1: // Air Quality
      //   return (
      //     <Box sx={{ p: 3 }}>
      //       <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
      //         Air Quality
      //       </Typography>
      //       <Card sx={{ mb: 3 }}>
      //         <CardContent>
      //           <Typography variant="h6" sx={{ mb: 2 }}>
      //             Air Quality Map
      //           </Typography>
      //           <MapComponent showAirQuality={true} />
      //         </CardContent>
      //       </Card>
      //       <Box
      //         sx={{
      //           display: "grid",
      //           gridTemplateColumns: "1fr 1fr",
      //           gap: 2,
      //           mb: 3,
      //         }}
      //       >
      //         <Card
      //           sx={{
      //             background: theme.palette.gradients.blue,
      //             color: "white",
      //           }}
      //         >
      //           <CardContent>
      //             <Typography variant="h3" sx={{ mb: 1 }}>
      //               65
      //             </Typography>
      //             <Typography variant="body2">Current AQI</Typography>
      //           </CardContent>
      //         </Card>
      //         <Card
      //           sx={{
      //             background: theme.palette.gradients.purple,
      //             color: "white",
      //           }}
      //         >
      //           <CardContent>
      //             <Typography variant="h3" sx={{ mb: 1 }}>
      //               35
      //             </Typography>
      //             <Typography variant="body2">PM2.5 Level</Typography>
      //           </CardContent>
      //         </Card>
      //       </Box>
      //     </Box>
      //   );
      case 1: // Air Quality
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
              Air Quality
            </Typography>
            <Box sx={{ height: "calc(100vh - 250px)", overflow: "auto" }}>
              {" "}
              {/* This is the key change */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Air Quality Map
                  </Typography>
                  <MapComponent showAirQuality={true} />
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Card
                  sx={{
                    background: theme.palette.gradients.blue,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      65
                    </Typography>
                    <Typography variant="body2">Current AQI</Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    background: theme.palette.gradients.purple,
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      35
                    </Typography>
                    <Typography variant="body2">PM2.5 Level</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        );

      case 2: // Parking
        return (
          // <Box sx={{ p: 3 }}>
          //   <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
          //     Parking Spaces
          //   </Typography>
          //   <Card sx={{ mb: 3 }}>
          //     <CardContent>
          //       <Typography variant="h6" sx={{ mb: 2 }}>
          //         Parking Map
          //       </Typography>
          //       <MockMap
          //         onClick={handleLocationSelect}
          //         selectedLocation={selectedLocation}
          //       />
          //     </CardContent>
          //   </Card>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
              Parking Spaces
            </Typography>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Parking Map
                </Typography>
                <MapComponent showParking={true} />
              </CardContent>
            </Card>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
                Available Locations
              </Typography>
              {parkingLocations.map((location) => (
                <Card
                  key={location.id}
                  sx={{
                    mb: 2,
                    cursor: location.available > 0 ? "pointer" : "default",
                    opacity: location.available > 0 ? 1 : 0.7,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform:
                        location.available > 0 ? "scale(1.02)" : "none",
                    },
                  }}
                  onClick={() =>
                    location.available > 0 && handleLocationSelect(location)
                  }
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: location.available > 0 ? "white" : "#f3f4f6",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{location.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {location.available} spots available
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="h6" color="primary.main">
                        ₹{location.rate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per hour
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 3: // Alerts
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: "primary.dark" }}>
              Notifications
            </Typography>
            {notificationList.length > 0 ? (
              notificationList.map((notification) => (
                <Card
                  key={notification.id}
                  sx={{
                    mb: 2,
                    borderLeft: 6,
                    borderColor:
                      notification.type === "parking"
                        ? "primary.main"
                        : notification.type === "traffic"
                        ? "warning.main"
                        : "error.main",
                  }}
                >
                  <CardContent>
                    <Typography variant="body1">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    No new notifications
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <Box sx={{ height: "100vh", maxWidth: 480, margin: "0 auto" }}> */}
      <Box
        sx={{
          height: "100vh",
          maxWidth: 480,
          margin: "0 auto",
          background: theme.palette.background.default,
        }}
      >
        <Box sx={{ height: "calc(100% - 65px)", overflow: "auto" }}>
          {renderContent()}
        </Box>

        <Modal
          open={openBookingModal}
          onClose={() => setOpenBookingModal(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: "90%", maxWidth: 400, m: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Book Parking at {selectedLocation?.name}
              </Typography>
              <TextField
                label="Vehicle Number"
                fullWidth
                value={bookingDetails.vehicle}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    vehicle: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Time"
                type="time"
                fullWidth
                value={bookingDetails.time}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, time: e.target.value })
                }
                sx={{ mb: 3 }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography>Rate per hour:</Typography>
                <Typography color="primary.main">
                  ₹{selectedLocation?.rate}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  color="inherit"
                  onClick={() => setOpenBookingModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleBookingSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Modal>

        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackBarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackBarOpen(false)}
            severity="success"
            variant="filled"
          >
            Parking spot booked successfully!
          </Alert>
        </Snackbar>

        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: 480,
            margin: "0 auto",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <BottomNavigation
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            showLabels
            sx={{
              height: 65,
              borderRadius: "16px 16px 0 0",
              "& .Mui-selected": {
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.875rem",
                  transition: "all 0.2s",
                },
              },
            }}
          >
            <BottomNavigationAction label="Traffic" icon={<FaTrafficLight />} />
            <BottomNavigationAction label="Air Quality" icon={<IoMdCloudy />} />
            <BottomNavigationAction label="Parking" icon={<FaParking />} />
            <BottomNavigationAction
              label="Alerts"
              icon={
                <Badge
                  badgeContent={notificationList.length}
                  color="error"
                  sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem" } }}
                >
                  <AiOutlineBell />
                </Badge>
              }
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default MobileTrafficApp;
