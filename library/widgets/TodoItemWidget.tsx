import { Ionicons } from "@expo/vector-icons";
import { AttachmentRecord } from "@powersync/attachments";
import { CameraCapturedPicture } from "expo-camera";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  Modal,
  Text,
  Pressable,
  Image,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CameraWidget } from "./CameraWidget";
import { TodoRecord } from "../powersync/AppSchema";
import { useSystem } from "../powersync/system";
import { AppConfig } from "../supabase/AppConfig";

export interface TodoItemWidgetProps {
  record: TodoRecord;
  photoAttachment: AttachmentRecord | null;
  onSavePhoto: (data: CameraCapturedPicture) => Promise<void>;
  onToggleCompletion: (completed: boolean) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const TodoItemWidget: React.FC<TodoItemWidgetProps> = (props) => {
  const { record, photoAttachment, onDelete, onToggleCompletion, onSavePhoto } =
    props;
  const [loading, setLoading] = React.useState(false);
  const [isCameraVisible, setCameraVisible] = React.useState(false);
  const system = useSystem();

  const handleCancel = React.useCallback(() => {
    setCameraVisible(false);
  }, []);

  const renderRightActions = () => (
    <Pressable
      className="flex-1 justify-center bg-red-500/90 px-4"
      onPress={() => {
        Alert.alert(
          "Confirm",
          "This item will be permanently deleted",
          [{ text: "Cancel" }, { text: "Delete", onPress: () => onDelete?.() }],
          { cancelable: true },
        );
      }}
    >
      <View className="items-center">
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text className="text-white">Delete</Text>
      </View>
    </Pressable>
  );

  return (
    <View key={`todo-item-${record.id}`} className="p-2">
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCameraVisible}
        onRequestClose={handleCancel}
      >
        <SafeAreaProvider>
          <CameraWidget onCaptured={onSavePhoto} onClose={handleCancel} />
        </SafeAreaProvider>
      </Modal>

      <Swipeable renderRightActions={renderRightActions}>
        <View className="flex-row items-center border-b border-gray-200">
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Pressable
              className="flex-1 p-2"
              onPress={async () => {
                setLoading(true);
                await onToggleCompletion(!record.completed);
                setLoading(false);
              }}
            >
              <Ionicons
                name="checkbox-outline"
                size={24}
                color={record.completed ? "green" : "gray"}
              />
            </Pressable>
          )}
          <View className="flex-1 p-2">
            <Text className="text-lg font-semibold">{record.description}</Text>
          </View>
          {AppConfig.supabaseBucket &&
            (record.photo_id == null ? (
              <Pressable className="p-2" onPress={() => setCameraVisible(true)}>
                <Ionicons name="camera" size={24} color="black" />
              </Pressable>
            ) : photoAttachment?.local_uri != null ? (
              <Image
                source={{
                  uri: system.attachmentQueue?.getLocalUri(
                    photoAttachment.local_uri,
                  ),
                }}
                className="h-20 w-20 rounded"
                PlaceholderContent={<ActivityIndicator />}
              />
            ) : (
              <ActivityIndicator />
            ))}
        </View>
      </Swipeable>
    </View>
  );
};
