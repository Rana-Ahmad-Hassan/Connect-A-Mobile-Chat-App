import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSignUp } from "@/hooks/register";

const SignUpScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { signUp } = useSignUp();

  const handleSubmit = async () => {
    try {
      await signUp(username, email, password);
      router.push("/(tabs)/chats");
      Alert.alert("Successfully registered");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to register. Please try again.";
      Alert.alert("Registration Error", errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/authImage.jpg")}
      className="flex-1 justify-end"
    >
      <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-lg rounded-tl-[70px]">
        <Text className="text-4xl font-bold text-orange-500 text-center my-10">
          Sign Up
        </Text>

        {/* Username Input */}
        <View className="flex-row items-center bg-gray-100 p-4 rounded-lg my-5">
          <FontAwesome name="user" size={20} color="#888" />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="flex-1 ml-3 py-3 text-gray-800"
          />
        </View>

        {/* Email Input */}
        <View className="flex-row items-center bg-gray-100 p-4 rounded-lg my-5">
          <MaterialIcons name="email" size={20} color="#888" />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="flex-1 ml-3 py-3 text-gray-800"
          />
        </View>

        {/* Password Input */}
        <View className="flex-row items-center bg-gray-100 p-4 rounded-lg my-5 mb-20">
          <FontAwesome name="lock" size={20} color="#888" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="flex-1 ml-3 py-3 text-gray-800"
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="bg-orange-500 p-6 rounded-lg"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 mt-4">
          Do you have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text className="text-orange-500 font-semibold">Login here</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;
