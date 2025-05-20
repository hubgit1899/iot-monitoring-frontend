import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const DeviceDataContext = createContext();

export const useDeviceData = () => useContext(DeviceDataContext);

export const DeviceDataProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = async (endpoint = "/api/devices/latest") => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      setDevices(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch device data");
      console.error("Error fetching devices:", err);
    } finally {
      setLoading(false);
    }
  };

  const addDeviceData = async (deviceData) => {
    try {
      const response = await axios.post(`${API_URL}/api/devices`, deviceData);

      // Update devices list with new data
      setDevices((prevDevices) => {
        // If it's a new device, add it to the list
        if (!prevDevices.find((d) => d.deviceId === deviceData.deviceId)) {
          return [response.data, ...prevDevices];
        }
        // If it's an existing device, update the list with new reading
        return [
          response.data,
          ...prevDevices.filter((d) => d.deviceId !== deviceData.deviceId),
        ];
      });

      setError(null);
      return true;
    } catch (err) {
      setError("Failed to add device data");
      console.error("Error adding device data:", err);
      return false;
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      await axios.delete(`${API_URL}/api/devices/${deviceId}`);
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.deviceId !== deviceId)
      );
      setError(null);
      return true;
    } catch (err) {
      setError("Failed to delete device");
      console.error("Error deleting device:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const value = {
    devices,
    loading,
    error,
    addDeviceData,
    fetchDevices,
    deleteDevice,
  };

  return (
    <DeviceDataContext.Provider value={value}>
      {children}
    </DeviceDataContext.Provider>
  );
};
