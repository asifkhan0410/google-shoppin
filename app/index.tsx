import React, {
  useState,
  useRef,
  Fragment,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { QuickActions } from "./components/QuickActions";
import { Link } from "expo-router";
import { debounce } from "lodash";

import * as WebBrowser from "expo-web-browser";

const { width } = Dimensions.get("window");

const searchSuggestions = {
  r: [
    "react native",
    "react js",
    "react native expo",
    "react router",
    "react query",
  ],
  re: ["react native", "react js", "reddit", "react router", "real madrid"],
  rea: [
    "react native",
    "react js",
    "react router",
    "react query",
    "react native navigation",
  ],
  f: ["facebook", "flipkart", "facebook login", "fifa", "facebook lite"],
  fc: [
    "fc barcelona",
    "fc bayern munich",
    "fc porto",
    "fc copenhagen",
    "fc arsenal",
  ],
};

export default function GoogleSearchScreen() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarHeight = useRef(new Animated.Value(56)).current;
  const searchBarOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const suggestionsOpacity = useRef(new Animated.Value(0)).current;

  const recentSearches = [
    "fcb",
    "internet speed test",
    "react native",
    "the best react native developer",
    "google logo",
    "lamine yamal",
  ];

  const matchSchedule = [
    { title: "RMA vs LPM", time: "Today 8:45 pm" },
    { title: "VAL vs RSO", time: "Tomorrow 1:30 am" },
    { title: "BET vs BEN", time: "Tomorrow 1:30 am" },
  ];

  const openBrowser = async (query) => {
    await WebBrowser.openBrowserAsync(
      `https://www.google.com/search?q=${query}`,
      {
        enableBarCollapsing: true,
        showInRecents: true,
        toolbarColor: "#202124",
      }
    );
  };

  const animateSearchBar = (active) => {
    Animated.parallel([
      Animated.timing(searchBarOpacity, {
        toValue: active ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: active ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSearchActive(active);
    });
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text.length > 0) {
        // Simulate API call by looking up in our searchSuggestions object
        const results = searchSuggestions[text.toLowerCase()] || [];
        setSuggestions(results);
        setShowSuggestions(true);
        Animated.timing(suggestionsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        setShowSuggestions(false);
        Animated.timing(suggestionsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }, 300),
    []
  );

  const handleSearchInput = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <Animated.View
        style={[styles.suggestionsContainer, { opacity: suggestionsOpacity }]}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(suggestion)}
          >
            <MaterialIcons name="search" size={20} color="#9aa0a6" />
            <Text style={styles.suggestionText}>{suggestion}</Text>
            <TouchableOpacity
              style={styles.insertText}
              onPress={() => {
                openBrowser(suggestion);
                setSearchText(suggestion);
              }}
            >
              <MaterialIcons name="north-west" size={20} color="#9aa0a6" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  const renderMainView = () => (
    <Animated.View
      style={[
        styles.mainContainer,
        {
          opacity: contentOpacity,
        },
      ]}
    >
      <View style={styles.headerIcons}>
        <View style={styles.beakerContainer}>
          <MaterialIcons name="science" size={24} color="#8ab4f8" />
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "/api/placeholder/40/40" }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <Image
        source={{
          uri: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png",
        }}
        style={styles.googleLogo}
        resizeMode="contain"
      />

      <View
        style={styles.searchBar}
        // onPress={() => animateSearchBar(true)}
      >
        <MaterialIcons name="search" size={24} color="#9aa0a6" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#9aa0a6"
          editable={false}
          onPress={() => animateSearchBar(true)}
        />
        <MaterialIcons name="mic" size={24} color="#9aa0a6" />
        <Link href="/lens-search">
          <MaterialIcons name="camera-alt" size={24} color="#9aa0a6" />
        </Link>
      </View>

      <QuickActions />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.matchSchedule}
        contentContainerStyle={{ paddingLeft: 16 }}
      >
        {matchSchedule.map((match, index) => (
          <View key={index} style={styles.matchCard}>
            <Text style={styles.matchTitle}>{match.title}</Text>
            <Text style={styles.matchTime}>{match.time}</Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderSearchView = () => (
    <Animated.View
      style={[
        styles.searchView,
        {
          opacity: searchBarOpacity,
        },
      ]}
    >
      <Pressable
        onPress={() => animateSearchBar(false)}
        style={styles.searchHeader}
      >
        <View style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#9aa0a6" />
        </View>
        <TextInput
          style={styles.searchInputActive}
          placeholder="Search or type URL"
          placeholderTextColor="#9aa0a6"
          autoFocus
          value={searchText}
          onChangeText={handleSearchInput}
        />
        <MaterialIcons name="mic" size={24} color="#9aa0a6" />
        <MaterialIcons name="camera-alt" size={24} color="#9aa0a6" />
      </Pressable>
      {renderSuggestions()}
      {!showSuggestions && (
        <Fragment>
          <View style={styles.recentSearchesHeader}>
            <Text style={styles.recentSearchesTitle}>Recent searches</Text>
            <TouchableOpacity>
              <Text style={styles.manageHistory}>MANAGE HISTORY</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.recentSearches}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => {
                  openBrowser(search);
                  setSearchText(search);
                }}
              >
                <MaterialIcons name="history" size={20} color="#9aa0a6" />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Fragment>
      )}

      <View style={styles.incognitoToggle}>
        {/* <Text style={styles.incognitoText}>Incognito mode</Text> */}
        {/* <Switch value={false} /> */}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {isSearchActive ? renderSearchView() : renderMainView()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202124",
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  beakerContainer: {
    padding: 8,
    borderRadius: 20,
  },
  profileContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  googleLogo: {
    width: "60%",
    height: 30,
    alignSelf: "center",
    marginVertical: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#303134",
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: "#e8eaed",
    marginHorizontal: 12,
    fontSize: 16,
  },
  quickLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  quickLink: {
    alignItems: "center",
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickLinkLabel: {
    color: "#e8eaed",
    fontSize: 12,
  },
  matchSchedule: {
    marginTop: 20,
    width: width,
    marginLeft: -16,
  },
  matchCard: {
    backgroundColor: "#303134",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 150,
    height: 80,
    justifyContent: "center",
  },
  matchTitle: {
    color: "#e8eaed",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  matchTime: {
    color: "#9aa0a6",
    fontSize: 14,
  },
  searchView: {
    flex: 1,
    backgroundColor: "#202124",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#303134",
    borderRadius: 24,
    padding: 12,
    margin: 16,
  },
  backButton: {
    marginRight: 12,
  },
  searchInputActive: {
    flex: 1,
    color: "#e8eaed",
    fontSize: 16,
    marginRight: 12,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  recentSearchesTitle: {
    color: "#e8eaed",
    fontSize: 16,
  },
  manageHistory: {
    color: "#8ab4f8",
    fontSize: 14,
  },
  recentSearches: {
    flex: 1,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  recentSearchText: {
    color: "#e8eaed",
    fontSize: 16,
    marginLeft: 32,
  },
  incognitoToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#303134",
  },
  incognitoText: {
    color: "#e8eaed",
    fontSize: 16,
  },

  suggestionsContainer: {
    backgroundColor: "#202124",
    borderTopWidth: 1,
    borderTopColor: "#303134",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingLeft: 24,
  },
  suggestionText: {
    color: "#e8eaed",
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  insertText: {
    padding: 8,
  },
});
