import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import TabHeader from "@/components/tabs/tab-header";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TabsLayout = () => {
  return (
    <>
      <TabHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "white",
            paddingTop: 10,
            paddingBottom: 10,
            height: 90,
            shadowColor: "#000",
          },
        }}
      >
        <Tabs.Screen
          name="chats"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="chat" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="status"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="thought-bubble-outline"
                size={30}
                color={color}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="contacts" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
