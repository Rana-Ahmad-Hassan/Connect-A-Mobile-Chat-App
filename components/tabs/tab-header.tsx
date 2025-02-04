import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSegments } from "expo-router";
import { useAuthContext } from "@/context/authContext";
import { useLogout } from "@/hooks/logout";

const TabHeader: React.FC = () => {
  const { authUser } = useAuthContext();
  const segments = useSegments();
  const { logout } = useLogout();

  const getTabName = () => {
    const tab = segments[1];
    if (!tab) return "Chats";
    if (tab === "status") return "Status";

    const tabNames: Record<string, string> = {
      contacts: "Contacts",
      chats: "Chats",
      status: "Status",
    };

    return tabNames[tab] || "Chats";
  };

  return (
    <SafeAreaView className="bg-white border-b border-gray-200">
      <View className="flex-row justify-between items-center p-3 ">
        <Text className="text-xl font-semibold">{getTabName()}</Text>
        <View className="w-12 h-12 rounded-full bg-orange-500 items-center justify-center">
          <Text className="text-white font-medium">
            {authUser?.user.username?.[0] || "?"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TabHeader;
