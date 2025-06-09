import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SkatingTrackingScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
               <Feather name="arrow-left" size={24} color="#000" />
             </TouchableOpacity>

      <Text style={styles.title}>Skating Session Summary</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Feather name="wind" size={28} color="#007AFF" />
          <Text style={styles.label}>Average Speed</Text>
          <Text style={styles.value}>10.4 km/h</Text>
        </View>

        <View style={styles.card}>
          <Feather name="repeat" size={28} color="#FF8C00" />
          <Text style={styles.label}>Strides Count</Text>
          <Text style={styles.value}>4,125</Text>
        </View>

        <View style={styles.card}>
          <Feather name="fire" size={28} color="red" />
          <Text style={styles.label}>Calories Burned</Text>
          <Text style={styles.value}>345 kcal</Text>
        </View>

        <View style={styles.card}>
          <Feather name="trending-up" size={28} color="#6a0dad" />
          <Text style={styles.label}>Altitude Gain</Text>
          <Text style={styles.value}>145 m</Text>
        </View>

        <View style={styles.card}>
          <Feather name="clock" size={28} color="#000" />
          <Text style={styles.label}>Trip Duration</Text>
          <Text style={styles.value}>52 mins</Text>
        </View>

        <View style={styles.card}>
          <Feather name="zap" size={28} color="#32CD32" />
          <Text style={styles.label}>Stride Rate</Text>
          <Text style={styles.value}>92 strides/min</Text>
        </View>
      </View>

      <View style={styles.mapCard}>
        <MaterialIcons name="map" size={32} color="#666" />
        <Text style={styles.mapText}>Skating Route Map (Coming Soon)</Text>
      </View>
    </ScrollView>
  );
};

export default SkatingTrackingScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
    marginTop: -24,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 20,
    marginBottom: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 5,
  },
  mapCard: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 30,
    marginBottom: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  mapText: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
});
