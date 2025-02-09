import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/context/authContext";
import Animated, {
  Easing,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const WaterDropAnimation = () => {
  const dropScale = useSharedValue(1);
  const dropOpacity = useSharedValue(1);
  const dropSkew = useSharedValue(0);

  const ripple1Scale = useSharedValue(0.5);
  const ripple1Opacity = useSharedValue(1);
  const ripple2Scale = useSharedValue(0.5);
  const ripple2Opacity = useSharedValue(1);

  useEffect(() => {
    dropScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.sin }),
        withTiming(1, { duration: 1500, easing: Easing.sin })
      ),
      -1,
      true
    );

    dropSkew.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000 }),
        withTiming(-0.2, { duration: 1000 })
      ),
      -1,
      true
    );

    ripple1Scale.value = withRepeat(
      withTiming(3, { duration: 3000, easing: Easing.out(Easing.exp) }),
      -1
    );
    ripple1Opacity.value = withRepeat(withTiming(0, { duration: 3000 }), -1);

    ripple2Scale.value = withDelay(
      1000,
      withRepeat(
        withTiming(3, { duration: 3000, easing: Easing.out(Easing.exp) }),
        -1
      )
    );
    ripple2Opacity.value = withDelay(
      1000,
      withRepeat(withTiming(0, { duration: 3000 }), -1)
    );
  }, []);

  const dropStyle = useAnimatedStyle(() => ({
    width: 80,
    height: 120,
    backgroundColor: "rgba(50, 150, 255, 0.7)",
    borderRadius: 40,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -40,
    marginTop: -60,
    transform: [{ scale: dropScale.value }, { skewX: `${dropSkew.value}rad` }],
    opacity: dropOpacity.value,
  }));

  const rippleStyle = (scale: any, opacity: any) =>
    useAnimatedStyle(() => ({
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: "rgba(0, 122, 255, 0.3)",
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -50,
      marginTop: -50,
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

  return (
    <View className="absolute w-full h-full">
      <Animated.View style={rippleStyle(ripple1Scale, ripple1Opacity)} />
      <Animated.View style={rippleStyle(ripple2Scale, ripple2Opacity)} />

      <Animated.View
        style={[
          dropStyle,
          {
            shadowColor: "#007AFF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          },
        ]}
      >
        <View
          className="absolute top-2 left-2 right-2 bottom-2 bg-white/20 rounded-full"
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default function Index() {
  const { authUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (authUser?.token) {
      router.push("/(tabs)/chats");
    }
  }, [authUser, router]);

  return (
    <View className="flex-1 bg-sky-50 justify-center items-center relative overflow-hidden">
      <Animated.Text
        className="absolute top-12 text-4xl font-bold text-orange-500 z-10 mt-10"
        style={{
          textShadowColor: "rgba(0, 0, 0, 0.1)",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          elevation: 5,
        }}
      >
        Connect
      </Animated.Text>

      <View className="w-full h-96 absolute">
        <WaterDropAnimation />
      </View>

      <Animated.View
        className="absolute bottom-24 z-10 overflow-hidden rounded-2xl"
        style={{
          shadowColor: "#007AFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Button
          onPress={() => router.push("/(auth)/sign-up")}
          title="Get Started"
          color="#007AFF"
        />
      </Animated.View>

      <Animated.View
        className="absolute bottom-20 z-10 overflow-hidden rounded-2xl"
        style={{
          shadowColor: "#007AFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Text className="text-xs text-orange-500 font-semibold">
          connect with your family & friends
        </Text>
      </Animated.View>

      <View className="absolute top-24 right-4 z-10 animate-bounce">
        <Ionicons name="water" size={40} color="orange" />
      </View>
    </View>
  );
}
