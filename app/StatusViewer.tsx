import { useState, useEffect, useRef } from "react"
import { View, Image, TouchableOpacity, ActivityIndicator, Dimensions, Text } from "react-native"
import { Video, ResizeMode, type AVPlaybackStatus } from "expo-av"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native"

interface Status {
  _id: string
  user: string
  mediaUrl: string
  mediaType: "image" | "video"
  expiresAt: string
  createdAt: string
}

const { width, height } = Dimensions.get("window")
const STATUS_DURATION = 5000 // 5 seconds for each status

const StatusViewer = () => {
  const { statuses: statusesParam, initialIndex: initialIndexParam } = useLocalSearchParams()
  const statuses: Status[] = JSON.parse(statusesParam as string)
  const [currentIndex, setCurrentIndex] = useState(Number.parseInt(initialIndexParam as string, 10) || 0)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const videoRef = useRef<Video>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentStatus = statuses[currentIndex]

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (currentStatus.mediaType === "image") {
      startImageTimer()
    } else if (currentStatus.mediaType === "video") {
      if (videoRef.current) {
        videoRef.current.stopAsync().then(() => {
          videoRef.current?.playAsync()
        })
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentStatus.mediaType])

  const startImageTimer = () => {
    setIsLoading(false)
    timerRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / (STATUS_DURATION / 100)
        if (newProgress >= 100) {
          handleStatusEnd()
          return 0
        }
        return newProgress
      })
    }, 100)
  }

  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  const handleVideoPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const progress = (status.positionMillis / status.durationMillis!) * 100
      setProgress(progress)

      if (status.didJustFinish) {
        handleStatusEnd()
      }
    }
  }

  const handleStatusEnd = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      router.back() // Automatically close the viewer when the last status ends
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      router.back()
    }
  }

  const handleNext = () => {
    handleStatusEnd() // Use the same logic as when a status naturally ends
  }

  if (!currentStatus) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">No status to display</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-between p-2 absolute top-0 left-0 right-0 z-10">
        {statuses.map((_, index) => (
          <View key={index} className="flex-1 h-1 bg-gray-500 mx-1">
            <View
              className="h-full bg-white"
              style={{ width: `${index < currentIndex ? 100 : index === currentIndex ? progress : 0}%` }}
            />
          </View>
        ))}
      </View>

      <View className="flex-row justify-between items-center absolute top-10 left-4 right-4 z-10">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <ChevronRightIcon size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        {isLoading && <ActivityIndicator size="large" color="#ffffff" />}
        {currentStatus.mediaType === "image" ? (
          <Image
            source={{ uri: currentStatus.mediaUrl }}
            style={{ width, height, resizeMode: "contain" }}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <Video
            ref={videoRef}
            source={{ uri: currentStatus.mediaUrl }}
            style={{ width, height }}
            resizeMode={ResizeMode.CONTAIN}
            onLoad={handleVideoLoad}
            onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
            isLooping={false}
            shouldPlay
          />
        )}
      </View>

      <TouchableOpacity className="absolute left-0 top-0 bottom-0 w-1/2" onPress={handlePrevious} />
      <TouchableOpacity className="absolute right-0 top-0 bottom-0 w-1/2" onPress={handleNext} />
    </View>
  )
}

export default StatusViewer

