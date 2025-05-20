import React, { useState, useEffect } from "react";
import { useDeviceData } from "../context/DeviceDataContext";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Box,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const AdminConsole = () => {
  const { addDeviceData, fetchDevices, devices, deleteDevice } =
    useDeviceData();
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    temperature: "",
    humidity: "",
  });
  const [selectedDevice, setSelectedDevice] = useState("");
  const [isNewDevice, setIsNewDevice] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();

  useEffect(() => {
    fetchDevices("/api/devices/latest");
  }, [fetchDevices]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "deviceId" && isNewDevice) {
      // Only allow numbers for device ID
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    setIsNewDevice(false);
    setFormData((prev) => ({
      ...prev,
      deviceId,
      deviceName:
        devices.find((d) => d.deviceId === deviceId)?.deviceName || "",
    }));
  };

  const handleNewDevice = () => {
    setSelectedDevice("");
    setIsNewDevice(true);
    setFormData({
      deviceId: "",
      deviceName: "",
      temperature: "",
      humidity: "",
    });
  };

  const handleDeleteClick = (device) => {
    setDeviceToDelete(device);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deviceToDelete) {
      const success = await deleteDevice(deviceToDelete.deviceId);
      setSnackbar({
        open: true,
        message: success
          ? "Device deleted successfully!"
          : "Failed to delete device",
        severity: success ? "success" : "error",
      });

      if (success) {
        if (selectedDevice === deviceToDelete.deviceId) {
          handleNewDevice();
        }
        setDeleteDialogOpen(false);
        setDeviceToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeviceToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate device ID format
    if (isNewDevice) {
      if (!formData.deviceId) {
        setSnackbar({
          open: true,
          message: "Device ID is required",
          severity: "error",
        });
        return;
      }
      if (!/^\d+$/.test(formData.deviceId)) {
        setSnackbar({
          open: true,
          message: "Device ID must contain only numbers",
          severity: "error",
        });
        return;
      }
    }

    const deviceData = {
      ...formData,
      deviceId: isNewDevice ? `DEV${formData.deviceId}` : formData.deviceId,
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
    };

    const success = await addDeviceData(deviceData);

    if (success) {
      setSnackbar({
        open: true,
        message: isNewDevice
          ? "Device added successfully!"
          : "Data added successfully!",
        severity: "success",
      });
      if (isNewDevice) {
        setFormData({
          deviceId: "",
          deviceName: "",
          temperature: "",
          humidity: "",
        });
      } else {
        setFormData({
          ...formData,
          temperature: "",
          humidity: "",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message:
          "Failed to add data. Please check the device ID and try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleRefresh = () => {
    fetchDevices("/api/devices/latest");
    setSnackbar({
      open: true,
      message: "Data refreshed!",
      severity: "info",
    });
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.8rem", md: "2.125rem" },
            }}
          >
            Admin Console
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            Manage devices and add new readings
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Device List */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Devices
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleNewDevice}
                fullWidth
                sx={{ mb: 2 }}
              >
                Add New Device
              </Button>
              <FormControl fullWidth>
                <InputLabel>Select Device</InputLabel>
                <Select
                  value={selectedDevice}
                  onChange={(e) => handleDeviceSelect(e.target.value)}
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
            </Paper>
          </Grid>

          {/* Device Data Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" gutterBottom>
                {isNewDevice ? "Add New Device" : "Add Data to Device"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Device ID"
                      name="deviceId"
                      value={formData.deviceId}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="large"
                      disabled={!isNewDevice}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {isNewDevice ? "DEV" : ""}
                          </InputAdornment>
                        ),
                      }}
                      helperText={
                        isNewDevice
                          ? "Enter numbers only (DEV prefix will be added automatically)"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Device Name (Optional)"
                      name="deviceName"
                      value={formData.deviceName}
                      onChange={handleChange}
                      variant="outlined"
                      size="large"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Temperature (°C)"
                      name="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="large"
                      inputProps={{ step: "0.1" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°C</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Humidity (%)"
                      name="humidity"
                      type="number"
                      value={formData.humidity}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="large"
                      inputProps={{ step: "0.1" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<AddIcon />}
                          fullWidth
                        >
                          {isNewDevice ? "Add Device" : "Add Data"}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="large"
                          startIcon={<RefreshIcon />}
                          onClick={handleRefresh}
                          fullWidth
                        >
                          Refresh
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete Device</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the device "
              {deviceToDelete?.deviceName || deviceToDelete?.deviceId}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminConsole;
