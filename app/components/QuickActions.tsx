import React from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const actions = [
  {
    icon: "description",
    label: "Documents",
    color: "#E8B84E",
    bgColor: "#E8B84E4a",
  },
  {
    icon: "g-translate",
    label: "Translate",
    color: "#4285F4",
    bgColor: "#4285F44a",
  },
  {
    icon: "school",
    label: "Education",
    color: "#34A853",
    bgColor: "#34A8534a",
  },
  {
    icon: "music-note",
    label: "Music",
    color: "#EA4335",
    bgColor: "#EA43354a",
  },
];
export const QuickActions = () => {
  return (
    <View style={{ gap: 10, flexDirection: "row", flexWrap: "wrap" }}>
      {actions.map((action, index) => (
        <TouchableOpacity key={index} activeOpacity={0.8} style={styles.action}>
          <View
            style={[styles.iconContainer, { backgroundColor: action.bgColor }]}
          >
            <MaterialIcons name={action.icon} size={24} color={action.color} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  action: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    color: "#ffffff",
    fontSize: 12,
  },
});
