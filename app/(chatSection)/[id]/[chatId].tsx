import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ArrowLeftIcon, ArrowUp } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState, useRef } from "react";
import { useSendMessage } from "@/hooks/sendMessage";
import { useAuthContext } from "@/context/authContext";
import { useGetMessages } from "@/hooks/getMessages";
import { useSocketContext } from "@/context/socketContext";
import LoadingState from "@/components/loading";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

const ChatSection = () => {
  const router = useRouter();
  const { sendMessage, loading } = useSendMessage();
  const { getMessages, loading: getMessagesLoadingState } = useGetMessages();
  const { id, chatId } = useLocalSearchParams();
  const { authUser } = useAuthContext();
  const { socket, onlineUsers } = useSocketContext();

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [online, setOnline] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      setOnline(onlineUsers.includes(id.toString()));
    }
  }, [id, onlineUsers]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const response = await getMessages(chatId.toString(), authUser?.token);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [chatId, authUser?.token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on("userTyping", (data: { senderId: string }) => {
        if (data.senderId === id) {
          setIsTyping(true);
        }
      });

      socket.on("userStoppedTyping", (data: { senderId: string }) => {
        if (data.senderId === id) {
          setIsTyping(false);
        }
      });

      socket.on("incomingCall", (data: any) => {
        if(data === id){
          Alert.alert(
            "Incoming Call",
            `${data} is calling you`,
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Accept",
                onPress: () => {
                  socket.emit("answerCall", {
                    callId: data.callId,
                    receiverId: id,
                  });
                },
              },
            ],
            { cancelable: false }
          );
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("userStoppedTyping");
        socket.off("incomingCall");
      }
    };
  }, [socket, id]);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleTyping = () => {
    if (!authUser?.user?.id || !id) return;

    socket?.emit("typing", {
      senderId: authUser.user.id,
      receiverId: id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", {
        senderId: authUser.user.id,
        receiverId: id,
      });
    }, 1000);
  };

  const sendMessages = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      _id: new Date().toISOString(),
      senderId: authUser?.user?.id || "",
      receiverId: id.toString(),
      message: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await sendMessage(message, id.toString(), authUser?.token);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (getMessagesLoadingState) {
    return <LoadingState />;
  }

  const initialCall = () => {
    socket?.emit("callUser", {
      from: authUser?.user.id,
      to: id,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <View className="flex-row justify-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftIcon className="text-gray-600" size={24} color="black" />
          </TouchableOpacity>
          <View className="ml-4">
            <Text className="text-lg font-semibold">John Doe</Text>
            {online && <Text className="text-sm text-orange-500">Online</Text>}
          </View>
        </View>
        <TouchableOpacity onPress={initialCall}>
          <FontAwesome name="video-camera" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => (
          <View
            key={msg._id}
            className={`mb-4 ${
              msg.senderId === authUser?.user?.id ? "items-end" : "items-start"
            }`}
          >
            <View
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.senderId === authUser?.user?.id
                  ? "bg-orange-500"
                  : "bg-gray-700"
              }`}
            >
              <Text
                className={
                  msg.senderId === authUser?.user?.id
                    ? "text-white text-lg"
                    : "text-white text-lg"
                }
              >
                {msg.message}
              </Text>
              <Text className="text-xs text-white mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View className="items-start mb-4">
            <View className="p-3 rounded-xl bg-gray-100 max-w-[50%]">
              <Text className="text-gray-500 italic">Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="flex-row items-center p-4 border-t border-gray-200 bg-gray-50">
        <TextInput
          className="flex-1 p-3 bg-white rounded-full mr-2"
          placeholder="Type a message..."
          placeholderTextColor="#6b7280"
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            handleTyping();
          }}
        />
        <TouchableOpacity
          className="p-3 bg-blue-500 rounded-full"
          onPress={sendMessages}
          disabled={loading}
        >
          <ArrowUp color={"white"} size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatSection;
