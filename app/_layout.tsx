import { Stack } from "expo-router";
import "../global.css";
import { AuthContextProvider } from "@/context/authContext";
import { SocketContextProvider } from "@/context/socketContext";

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(chatSection)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(search)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SocketContextProvider>
    </AuthContextProvider>
  );
}
