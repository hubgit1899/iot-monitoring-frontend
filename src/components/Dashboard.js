import React, { useState, useEffect } from "react";
import { useDeviceData } from "../context/DeviceDataContext";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";
import {
  Thermometer,
  Droplet,
  AlertTriangle,
  Clock,
  Cpu,
  RefreshCw,
} from "lucide-react";

const REFRESH_INTERVAL = 60000; // 1 minute in milliseconds

const Dashboard = () => {
  const { devices, loading, error, fetchDevices } = useDeviceData();
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(REFRESH_INTERVAL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDevices("/api/devices/history");
    setIsRefreshing(false);
    setTimeUntilRefresh(REFRESH_INTERVAL);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1000) {
          handleRefresh();
          return REFRESH_INTERVAL;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    } else if (devices.length === 0) {
      setSelectedDeviceId("");
    } else if (
      selectedDeviceId &&
      !devices.find((d) => d.deviceId === selectedDeviceId)
    ) {
      // If the selected device was deleted, select the first available device
      setSelectedDeviceId(devices[0]?.deviceId || "");
    }
  }, [devices, selectedDeviceId]);

  // Loading state with improved animation
  if (loading) {
    return (
      <Fade in={loading} timeout={800}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor={theme.palette.background.default}
        >
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: "primary.main",
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            Loading device data...
          </Typography>
        </Box>
      </Fade>
    );
  }

  // Error state with improved visual feedback
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, px: { xs: 2, md: 4 } }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            bgcolor: "error.light",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <AlertTriangle size={60} color={theme.palette.error.main} />
          <Typography
            color="error.dark"
            variant="h5"
            align="center"
            sx={{ fontWeight: 600 }}
          >
            Error Loading Dashboard
          </Typography>
          <Typography color="error.dark" variant="body1" align="center">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Filter data for selected device and ensure we have the last 48 points
  const selectedDeviceData = devices
    .filter((device) => device.deviceId === selectedDeviceId)
    .slice(0, 48); // Take only the last 48 points
  const latestDevice = selectedDeviceData[0];
  const reversedDevices = [...selectedDeviceData].reverse();

  const chartData = reversedDevices.map((device) => ({
    ...device,
    timestamp: format(new Date(device.timestamp), "HH:mm"),
    temperature: Number(device.temperature.toFixed(1)),
    humidity: Number(device.humidity.toFixed(1)),
  }));

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "#121212" : "#f5f7fa",
        minHeight: "100vh",
        pb: { xs: 4, md: 6 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "340px",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(244,114,182,0.08) 100%)",
          zIndex: 0,
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 4, md: 5 },
          pb: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08) 0%, transparent 60%)",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: { xs: 1, md: 2 },
                  letterSpacing: 1,
                  fontFamily: "Poppins, sans-serif",
                  textShadow: "0 2px 10px rgba(99,102,241,0.10)",
                  "& span": {
                    color: theme.palette.secondary.main,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      height: "6px",
                      bottom: "-6px",
                      left: 0,
                      background:
                        "linear-gradient(90deg, rgba(99,102,241,0.4) 0%, rgba(244,114,182,0.4) 100%)",
                      borderRadius: "10px",
                      display: { xs: "none", md: "block" },
                    },
                  },
                }}
              >
                IoT <span>Device Dashboard</span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: { xs: 3, md: 4 },
                  fontFamily: "Poppins, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Clock size={16} />
                Last updated:{" "}
                {latestDevice &&
                  format(new Date(latestDevice.timestamp), "PPp")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "flex-start", md: "flex-end" }, // Left align on mobile, right on desktop
                  gap: 2,
                  width: "100%",
                }}
              >
                <FormControl sx={{ minWidth: 200, maxWidth: 250 }}>
                  <InputLabel>Select Device</InputLabel>
                  <Select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    label="Select Device"
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                    }}
                  >
                    {devices
                      .filter(
                        (device, index, self) =>
                          index ===
                          self.findIndex((d) => d.deviceId === device.deviceId)
                      )
                      .map((device) => (
                        <MenuItem key={device.deviceId} value={device.deviceId}>
                          {device.deviceName || device.deviceId}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0, // Prevents the controls from shrinking
                  }}
                >
                  <Tooltip title="Manual Refresh">
                    <IconButton
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      sx={{
                        color: "primary.main",
                        "&:hover": { bgcolor: "primary.light" },
                      }}
                    >
                      <RefreshCw size={20} />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={(timeUntilRefresh / REFRESH_INTERVAL) * 100}
                      size={24}
                      thickness={4}
                      sx={{ color: "primary.main" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {selectedDeviceId ? (
          <>
            {/* Summary Cards */}
            <Box
              sx={{
                display: "grid",
                gap: { xs: 2, md: 3 },
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                mb: { xs: 4, md: 6 },
              }}
            >
              <SummaryCard
                title="Current Temperature"
                value={latestDevice?.temperature.toFixed(1) || "N/A"}
                unit="°C"
                icon={<Thermometer size={28} />}
                gradient="linear-gradient(135deg, #6366f1 0%, #818cf8 100%)"
                change={
                  +(
                    latestDevice?.temperature -
                    (selectedDeviceData[1]?.temperature ||
                      latestDevice?.temperature)
                  ).toFixed(1)
                }
              />

              <SummaryCard
                title="Current Humidity"
                value={latestDevice?.humidity.toFixed(1) || "N/A"}
                unit="%"
                icon={<Droplet size={28} />}
                gradient="linear-gradient(135deg, #f472b6 0%, #fb7185 100%)"
                change={
                  +(
                    latestDevice?.humidity -
                    (selectedDeviceData[1]?.humidity || latestDevice?.humidity)
                  ).toFixed(1)
                }
              />

              <SummaryCard
                title="Device ID"
                value={latestDevice?.deviceId || "N/A"}
                icon={<Cpu size={28} />}
                gradient="linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
                textValue={true}
              />

              <SummaryCard
                title="Device Name"
                value={latestDevice?.deviceName || "Not Set"}
                icon={<AlertTriangle size={28} />}
                gradient="linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
                textValue={true}
              />
            </Box>

            {/* Temperature and Humidity Trend Charts */}
            {/* Side by side on medium/large screens, stacked on small screens */}
            <Box
              sx={{
                display: "grid", // Use CSS Grid for explicit control
                gap: { xs: 2, md: 3 }, // Gap for spacing
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)", // 1 column on extra-small/small
                  sm: "repeat(1, 1fr)", // 1 column on small
                  md: "repeat(2, 1fr)", // 2 columns on medium
                  lg: "repeat(2, 1fr)", // 2 columns on large
                  xl: "repeat(2, 1fr)", // 2 columns on extra-large
                },
                mb: { xs: 4, md: 6 }, // Margin bottom for spacing
              }}
            >
              {/* Temperature Trend Chart */}
              <ChartCard
                title="Temperature Trend"
                subtitle="Last 24 hours"
                height={{ xs: 280, md: 350 }} // Responsive height for the chart content area
              >
                {/* ResponsiveContainer and chart components */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="temperatureGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="timestamp"
                      stroke={theme.palette.text.secondary}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickLine={{ stroke: theme.palette.divider }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickLine={{ stroke: theme.palette.divider }}
                      axisLine={{ stroke: theme.palette.divider }}
                      tickFormatter={(value) => `${value}°C`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      formatter={(value) => [`${value}°C`, "Temperature"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#temperatureGradient)"
                      strokeWidth={3}
                      activeDot={{
                        r: 6,
                        stroke: "#6366f1",
                        strokeWidth: 2,
                        fill: "white",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Humidity Trend Chart */}
              <ChartCard
                title="Humidity Trend"
                subtitle="Last 24 hours"
                height={{ xs: 280, md: 350 }} // Responsive height for the chart content area
              >
                {/* ResponsiveContainer and chart components */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="humidityGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f472b6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f472b6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="timestamp"
                      stroke={theme.palette.text.secondary}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickLine={{ stroke: theme.palette.divider }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickLine={{ stroke: theme.palette.divider }}
                      axisLine={{ stroke: theme.palette.divider }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      formatter={(value) => [`${value}%`, "Humidity"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      stroke="#f472b6"
                      fillOpacity={1}
                      fill="url(#humidityGradient)"
                      strokeWidth={3}
                      activeDot={{
                        r: 6,
                        stroke: "#f472b6",
                        strokeWidth: 2,
                        fill: "white",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </Box>

            {/* Temperature & Humidity Comparison Chart */}
            {/* Always full width */}
            <Box
              sx={{
                display: "grid", // Use CSS Grid for explicit control
                gap: { xs: 2, md: 3 }, // Gap for spacing
                gridTemplateColumns: "repeat(1, 1fr)", // 1 column always
                mb: { xs: 4, md: 6 }, // Margin bottom for spacing
              }}
            >
              <ChartCard
                title="Temperature & Humidity Comparison"
                subtitle="Combined metrics view"
                height={{ xs: 320, md: 400 }} // Responsive height for the chart content area
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="timestamp"
                      stroke={theme.palette.text.secondary}
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickLine={{ stroke: theme.palette.divider }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#6366f1"
                      tick={{
                        fontSize: 12,
                        fill: "#6366f1",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickFormatter={(value) => `${value}°C`}
                      domain={["dataMin - 2", "dataMax + 2"]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#f472b6"
                      tick={{
                        fontSize: 12,
                        fill: "#f472b6",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      tickFormatter={(value) => `${value}%`}
                      domain={["dataMin - 5", "dataMax + 5"]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      formatter={(value, name) => {
                        if (name === "Temperature") return [`${value}°C`, name];
                        if (name === "Humidity") return [`${value}%`, name];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Legend
                      verticalAlign={isMobile ? "bottom" : "top"}
                      height={36}
                      wrapperStyle={{
                        paddingTop: isMobile ? 0 : 20,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        fill: "white",
                        stroke: "#6366f1",
                      }}
                      activeDot={{
                        r: 7,
                        strokeWidth: 2,
                        fill: "white",
                        stroke: "#6366f1",
                      }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      name="Humidity"
                      stroke="#f472b6"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        fill: "white",
                        stroke: "#f472b6",
                      }}
                      activeDot={{
                        r: 7,
                        strokeWidth: 2,
                        fill: "white",
                        stroke: "#f472b6",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </Box>
          </>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Device Selected
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please select a device from the dropdown above to view its data.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

// Reusable component for summary cards
const SummaryCard = ({
  title,
  value,
  unit,
  icon,
  gradient,
  change,
  textValue,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: { xs: "160px", md: "180px" },
        borderRadius: 3,
        overflow: "hidden",
        background: theme.palette.background.paper,
        transition: "transform 0.3s, box-shadow 0.3s",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box
        sx={{
          height: "6px",
          width: "100%",
          background: gradient,
        }}
      />
      <CardContent
        sx={{
          p: { xs: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 42,
              width: 42,
              borderRadius: "12px",
              background: gradient,
              color: "white",
              mr: 2,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontFamily: "Poppins, sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 700,
                color: textValue ? "text.primary" : "text.primary",
                fontFamily: "Poppins, sans-serif",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value}
            </Typography>
            {unit && (
              <Typography
                variant="subtitle1"
                sx={{
                  ml: 0.5,
                  fontWeight: 500,
                  color: "text.secondary",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {unit}
              </Typography>
            )}
          </Box>

          {change !== undefined && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                color:
                  change > 0
                    ? "success.main"
                    : change < 0
                    ? "error.main"
                    : "text.secondary",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {change > 0 ? "+" : ""}
              {change} {unit} since last reading
            </Typography>
          )}
        </Box>
      </CardContent>
    </Paper>
  );
};

// Reusable component for chart cards
const ChartCard = ({ title, subtitle, children, height }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: theme.palette.background.paper,
        height: "100%", // Ensure Paper takes the full height of its grid cell
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 3 },
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
      </CardContent>

      {/* Explicitly set height based on the prop, and ensure it fills available width */}
      <Box sx={{ width: "100%", height: height, flexGrow: 1, flexShrink: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default Dashboard;
