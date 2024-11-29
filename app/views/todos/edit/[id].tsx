import { Ionicons } from '@expo/vector-icons';
import { ATTACHMENT_TABLE, AttachmentRecord } from '@powersync/attachments';
import { usePowerSync, useQuery } from '@powersync/react-native';
import { CameraCapturedPicture } from 'expo-camera';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import _ from 'lodash';
import * as React from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import prompt from 'react-native-prompt-android';

import { TODO_TABLE, TodoRecord, LIST_TABLE } from '../../../../library/powersync/AppSchema';
import { useSystem } from '../../../../library/powersync/system';
import { TodoItemWidget } from '../../../../library/widgets/TodoItemWidget';

type TodoEntry = TodoRecord & Partial<Omit<AttachmentRecord, 'id'>> & { todo_id: string; attachment_id: string | null };

const toAttachmentRecord = _.memoize((entry: TodoEntry): AttachmentRecord | null => {
  return entry.attachment_id == null
    ? null
    : {
        id: entry.attachment_id,
        filename: entry.filename!,
        state: entry.state!,
        timestamp: entry.timestamp,
        local_uri: entry.local_uri,
        media_type: entry.media_type,
        size: entry.size
      };
});

const TodoView: React.FC = () => {
  const system = useSystem();
  const powerSync = usePowerSync();
  const params = useLocalSearchParams<{ id: string }>();
  const listID = params.id;

  const {
    data: [listRecord]
  } = useQuery<{ name: string }>(`SELECT name FROM ${LIST_TABLE} WHERE id = ?`, [listID]);

  const { data: todos, isLoading } = useQuery<TodoEntry>(
    `
        SELECT
            ${TODO_TABLE}.id AS todo_id,
            ${TODO_TABLE}.*,
            ${ATTACHMENT_TABLE}.id AS attachment_id,
            ${ATTACHMENT_TABLE}.*
        FROM
            ${TODO_TABLE}
        LEFT JOIN
            ${LIST_TABLE} ON ${TODO_TABLE}.list_id = ${LIST_TABLE}.id
        LEFT JOIN
            ${ATTACHMENT_TABLE} ON ${TODO_TABLE}.photo_id = ${ATTACHMENT_TABLE}.id
        WHERE
            ${TODO_TABLE}.list_id = ?`,
    [listID]
  );

  const toggleCompletion = async (record: TodoRecord, completed: boolean) => {
    const updatedRecord = { ...record, completed };
    if (completed) {
      const { userID } = await system.supabaseConnector.fetchCredentials();
      updatedRecord.completed_at = new Date().toISOString();
      updatedRecord.completed_by = userID;
    } else {
      updatedRecord.completed_at = undefined;
      updatedRecord.completed_by = undefined;
    }
    await system.powersync.execute(
      `UPDATE ${TODO_TABLE}
            SET completed = ?,
                completed_at = ?,
                completed_by = ?
            WHERE id = ?`,
      [completed, updatedRecord.completed_at, updatedRecord.completed_by, record.id]
    );
  };

  const savePhoto = async (id: string, data: CameraCapturedPicture) => {
    if (system.attachmentQueue) {
      // We are sure the base64 is not null, as we are using the base64 option in the CameraWidget
      const { id: photoId } = await system.attachmentQueue.savePhoto(data.base64!);

      await system.powersync.execute(`UPDATE ${TODO_TABLE} SET photo_id = ? WHERE id = ?`, [photoId, id]);
    }
  };

  const createNewTodo = async (description: string) => {
    const { userID } = await system.supabaseConnector.fetchCredentials();

    await powerSync.execute(
      `INSERT INTO
              ${TODO_TABLE}
                  (id, created_at, created_by, description, list_id)
              VALUES
                  (uuid(), datetime(), ?, ?, ?)`,
      [userID, description, listID!]
    );
  };

  const deleteTodo = async (id: string, photoRecord?: AttachmentRecord) => {
    await system.powersync.writeTransaction(async (tx) => {
      if (system.attachmentQueue && photoRecord != null) {
        await system.attachmentQueue.delete(photoRecord, tx);
      }
      await tx.execute(`DELETE FROM ${TODO_TABLE} WHERE id = ?`, [id]);
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (listRecord == null) {
    return (
      <View className="flex-1 p-4">
        <Stack.Screen
          options={{
            title: 'List not found'
          }}
        />
        <Text className="text-lg">No matching List found, please navigate back...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: listRecord.name
        }}
      />
      
      {/* FAB replacement */}
      <Pressable 
        className="absolute bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg"
        onPress={() => {
          prompt(
            'Add a new Todo',
            '',
            (text) => {
              if (!text) {
                return;
              }
              return createNewTodo(text);
            },
            { placeholder: 'Todo description', style: 'shimo' }
          );
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      <ScrollView className="h-[90%]">
        {todos.map((r) => {
          const record = { ...r, id: r.todo_id };
          const photoRecord = toAttachmentRecord(r);
          return (
            <TodoItemWidget
              key={r.todo_id}
              record={record}
              photoAttachment={photoRecord}
              onToggleCompletion={(completed) => toggleCompletion(record, completed)}
              onSavePhoto={(data) => savePhoto(r.todo_id, data)}
              onDelete={() => deleteTodo(r.todo_id, photoRecord ?? undefined)}
            />
          );
        })}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

export default TodoView;
