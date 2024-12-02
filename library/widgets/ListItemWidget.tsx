import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, View, Text, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export interface ListItemWidgetProps {
  title: string;
  description?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ListItemWidget: React.FC<ListItemWidgetProps> = ({
  title,
  description,
  onPress,
  onDelete,
}) => {
  const renderRightActions = () => (
    <Pressable 
      className="flex-1 justify-center bg-red-500/90 px-4"
      onPress={() => {
        Alert.alert(
          'Confirm',
          'This list will be permanently deleted',
          [
            { text: 'Cancel' },
            { text: 'Delete', onPress: () => onDelete?.() }
          ],
          { cancelable: true }
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
    <View className="p-2">
      <Swipeable renderRightActions={renderRightActions}>
        <Pressable
          onPress={onPress}
          className="flex-row items-center border-b border-gray-200 bg-white p-4"
        >
          <View className="mr-3">
            <Ionicons name="list" size={24} color="gray" />
          </View>

          <View className="flex-1 min-h-[80px]">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            {description && (
              <Text className="mt-1 text-sm text-gray-600">{description}</Text>
            )}
          </View>

          <View className="ml-2">
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </View>
        </Pressable>
      </Swipeable>
    </View>
  );
};
