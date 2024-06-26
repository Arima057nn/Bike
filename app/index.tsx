import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { LocationSubscription } from "expo-location";
import { CoordinateOfCyclingInterface } from "@/interfaces/coordinate";
import { cyclingApi } from "@/services/cycling-api";
import Colors from "@/constants/Colors";

const INITIAL_REGION = {
  latitude: 21.03,
  longitude: 105.78,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};
let watchId: LocationSubscription;

export default function Home() {
  const mapRef = useRef<MapView>();
  const [watching, setWatching] = useState(false);
  const [cycling, setCycling] = useState("");

  const startWatchingLocation = async () => {
    console.log("hehe");
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      setWatching(true);

      watchId = await Location.watchPositionAsync(
        { distanceInterval: 1 },
        (location) => {
          const { latitude, longitude } = location.coords;
          console.log("New position:", latitude, longitude);

          sendCoordinate({
            latitude: latitude,
            longitude: longitude,
          });
        }
      );
    } catch (error) {
      console.log("Error watching position:", error);
    }
  };

  const stopWatchingLocation = () => {
    if (watchId) {
      watchId.remove();
      console.log("Đã dừng theo dõi vị trí");
      setWatching(false);
    }
  };

  const sendCoordinate = async ({
    latitude,
    longitude,
  }: CoordinateOfCyclingInterface) => {
    console.log("code", cycling);
    let res = await cyclingApi.sendCoordinate(cycling, {
      latitude,
      longitude,
    });
  };
  console.log("cycling", cycling);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        showsCompass={false}
        toolbarEnabled={false}
        style={styles.map}
        ref={mapRef as React.RefObject<MapView>}
      />

      <TextInput
        value={cycling}
        onChangeText={(text: string) => setCycling(text)}
        style={styles.input}
        keyboardType="default"
        textAlign="center"
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (watching) stopWatchingLocation();
        }}
        style={[
          styles.button,
          {
            left: 0,
            backgroundColor: Colors.yellow,
          },
        ]}
      >
        <Text style={{ color: Colors.lightGrey, fontFamily: "mon-sb" }}>
          Close
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!watching) startWatchingLocation();
        }}
        style={[
          styles.button,
          {
            right: 0,
            backgroundColor: Colors.secondary,
          },
        ]}
      >
        <Text style={{ color: Colors.lightGrey, fontFamily: "mon-sb" }}>
          Start
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: "10%",
    padding: 16,
    borderRadius: 12,
  },
  input: {
    position: "absolute",
    bottom: "20%",
    backgroundColor: Colors.light,
    padding: 12,
    fontSize: 16,
    width: "80%",
    fontWeight: "bold",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.Gray300,
    color: Colors.Gray600,
  },
});
