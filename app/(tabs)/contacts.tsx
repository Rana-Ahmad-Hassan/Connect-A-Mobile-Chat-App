import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useGetConversations } from "@/hooks/getConversations";
import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/context/authContext";
import { router } from "expo-router";
import LoadingState from "@/components/loading";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ContactsScreen = () => {
  const { loading, error, getConversations } = useGetConversations();
  const [conversations, setConversations] = useState<any[]>([]);
  const { authUser } = useAuthContext();
  const token = authUser?.token;

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getConversations(token);
      if (JSON.stringify(data) !== JSON.stringify(conversations)) {
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) {
    return <LoadingState />;
  }
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 pt-0 pb-16">
        {conversations.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No Contacts found
          </Text>
        ) : (
          conversations.map((chat) => {
            return (
              <TouchableOpacity
                key={chat._id}
                className="flex-row items-center p-4 border-b border-gray-100"
              >
                <View className="relative">
                  <View className="w-12 h-12 rounded-full bg-gray-200 mr-4 items-center justify-center">
                    <Text className="text-gray-500 font-medium">
                      {chat.participants?.[0]?.username?.[0] || "?"}
                    </Text>
                  </View>
                </View> 

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base font-semibold">
                      {chat.participants?.[0]?.username || "Unknown"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View className="absolute bottom-4 right-4">
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Text className="p-3 bg-orange-500 rounded-full">
            <MaterialCommunityIcons
              name="message-plus"
              size={24}
              color="white"
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactsScreen;
