import { Ionicons } from '@expo/vector-icons';
import { useQuery, useStatus } from '@powersync/react-native';
import { router, Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ScrollView, View, Text, Pressable} from 'react-native';
import prompt from 'react-native-prompt-android';

import { LIST_TABLE, TODO_TABLE, ListRecord } from '../../../library/powersync/AppSchema';
import { useSystem } from '../../../library/powersync/system';
import { ListItemWidget } from '../../../library/widgets/ListItemWidget';

const description = (total: number, completed: number = 0) => {
  return `${total - completed} pending, ${completed} completed`;
};

const ListsViewWidget: React.FC = () => {
  const system = useSystem();
  const status = useStatus();
  const { data: listRecords } = useQuery<ListRecord & { total_tasks: number; completed_tasks: number }>(`
      SELECT
        ${LIST_TABLE}.*, COUNT(${TODO_TABLE}.id) AS total_tasks, SUM(CASE WHEN ${TODO_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
      FROM
        ${LIST_TABLE}
      LEFT JOIN ${TODO_TABLE}
        ON  ${LIST_TABLE}.id = ${TODO_TABLE}.list_id
      GROUP BY
        ${LIST_TABLE}.id;
      `);

  const createNewList = async (name: string) => {
    const { userID } = await system.supabaseConnector.fetchCredentials();

    const res = await system.powersync.execute( 
      `INSERT INTO ${LIST_TABLE} (id, created_at, name, owner_id) VALUES (uuid(), datetime(), ?, ?) RETURNING *`,
      [name, userID]
    );

    const resultRecord = res.rows?.item(0);
    if (!resultRecord) {
      throw new Error('Could not create list');
    }
  };

  const deleteList = async (id: string) => {
    await system.powersync.writeTransaction(async (tx) => {
      // Delete associated todos
      await tx.execute(`DELETE FROM ${TODO_TABLE} WHERE list_id = ?`, [id]);
      // Delete list record
      await tx.execute(`DELETE FROM ${LIST_TABLE} WHERE id = ?`, [id]);
    });
  };


  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* FAB replacement */}
      <Pressable 
        className="absolute bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg"
        onPress={() => {
          prompt(
            'Add a new list',
            '',
            async (name) => {
              if (!name) {
                return;
              }
              await createNewList(name);
            },
            { placeholder: 'List name', style: 'shimo' }
          );
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      <ScrollView className="h-[90%]">
        {!status.hasSynced ? (
          <View className="p-4">
            <Text className="text-base text-gray-600">Busy with sync...</Text>
          </View>
        ) : (
          listRecords.map((r) => (
            <ListItemWidget
              key={r.id}
              title={r.name}
              description={description(r.total_tasks, r.completed_tasks)}
              onDelete={() => deleteList(r.id)}
              onPress={() => {
                router.push({
                  pathname: 'views/todos/edit/[id]',
                  params: { id: r.id }
                });
              }}
            />
          ))
        )}
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
};

export default ListsViewWidget;
