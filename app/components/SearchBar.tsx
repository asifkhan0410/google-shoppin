import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export const SearchBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="#9AA0A6" />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#9AA0A6"
        />
        <Link href='/search-results' asChild>
            <TouchableOpacity>
          <MaterialIcons name="mic" size={24} color="#8AB4F8" />
          </TouchableOpacity>
        </Link>
        <Link href={'/lens-search'}>
          <MaterialIcons name="camera-alt" size={24} color="#8AB4F8" />
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#303134",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 8,
  },
});
