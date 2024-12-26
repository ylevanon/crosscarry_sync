import { Ionicons } from "@expo/vector-icons";
import { ATTACHMENT_TABLE, AttachmentRecord } from "@powersync/attachments";
import { useQuery } from "@powersync/react-native";
import { CameraCapturedPicture } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable, Image, ActionSheetIOS } from "react-native";

import { useSystem } from "../../library/powersync/system";
import { CameraWidget } from "../../library/widgets/CameraWidget";

import { PROFILE_TABLE, ProfileRecord } from "~/library/powersync/AppSchema";

const SettingsView = () => {
  const { powersync, supabaseConnector, attachmentQueue } = useSystem();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const { data: profiles } = useQuery<ProfileRecord>(`SELECT * FROM ${PROFILE_TABLE}`);
  const profile = profiles?.[0];

  // Query to get the profile photo attachment
  const { data: photoAttachments } = useQuery<AttachmentRecord>(
    `SELECT * FROM ${ATTACHMENT_TABLE} WHERE id = ?`,
    [profile?.photo_id]
  );
  const photoAttachment = photoAttachments?.[0];

  React.useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { user },
      } = await supabaseConnector.client.auth.getUser();
      setUserEmail(user?.email ?? null);
    };

    fetchUserEmail();
  }, []);

  const handleSignOut = async () => {
    await powersync.disconnectAndClear();
    await supabaseConnector.client.auth.signOut();
    router.replace("/signin");
  };

  const saveProfilePhoto = async (photo: CameraCapturedPicture) => {
    if (!attachmentQueue || !profile?.id) return;

    try {
      // Save photo to attachment queue
      const { id: photoId } = await attachmentQueue.savePhoto(photo.base64!);

      // Update profile with new photo ID
      await powersync.execute(
        `UPDATE ${PROFILE_TABLE} SET photo_id = ?, updated_at = datetime('now') WHERE id = ?`,
        [photoId, profile.id]
      );

      setShowCamera(false);
    } catch (error) {
      console.error("Error saving profile photo:", error);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions if not granted
      if (permissionResponse.status !== "granted") {
        const permission = await requestPermission();
        if (permission.status !== "granted") {
          alert("Sorry, we need media library permissions to make this work!");
          return;
        }
      }

      // Get all assets, sorted by creation time
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 1,
        sortBy: ["creationTime"],
        mediaType: "photo",
      });

      if (assets && assets.length > 0) {
        // Get the full asset info to get the base64
        const assetInfo = await MediaLibrary.getAssetInfoAsync(assets[0]);

        if (assetInfo.localUri) {
          // Create a new asset from the local URI
          const asset = await MediaLibrary.createAssetAsync(assetInfo.localUri);

          // Save the image using the attachment queue
          const { id: photoId } = await attachmentQueue!.savePhoto(asset.uri);

          // Update profile with new photo ID
          await powersync.execute(
            `UPDATE ${PROFILE_TABLE} SET photo_id = ?, updated_at = datetime('now') WHERE id = ?`,
            [photoId, profile!.id]
          );
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handlePhotoPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take Photo", "Choose from Library"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          setShowCamera(true);
        } else if (buttonIndex === 2) {
          pickImage();
        }
      }
    );
  };

  if (showCamera) {
    return <CameraWidget onSave={saveProfilePhoto} onCancel={() => setShowCamera(false)} />;
  }

  return (
    <View className="flex-1 bg-neutral-900">
      {/* Profile Section */}
      <View className="m-4 rounded-lg bg-neutral-800 p-4">
        <View className="mb-4 items-center">
          <View className="relative">
            <View
              className={
                photoAttachment?.local_uri
                  ? "h-20 w-20"
                  : "h-20 w-20 items-center justify-center rounded-full bg-neutral-700"
              }
            >
              {photoAttachment?.local_uri ? (
                <Image
                  source={{ uri: photoAttachment.local_uri }}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={40} color="#DC1E1E" />
              )}
            </View>
            <Pressable
              onPress={handlePhotoPress}
              className="absolute bottom-0 right-0 rounded-full bg-neutral-700 p-1.5"
            >
              <Ionicons name="pencil" size={16} color="#DC1E1E" />
            </Pressable>
          </View>
          <Text className="mt-2 font-lemon-milk text-lg text-white">
            {profile?.username ?? userEmail ?? "Loading..."}
          </Text>
          {profile?.username && userEmail && (
            <Text className="mt-1 text-sm text-gray-400">{userEmail}</Text>
          )}
        </View>
      </View>

      {/* Settings Options */}
      <View className="m-4 rounded-lg bg-neutral-800">
        <Pressable
          className="flex-row items-center justify-between border-b border-neutral-700 p-4"
          onPress={handleSignOut}
        >
          <View className="flex-row items-center space-x-3">
            <Ionicons name="log-out-outline" size={24} color="#DC1E1E" />
            <Text className="text-white">Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
};

export default SettingsView;
