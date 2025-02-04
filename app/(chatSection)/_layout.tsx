import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ChatSectionLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]/[chatId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ChatSectionLayout;
