import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, PlusCircleIcon, UploadIcon } from "lucide-react-native";
import { useGetLoggedInUserStatuses } from "@/hooks/getStatus";
import { useAuthContext } from "@/context/authContext";
import { useUploadStatus } from "@/hooks/uploadStatus";
import { GroupedStatuses, Status } from "@/types/status";
import { useGetStatusFeed } from "@/hooks/getStatusFeed";

const StatusScreen = () => {
  const [userStatuses, setUserStatuses] = useState<Status[]>([]);
  const [contactStatuses, setContactStatuses] = useState<GroupedStatuses[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{
    uri: string;
    type: string;
  } | null>(null);

  const { getStatus, loading } = useGetLoggedInUserStatuses();
  const { authUser } = useAuthContext();
  const router = useRouter();
  const { uploadStatus, loading: uploadProgress } = useUploadStatus();
  const { getStatusFeed, loading: feedLoading } = useGetStatusFeed();

  const fetchStatuses = async () => {
    try {
      const data = await getStatus(authUser?.token);
      const currentUserStatuses = data.filter(
        (status: Status) => status.user === authUser?.user.id
      );
      setUserStatuses(currentUserStatuses);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchContactStatuses = async () => {
    try {
      const data = await getStatusFeed(authUser?.token);
      const groupedStatuses = data.reduce((acc: any, status: any) => {
        const userId = status.user._id;
        if (!acc[userId]) {
          acc[userId] = {
            user: status.user,
            statuses: [],
          };
        }
        acc[userId].statuses.push(status);
        return acc;
      }, {} as Record<string, { user: Status["user"]; statuses: Status[] }>);
      const formattedStatuses: any = Object.values(groupedStatuses);

      setContactStatuses(formattedStatuses);
    } catch (error) {
      console.error("Error fetching contact statuses:", error);
    }
  };

  useEffect(() => {
    fetchContactStatuses();
  }, []);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const media = result.assets[0];
      setSelectedMedia({ uri: media.uri, type: media.type || "image" });
    }
  };

  const uploadMedia = () => {
    if (selectedMedia) {
      const file = {
        uri: selectedMedia.uri,
        type: selectedMedia.type,
        name: selectedMedia.uri.split("/").pop() || "status-media",
      };

      uploadStatus(file, authUser?.token)
        .then(() => {
          setSelectedMedia(null);
          fetchStatuses();
        })
        .catch((error) => console.error("Error uploading media:", error));
    }
  };

  const renderStatusItem = ({
    item,
  }: {
    item: {
      _id: string;
      user: Status["user"];
      statuses: Status[];
    };
  }) => (
    <Link
      key={item._id}
      href={{
        pathname: "/StatusViewer",
        params: {
          statuses: JSON.stringify(item.statuses),
          initialIndex: "0",
        },
      }}
      asChild
    >
      <TouchableOpacity className="flex-row items-center p-4">
        <View className="relative">
          <Image
            source={{ uri: item.statuses[0]?.mediaUrl }}
            className="w-14 h-14 rounded-full"
          />
        </View>
        <View className="ml-4">
          <Text className="font-medium">{item?.user?.username}</Text>
          <Text className="text-gray-500 text-sm">
            {new Date(item.statuses[0]?.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {userStatuses.length > 0 ? (
        <Link
          href={{
            pathname: "/StatusViewer",
            params: {
              statuses: JSON.stringify(userStatuses),
              initialIndex: "0",
            },
          }}
          asChild
        >
          <TouchableOpacity className="flex-row items-center p-4 bg-white">
            <View className="relative">
              <View className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <Image
                  source={{
                    uri:
                      userStatuses[0]?.mediaUrl ||
                      "https://via.placeholder.com/100",
                  }}
                  className="w-14 h-14 rounded-full"
                />
              </View>
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-base font-medium">My Status</Text>
              <Text className="text-sm text-gray-500">
                Tap to view your status
              </Text>
            </View>
            <TouchableOpacity className="p-2" onPress={pickMedia}>
              <CameraIcon size={24} color="#007AFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Link>
      ) : (
        <View className="flex-row items-center p-4 bg-white">
          <View className="relative">
            <View className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                className="w-14 h-14 rounded-full"
              />
            </View>
            <PlusCircleIcon
              className="absolute bottom-0 right-0 bg-white rounded-full"
              size={20}
              color="#007AFF"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-base font-medium">My Status</Text>
            <Text className="text-sm text-gray-500">Add to my status</Text>
          </View>
          <TouchableOpacity className="p-2" onPress={pickMedia}>
            <CameraIcon size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}

      {selectedMedia && (
        <View className="p-4 bg-white flex-row items-center justify-between">
          <Text className="text-gray-600">Selected: {selectedMedia.type}</Text>
          <TouchableOpacity className="p-2" onPress={uploadMedia}>
            <UploadIcon size={24} color="orange" />
          </TouchableOpacity>
        </View>
      )}
      {uploadProgress && <ActivityIndicator size="small" color="orange" />}

      <Text className="p-4 text-gray-500 font-medium">Recent updates</Text>
      <FlatList
        data={contactStatuses ?? []}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item?._id ?? Math.random().toString()}
      />
    </View>
  );
};

export default StatusScreen;
