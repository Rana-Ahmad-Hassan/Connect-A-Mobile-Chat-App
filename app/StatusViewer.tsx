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
const STATUS_DURATION = 5000
const UPDATE_INTERVAL = 100

const StatusViewer = () => {
  const { statuses: statusesParam, initialIndex: initialIndexParam } = useLocalSearchParams()
  const [statuses, setStatuses] = useState<Status[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const videoRef = useRef<Video>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const parsedStatuses = JSON.parse(statusesParam as string)
      const initialIndex = Number(initialIndexParam) || 0
      setStatuses(parsedStatuses)
      setCurrentIndex(Math.min(initialIndex, parsedStatuses.length - 1))
    } catch (e) {
      console.error("Error parsing statuses:", e)
      setError("Failed to load statuses")
    }
  }, [statusesParam, initialIndexParam])

  const currentStatus = statuses[currentIndex]

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)
    if (progressInterval.current) clearInterval(progressInterval.current)

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [currentIndex])

  const startImageProgress = () => {
    let elapsedTime = 0
    progressInterval.current = setInterval(() => {
      elapsedTime += UPDATE_INTERVAL
      setProgress((elapsedTime / STATUS_DURATION) * 100)
      if (elapsedTime >= STATUS_DURATION) {
        clearInterval(progressInterval.current!)
        handleStatusEnd()
      }
    }, UPDATE_INTERVAL)
  }

  const handleMediaReady = () => {
    setIsLoading(false)
    if (currentStatus?.mediaType === "image") {
      startImageProgress()
    }
  }

  const handleVideoPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.durationMillis) {
        setProgress((status.positionMillis / status.durationMillis) * 100)
      }
      if (status.didJustFinish) {
        handleStatusEnd()
      }
    }
  }

  const handleStatusEnd = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      router.back()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    } else {
      router.back()
    }
  }

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      router.back()
    }
  }

  const handleError = (message: string) => {
    console.error(message)
    setError(message)
    setIsLoading(false)
  }

  if (error) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">{error}</Text>
      </View>
    )
  }

  if (!statuses.length || !currentStatus) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      {/* Progress Bars */}
      <View className="flex-row justify-between p-2 absolute top-0 left-0 right-0 z-10">
        {statuses.map((_, index) => (
          <View key={index} className="flex-1 h-1 bg-gray-500 mx-1">
            <View
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${index < currentIndex ? 100 : index === currentIndex ? progress : 0}%` }}
            />
          </View>
        ))}
      </View>

      <View className="flex-row justify-between items-center absolute top-10 left-4 right-4 z-10">
        <TouchableOpacity onPress={handlePrevious}>
          <ChevronLeftIcon size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <ChevronRightIcon size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        {isLoading && <ActivityIndicator size="large" color="#ffffff" className="absolute top-20" />}
        
        {currentStatus.mediaType === "image" && (
          <Image
            source={{ uri: currentStatus.mediaUrl }}
            style={{ width, height }}
            resizeMode="contain"
            onLoad={handleMediaReady}
            onError={() => handleError("Failed to load image")}
          />
        )}

        {currentStatus.mediaType === "video" && (
          <Video
            ref={videoRef}
            source={{ uri: currentStatus.mediaUrl }}
            style={{ width, height }}
            resizeMode={ResizeMode.CONTAIN}
            onReadyForDisplay={handleMediaReady}
            onError={() => handleError("Failed to load video")}
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