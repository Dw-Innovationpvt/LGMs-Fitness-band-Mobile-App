import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBLEStore } from './augBleStore';

export const useBLEReconnectionStore = create(
  persist(
    (set, get) => ({
      // Stored connection data
      savedDevice: null,
      savedCharacteristic: null,
      isAttemptingReconnect: false,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      lastKnownRSSI: null,
      lastDisconnectTime: null,
      
      // Save device connection data
      saveConnectionData: (device, characteristic) => {
        const deviceData = {
          id: device.id,
          name: device.name,
          localName: device.localName,
          serviceUUIDs: device.serviceUUIDs,
          serviceUUID: characteristic?.serviceUUID,
          characteristicUUID: characteristic?.uuid,
          mtus: device.mtu
        };
        
        console.log('Saving connection data for auto-reconnect:', deviceData.id);
        set({ 
          savedDevice: deviceData,
          savedCharacteristic: characteristic ? {
            uuid: characteristic.uuid,
            serviceUUID: characteristic.serviceUUID,
            isNotifiable: characteristic.isNotifiable,
            isWritableWithResponse: characteristic.isWritableWithResponse,
            isWritableWithoutResponse: characteristic.isWritableWithoutResponse
          } : null,
          reconnectAttempts: 0 // Reset attempts when saving new connection
        });
      },
      
      // Clear saved connection data
      clearConnectionData: () => {
        console.log('Clearing saved connection data');
        set({ 
          savedDevice: null, 
          savedCharacteristic: null,
          isAttemptingReconnect: false,
          reconnectAttempts: 0,
          lastDisconnectTime: null
        });
      },
      
      // Handle disconnection and attempt reconnect
      handleDisconnection: async () => {
        const { 
          savedDevice, 
          isAttemptingReconnect, 
          reconnectAttempts, 
          maxReconnectAttempts 
        } = get();
        
        if (!savedDevice || isAttemptingReconnect || reconnectAttempts >= maxReconnectAttempts) {
          return false;
        }
        
        console.log(`Attempting reconnection (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
        
        set({ 
          isAttemptingReconnect: true,
          lastDisconnectTime: new Date().toISOString()
        });
        
        try {
          // Exponential backoff: 2s, 4s, 8s, 16s, 32s
          const delay = Math.min(2000 * Math.pow(2, reconnectAttempts), 32000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          const success = await get().attemptReconnection();
          
          if (success) {
            console.log('✅ Auto-reconnection successful!');
            set({ reconnectAttempts: 0 });
            return true;
          } else {
            set(state => ({ reconnectAttempts: state.reconnectAttempts + 1 }));
            return false;
          }
          
        } catch (error) {
          console.error('Reconnection error:', error);
          set(state => ({ reconnectAttempts: state.reconnectAttempts + 1 }));
          return false;
        } finally {
          set({ isAttemptingReconnect: false });
        }
      },
      
      // Attempt to reconnect to saved device using main BLE store logic
      attemptReconnection: async () => {
        const { savedDevice } = get();
        const bleStore = useBLEStore.getState();
        
        if (!savedDevice) {
          console.log('No saved device available for reconnection');
          return false;
        }
        
        try {
          console.log('Attempting to reconnect to device:', savedDevice.id);
          
          // Use the main BLE store's bleManager
          const { bleManager } = bleStore;
          
          // Check if BLE is enabled
          const state = await bleManager.state();
          if (state !== 'PoweredOn') {
            console.log('Bluetooth not enabled, cannot reconnect');
            return false;
          }
          
          // Create device object using main BLE manager
          const device = bleManager.createDevice(savedDevice.id);
          
          console.log('Reconnecting to device...');
          
          // Use the main store's connection logic but skip some initial setup
          // since we're reconnecting to a known device
          await device.connect();
          console.log('Reconnected to device, discovering services...');
          
          // Discover services
          await device.discoverAllServicesAndCharacteristics();
          
          // Try to request MTU again
          try {
            await device.requestMTU(185);
          } catch (mtuError) {
            console.warn('MTU request failed during reconnect:', mtuError);
          }
          
          // Find services (using logic from main store)
          const services = await device.services();
          let targetService = null;
          let targetCharacteristic = null;
          
          const normalizedTargetServiceUUID = this.normalizeUUID(SERVICE_UUID);
          const normalizedTargetCharUUID = this.normalizeUUID(CHARACTERISTIC_UUID);
          
          // Find service
          for (const service of services) {
            const normalizedServiceUUID = this.normalizeUUID(service.uuid);
            if (normalizedServiceUUID === normalizedTargetServiceUUID) {
              targetService = service;
              break;
            }
          }
          
          if (!targetService) {
            console.error('Target service not found during reconnection');
            return false;
          }
          
          // Find characteristic
          const characteristics = await device.characteristicsForService(targetService.uuid);
          for (const char of characteristics) {
            const normalizedCharUUID = this.normalizeUUID(char.uuid);
            if (normalizedCharUUID === normalizedTargetCharUUID) {
              targetCharacteristic = char;
              break;
            }
          }
          
          if (!targetCharacteristic) {
            console.warn('Target characteristic not found during reconnection, using first available');
            targetCharacteristic = characteristics[0];
          }
          
          console.log('Reconnection successful, characteristic found:', targetCharacteristic.uuid);
          
          // Update the main BLE store with reconnected device
          bleStore.setReconnectedDevice(device, targetCharacteristic);
          
          // Update stored data with reconnected device
          get().saveConnectionData(device, targetCharacteristic);
          
          // Set up monitoring again
          await get().setupReconnectedMonitoring(device, targetService, targetCharacteristic);
          
          // Send restart commands to device
          await get().sendReconnectionCommands();
          
          return true;
          
        } catch (error) {
          console.error('Reconnection attempt failed:', error);
          return false;
        }
      },
      
      // Set up monitoring for reconnected device
      setupReconnectedMonitoring: async (device, service, characteristic) => {
        const bleStore = useBLEStore.getState();
        
        if (characteristic.isNotifiable) {
          console.log('Setting up monitoring for reconnected device...');
          
          device.monitorCharacteristicForService(
            service.uuid,
            characteristic.uuid,
            (error, char) => {
              if (error) {
                console.error('❌ Monitor error after reconnect:', error);
                
                // If monitoring fails, try to reconnect again
                if (error.message.includes('disconnected')) {
                  get().handleDisconnection();
                }
                return;
              }
              
              // Use the main store's data handling logic
              const base64Value = char?.value;
              if (!base64Value) {
                console.warn('⚠ Empty characteristic value after reconnect');
                return;
              }
              
              try {
                const json = Buffer.from(base64Value, 'base64').toString('utf-8');
                console.log('📨 Received data after reconnect:', json);
                
                // Parse and handle data using main store's logic
                // You might want to expose this logic from your main store
                bleStore.handleIncomingData(json);
                
              } catch (decodeErr) {
                console.error('❌ Base64 decoding error after reconnect:', decodeErr);
              }
            }
          );
        }
      },
      
      // Send necessary commands after reconnection
      sendReconnectionCommands: async () => {
        const bleStore = useBLEStore.getState();
        
        try {
          console.log('Sending reconnection commands to device...');
          
          // Wait a moment for monitoring to be established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Turn on the device
          await bleStore.sendCommand('TURN_ON');
          console.log('✅ Turn on command sent after reconnection');
          
          // Restore previous mode
          const { currentMode } = bleStore;
          let modeCommand = 'SET_MODE STEP_COUNTING';
          if (currentMode === 'SS') modeCommand = 'SET_MODE SKATING_SPEED';
          if (currentMode === 'SD') modeCommand = 'SET_MODE SKATING_DISTANCE';
          
          await bleStore.sendCommand(modeCommand);
          console.log(`✅ Mode ${currentMode} restored after reconnection`);
          
        } catch (cmdError) {
          console.warn('⚠ Could not send commands after reconnection:', cmdError);
        }
      },
      
      // Start monitoring for disconnections
      startMonitoring: () => {
        const { savedDevice } = get();
        if (!savedDevice) {
          console.log('No saved device to monitor');
          return;
        }
        
        console.log('Starting connection monitoring for device:', savedDevice.id);
        
        // Set up disconnect listener using main BLE store's manager
        const { bleManager } = useBLEStore.getState();
        
        // Listen for disconnections
        const subscription = bleManager.onDeviceDisconnected((error, device) => {
          if (device?.id === savedDevice.id) {
            console.log('Device disconnected, starting auto-reconnect...');
            get().handleDisconnection();
          }
        });
        
        return subscription;
      },
      
      // Stop all reconnection attempts and monitoring
      stopMonitoring: () => {
        set({ isAttemptingReconnect: false });
      },
      
      // Check if we have a saved device to reconnect to
      hasSavedDevice: () => {
        return !!get().savedDevice;
      },
      
      // Get reconnection status
      getReconnectionStatus: () => {
        const { isAttemptingReconnect, reconnectAttempts, maxReconnectAttempts, savedDevice } = get();
        return {
          isAttemptingReconnect,
          reconnectAttempts,
          maxReconnectAttempts,
          hasSavedDevice: !!savedDevice,
          canReconnect: reconnectAttempts < maxReconnectAttempts,
          lastDisconnectTime: get().lastDisconnectTime
        };
      },
      
      // Update RSSI data for distance tracking
      updateRSSI: (rssi) => {
        set({ lastKnownRSSI: rssi });
      },
      
      // Manual reconnection trigger
      manualReconnect: async () => {
        set({ reconnectAttempts: 0 }); // Reset attempts for manual reconnect
        return await get().handleDisconnection();
      },
      
      // Helper function to normalize UUIDs (same as in main store)
      normalizeUUID: (uuid) => {
        if (!uuid) return '';
        return uuid.toLowerCase().replace(/-/g, '');
      }
    }),
    {
      name: 'ble-reconnection-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedDevice: state.savedDevice,
        savedCharacteristic: state.savedCharacteristic,
        lastKnownRSSI: state.lastKnownRSSI,
        lastDisconnectTime: state.lastDisconnectTime
      })
    }
  )
);