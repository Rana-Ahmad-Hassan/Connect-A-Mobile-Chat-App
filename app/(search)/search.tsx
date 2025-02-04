import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { ArrowLeftIcon, SearchIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSearchContacts } from "@/hooks/search";
import { useAuthContext } from "@/context/authContext";
import { Search } from "@/types/search";
import { useCreateConversation } from "@/hooks/createConversation";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const { searchContacts, loading } = useSearchContacts();
  const [results, setResults] = useState<Search[] | null>([]);
  const { authUser } = useAuthContext();
  const { createConversation, loading: creatingConversation } =
    useCreateConversation();

  const token = authUser?.token

  const handleSearch = () => {
    if (search.trim().length > 0) {
      searchContacts(search, token)
        .then((data) => setResults(data))
        .catch((error) => console.error(error));
    } else {
      setResults([]);
    }
  };

  const handleCreateConversation = async (id: string) => {
    if (!token) {
      console.error("Token is missing for creating conversation");
      return;
    }

    try {
      console.log("Creating conversation with token:", token);
      await createConversation(id, token);
      router.push(`/(tabs)/chats`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 text-black border-b border-black p-3 rounded-xl px-2"
          placeholder="Search"
          placeholderTextColor="gray"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          className="p-3 bg-orange-500 rounded-full"
          onPress={handleSearch}
        >
          <SearchIcon size={20} color="white" className="ml-2" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-2 border-b border-gray-300">
            <View className="flex-row">
              <View className="w-12 h-12 rounded-full bg-gray-200 mr-4 items-center justify-center">
                <Text className="text-gray-500 font-medium">
                  {item?.username?.[0] || "?"}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-black font-bold">{item?.username}</Text>
                <Text className="text-black text-sm">{item?.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleCreateConversation(item._id)}
            >
              <Text className="text-xs text-gray-500">Add to Contacts</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => {
          if (search.trim().length === 0) {
            return (
              <View className="flex-1 items-center justify-center mt-10">
                <Text className="text-gray-500">Please Search Someone</Text>
              </View>
            );
          }

          if (loading) {
            return (
              <View className="flex-1 items-center justify-center mt-10">
                <Text className="text-gray-500">Loading...</Text>
              </View>
            );
          }

          return (
            <View className="flex-1 items-center justify-center mt-10">
              <Text className="text-gray-500">No Results Found</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
