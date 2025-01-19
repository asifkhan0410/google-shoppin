import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import CropOverlay from "./components/CropOverLay";

type ResultCard = {
  type: string;
  title: string;
  image: string;
  description: string;
  url: string;
};

const openBrowser = async (url: string) => {
  await WebBrowser.openBrowserAsync(url, {
    enableBarCollapsing: true,
    showInRecents: true,
    toolbarColor: "#202124",
  });
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Mock search results based on cropped regions
const mockSearchResults: Record<string, ResultCard[]> = {
  topLeft: [
    {
      type: "product",
      title: "Wooden Desktop",
      image: "/api/placeholder/150/150",
      description: "Premium wooden desk surface, mahogany finish",
      url: "https://google.com/search?q=wooden+desk",
    },
    {
      type: "visual",
      title: "Similar Wood Patterns",
      image: "/api/placeholder/150/150",
      description: "Wood grain patterns matching your image",
      url: "https://google.com/search?q=wooden+desk",
    },
  ],
  topRight: [
    {
      type: "product",
      title: "Wooden Desktop",
      image: "/api/placeholder/150/150",
      description: "Premium wooden desk surface, mahogany finish",
      url: "https://google.com/search?q=wooden+desk",
    },
    {
      type: "visual",
      title: "Similar Wood Patterns",
      image: "/api/placeholder/150/150",
      description: "Wood grain patterns matching your image",
      url: "https://google.com/search?q=wooden+desk",
    },
  ],
  bottomLeft: [
    {
      type: "product",
      title: "Office Accessories",
      image: "/api/placeholder/150/150",
      description: "Desktop organization tools and accessories",
      url: "https://google.com/search?q=wooden+desk",
    },
    {
      type: "visual",
      title: "Related Setups",
      image: "/api/placeholder/150/150",
      description: "Similar office desk arrangements",
      url: "https://google.com/search?q=wooden+desk",
    },
  ],

  bottomRight: [
    {
      type: "product",
      title: "Office Accessories",
      image: "/api/placeholder/150/150",
      description: "Desktop organization tools and accessories",
      url: "https://google.com/search?q=wooden+desk",
    },
    {
      type: "visual",
      title: "Related Setups",
      image: "/api/placeholder/150/150",
      description: "Similar office desk arrangements",
      url: "https://google.com/search?q=wooden+desk",
    },
  ],
};

export default function SearchResults() {
  const { imageUri } = useLocalSearchParams();
  const [searchResults, setSearchResults] = useState<ResultCard[]>([]);
  const [activeTab, setActiveTab] = useState("All");

  // Mock API call
  const searchWithImage = async (corner: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSearchResults(mockSearchResults[corner]);
  };

  const renderSearchBar = () => (
    <TouchableOpacity style={styles.searchBar} onPress={() => {}}>
      <Image
        source={{ uri: imageUri as string }}
        style={{ width: 30, height: 30, borderRadius: 8 }}
      />
      <Text style={styles.searchText}>Add to search</Text>
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
    >
      {[
        { title: "All" },
        { title: "Products" },
        { title: "Homework" },
        { title: "Visual matches" },
      ].map((tab, index) => (
        <TouchableOpacity
          key={tab.title}
          onPress={() => setActiveTab(tab.title)}
          style={[styles.tab, tab.title === activeTab && styles.activeTab]}
        >
          <Text style={styles.tabText}>{tab.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderResults = () => (
    <ScrollView
      style={styles.resultsContainer}
      contentContainerStyle={{ paddingBottom: 400 }}
    >
      {searchResults.map((result, index) => (
        <Pressable
          onPress={() => openBrowser(result.url)}
          key={index}
          style={styles.resultCard}
        >
          <Image
            source={{ uri: imageUri as string }}
            style={styles.resultImage}
          />
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>{result.title}</Text>
            <Text style={styles.resultDescription}>{result.description}</Text>
            <Text style={styles.resultDescription}>{result.url}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#e8eaed" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google Lens</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#e8eaed" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri as string }}
          style={styles.selectedImage}
        />
        <View
          style={{
            position: "absolute",
            backgroundColor: "#0000003a",
            height: SCREEN_WIDTH,
            width: SCREEN_WIDTH,
          }}
        ></View>
        <CropOverlay
          onRegionSelected={(region) => {
            searchWithImage(region.corner);
          }}
        />
      </View>
      <View>
        {renderSearchBar()}
        {renderTabs()}
        {searchResults?.length > 0 && renderResults()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202124",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    color: "#e8eaed",
    fontSize: 20,
    fontWeight: "500",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: "#303134",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#303134",
    margin: 16,
    padding: 12,
    borderRadius: 24,
  },
  searchText: {
    color: "#e8eaed",
    fontSize: 16,
    marginLeft: 12,
  },
  tabsContainer: {
    // flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    // height: 50
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#8ab4f8",
  },
  tabText: {
    color: "#e8eaed",
    fontSize: 16,
  },
  resultsContainer: {
    // flex: 1,
    padding: 16,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#303134",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  resultImage: {
    width: 100,
    height: 100,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  resultTitle: {
    color: "#e8eaed",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  resultDescription: {
    color: "#9aa0a6",
    fontSize: 14,
  },
});
