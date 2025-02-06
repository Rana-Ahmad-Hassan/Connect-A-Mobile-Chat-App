import { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native"
import { Link, useRouter } from "expo-router"
import { CameraIcon, PlusCircleIcon } from "lucide-react-native"
import { useGetLoggedInUserStatuses } from "@/hooks/getStatus"
import { useAuthContext } from "@/context/authContext"

interface Status {
  _id: string
  user: string
  mediaUrl: string
  mediaType: "image" | "video"
  expiresAt: string
  createdAt: string
}

const StatusScreen = () => {
  const [userStatuses, setUserStatuses] = useState<Status[]>([])
  const [contactStatuses, setContactStatuses] = useState<Status[]>([])
  const { getStatus } = useGetLoggedInUserStatuses()
  const { authUser } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    fetchStatuses()
  }, [])

  const fetchStatuses = async () => {
    try {
      const data = await getStatus(authUser?.token)
      const currentUserStatuses = data.filter((status: Status) => status.user === authUser?.user.id)
      const otherStatuses = data.filter((status: Status) => status.user !== authUser?.user.id)
      setUserStatuses(currentUserStatuses)
      setContactStatuses(otherStatuses)
    } catch (error) {
      console.error("Error fetching statuses:", error)
    }
  }

  const renderStatusItem = ({ item }: { item: Status }) => (
    <Link
      href={{
        pathname: "/StatusViewer",
        // Pass all statuses for this user, not just the single item
        params: {
          statuses: JSON.stringify(
            item.user === authUser?.user.id ? userStatuses : contactStatuses.filter((status) => status.user === item.user),
          ),
          initialIndex: "0",
        },
      }}
      asChild
    >
      <TouchableOpacity className="flex-row items-center p-4">
        <View className="relative">
          <Image source={{ uri: item.mediaUrl }} className="w-14 h-14 rounded-full" />
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </View>
        <View className="ml-4">
          <Text className="font-medium">{item.user === authUser?.user.id ? "My Status" : "Contact Name"}</Text>
          <Text className="text-gray-500 text-sm">
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )

  return (
    <View className="flex-1 bg-gray-100">
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
                source={{ uri: userStatuses[0]?.mediaUrl || "https://via.placeholder.com/100" }}
                className="w-14 h-14 rounded-full"
              />
            </View>
            {userStatuses.length === 0 && (
              <PlusCircleIcon className="absolute bottom-0 right-0 bg-white rounded-full" size={20} color="#007AFF" />
            )}
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-base font-medium">My Status</Text>
            <Text className="text-sm text-gray-500">
              {userStatuses.length > 0 ? "Tap to view your status" : "Add to my status"}
            </Text>
          </View>
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              /* Handle camera click */
            }}
          >
            <CameraIcon size={24} color="#007AFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Link>

      <Text className="p-4 text-gray-500 font-medium">Recent updates</Text>
      <FlatList data={contactStatuses} renderItem={renderStatusItem} keyExtractor={(item) => item._id} />
    </View>
  )
}

export default StatusScreen

