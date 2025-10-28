// AppComponent.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useBLEReconnectionStore } from "../store/useBLEReconnectionStore";
import { useBLEStore } from "../store/augBleStore";

const AppComponent = () => {
  const {
    hasSavedDevice,
    manualReconnect,
    getReconnectionStatus,
    savedDevice,
    clearSavedDevice,
    loadSavedDevice, // ✅ Added missing function
  } = useBLEReconnectionStore();

  const {
    isConnected,
    connectToDevice,
    disconnect,
    data,
    currentMode,
    connectedDevice,
  } = useBLEStore();

  // ✅ Handle reconnection status safely
  const reconnectStatus = typeof getReconnectionStatus === "function"
    ? getReconnectionStatus()
    : {
        reconnectAttempts: 0,
        maxReconnectAttempts: 0,
        hasSavedDevice: false,
        lastDisconnectTime: null,
        isAttemptingReconnect: false,
      };

  // ✅ Try auto reconnect when app launches
  useEffect(() => {
    const initBLEConnection = async () => {
      try {
        // Load saved device first
        if (typeof loadSavedDevice === "function") {
          await loadSavedDevice();
        }

        // Check and attempt reconnect
        if (hasSavedDevice() && !isConnected) {
          console.log("🔄 Attempting auto-reconnect on app start...");
          const success = await manualReconnect();

          if (success) {
            console.log("✅ Auto-reconnected successfully!");
            Alert.alert(
              "Reconnected",
              `Connected to ${savedDevice?.name || "device"}`
            );
          } else {
            console.warn("⚠️ Auto-reconnect failed.");
          }
        } else {
          console.log("ℹ️ No saved device found or already connected.");
        }
      } catch (error) {
        console.error("❌ Auto-reconnect error:", error);
      }
    };

    initBLEConnection();
  }, [hasSavedDevice, isConnected]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected && connectedDevice) {
        console.log("Cleaning up BLE connection...");
        disconnect();
      }
    };
  }, [isConnected, connectedDevice]);

  return (
    <View style={styles.container}>
      {/* 🔹 Connection Status Section */}
      <View style={styles.statusCard}>
        <Text style={styles.title}>Connection Status</Text>
        <View
          style={[
            styles.statusRow,
            isConnected ? styles.connected : styles.disconnected,
          ]}
        >
          <View
            style={[
              styles.statusIndicator,
              isConnected
                ? styles.indicatorConnected
                : styles.indicatorDisconnected,
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </Text>
        </View>

        {savedDevice && (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>
              {savedDevice.name || savedDevice.localName || "Unknown Device"}
            </Text>
            <Text style={styles.deviceId}>ID: {savedDevice.id}</Text>
          </View>
        )}

        {isConnected && data && (
          <View style={styles.modeContainer}>
            <Text style={styles.modeText}>Mode: {currentMode}</Text>
          </View>
        )}
      </View>

      {/* 🔹 Reconnection Status Section */}
      <View style={styles.statusCard}>
        <Text style={styles.title}>Reconnection Status</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Attempts:</Text>
          <Text style={styles.value}>
            {reconnectStatus.reconnectAttempts}/{reconnectStatus.maxReconnectAttempts}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Saved Device:</Text>
          <Text
            style={[
              styles.value,
              reconnectStatus.hasSavedDevice
                ? styles.available
                : styles.unavailable,
            ]}
          >
            {reconnectStatus.hasSavedDevice ? "Available" : "None"}
          </Text>
        </View>

        {reconnectStatus.lastDisconnectTime && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Disconnect:</Text>
            <Text style={styles.value}>
              {new Date(reconnectStatus.lastDisconnectTime).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {reconnectStatus.isAttemptingReconnect && (
          <View style={styles.reconnectingContainer}>
            <ActivityIndicator size="small" color="#ffc107" style={{ marginRight: 8 }} />
            <Text style={styles.reconnectingText}>
              Attempting reconnect ({reconnectStatus.reconnectAttempts + 1}/
              {reconnectStatus.maxReconnectAttempts})
            </Text>
          </View>
        )}

        {!isConnected &&
          reconnectStatus.hasSavedDevice &&
          !reconnectStatus.isAttemptingReconnect && (
            <View style={styles.reconnectAvailable}>
              <Text style={styles.reconnectText}>
                Device available for reconnection
              </Text>
            </View>
          )}

        {!reconnectStatus.hasSavedDevice && !isConnected && (
          <View style={styles.noDevice}>
            <Text style={styles.noDeviceText}>
              No device saved for auto-reconnect
            </Text>
          </View>
        )}
      </View>

      {/* 🔹 Live Data Section */}
      {isConnected && data && (
        <View style={styles.statusCard}>
          <Text style={styles.title}>Live Data</Text>
          <View style={styles.dataGrid}>
            {data.stepCount !== undefined && (
              <DataItem label="Steps" value={data.stepCount} />
            )}
            {data.speed !== undefined && (
              <DataItem label="Speed" value={`${data.speed} km/h`} />
            )}
            {data.skatingDistance !== undefined && (
              <DataItem label="Distance" value={`${data.skatingDistance} m`} />
            )}
            {data.maxSpeed !== undefined && (
              <DataItem label="Max Speed" value={`${data.maxSpeed} km/h`} />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// ✅ Reusable Data Item
const DataItem = ({ label, value }) => (
  <View style={styles.dataItem}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  connected: { backgroundColor: "#e8f5e8", borderLeftWidth: 4, borderLeftColor: "#4CAF50" },
  disconnected: { backgroundColor: "#ffebee", borderLeftWidth: 4, borderLeftColor: "#f44336" },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  indicatorConnected: { backgroundColor: "#4CAF50" },
  indicatorDisconnected: { backgroundColor: "#f44336" },
  statusText: { fontSize: 16, fontWeight: "600", color: "#333" },
  deviceInfo: { alignItems: "center", marginVertical: 8 },
  deviceName: { fontSize: 16, fontWeight: "bold", color: "#2196F3" },
  deviceId: { fontSize: 12, color: "#666", marginTop: 4 },
  modeContainer: { alignItems: "center", marginTop: 8 },
  modeText: { fontSize: 14, color: "#666", fontStyle: "italic" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: { fontSize: 14, color: "#666" },
  value: { fontSize: 14, fontWeight: "500", color: "#333" },
  available: { color: "#4CAF50" },
  unavailable: { color: "#f44336" },
  reconnectingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  reconnectingText: { fontSize: 14, color: "#856404", fontWeight: "500" },
  reconnectAvailable: {
    backgroundColor: "#e8f5e8",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  reconnectText: { fontSize: 14, color: "#2e7d32", textAlign: "center", fontWeight: "500" },
  noDevice: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#9e9e9e",
  },
  noDeviceText: { fontSize: 14, color: "#757575", textAlign: "center", fontStyle: "italic" },
  dataGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  dataItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
  },
  dataLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  dataValue: { fontSize: 16, fontWeight: "bold", color: "#2196F3" },
});

export default AppComponent;
