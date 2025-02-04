import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/context/authContext";

export default function Index() {
  const { authUser } = useAuthContext();
  const router = useRouter();
  console.log(authUser)

  useEffect(() => {
    if (authUser?.token) {
      router.push("/(tabs)/chats");
    }
  }, [authUser, router]);
  console.log(authUser?.token)

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button onPress={() => router.push("/(auth)/sign-up")} title="Sign Up" />
    </View>
  );
}
