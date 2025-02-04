import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useGetConversations } from "@/hooks/getConversations";
import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/context/authContext";
import { useSocketContext } from "@/context/socketContext"; // Import socket context
import { router } from "expo-router";
import LoadingState from "@/components/loading";

const ChatList = () => {
  const { loading, error, getConversations } = useGetConversations();
  const [conversations, setConversations] = useState<any[]>([]);
  const { authUser } = useAuthContext();
  const { onlineUsers } = useSocketContext(); // Get online users list from socket context
  const token = authUser?.token;
  console.log(authUser?.user.id, "auth user id")
  console.log(onlineUsers, "online user")

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
    return <LoadingState/>
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {conversations.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No conversations found
          </Text>
        ) : (
          conversations.map((chat) => {
            const userId = chat.participants?.[0]?._id;
            const isOnline = onlineUsers.includes(userId); 

            return (
              <TouchableOpacity
                key={chat._id}
                className="flex-row items-start p-4 border-b border-gray-100"
                onPress={() =>
                  router.push(
                    `/(chatSection)/${encodeURIComponent(userId)}/${encodeURIComponent(chat._id)}`
                  )
                }
              >
                <View className="relative">
                  {/* Profile Picture */}
                  <View className="w-12 h-12 rounded-full bg-gray-200 mr-4 items-center justify-center">
                    <Text className="text-gray-500 font-medium">
                      {chat.participants?.[0]?.username?.[0] || "?"}
                    </Text>
                  </View>

                  {isOnline ? (
                    <View className="absolute w-3 h-3 bg-green-500 rounded-full bottom-10 right-12 border-2 border-white"></View>
                  ) : (
                    <View className="absolute w-3 h-3 bg-gray-500 rounded-full bottom-10 right-12 border-2 border-white"></View>
                  )}
                </View>

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base font-semibold">
                      {chat.participants?.[0]?.username || "Unknown"}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {new Date(chat.updatedAt).toLocaleTimeString()}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-sm text-gray-500 flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {chat.messages?.length > 0
                        ? "You have messages"
                        : "No messages yet"}
                    </Text>
                  </View>
                </View>

                <ChevronRight className="text-gray-400 ml-2" size={20} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;
