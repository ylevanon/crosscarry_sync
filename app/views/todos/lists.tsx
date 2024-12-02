import { Ionicons } from "@expo/vector-icons";
import { useQuery, useStatus } from "@powersync/react-native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import prompt from "react-native-prompt-android";

import { LIST_TABLE, TODO_TABLE, ListRecord } from "../../../library/powersync/AppSchema";
import { useSystem } from "../../../library/powersync/system";
import { ListItemWidget } from "../../../library/widgets/ListItemWidget";

const description = (total: number, completed: number = 0) => {
  return `${total - completed} pending, ${completed} completed`;
};

const ListsViewWidget: React.FC = () => {
  const system = useSystem();
  const status = useStatus();
  const { data: listRecords } = useQuery<
    ListRecord & { total_tasks: number; completed_tasks: number }
  >(`
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
      throw new Error("Could not create list");
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
    <View className="flex-1 bg-gray-50">
      {/* FAB replacement */}
      <Pressable
        className="absolute bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg active:bg-purple-700"
        onPress={() => {
          prompt(
            "Add a new list",
            "",
            async (name) => {
              if (!name) {
                return;
              }
              await createNewList(name);
            },
            { placeholder: "List name", style: "shimo" }
          );
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      <ScrollView className="flex-1 px-4 py-2">
        {!status.hasSynced ? (
          <View className="mt-4 rounded-lg bg-blue-50 p-4">
            <Text className="text-center text-base text-blue-600">Synchronizing your lists...</Text>
          </View>
        ) : listRecords.length === 0 ? (
          <View className="mt-4 rounded-lg bg-gray-50 p-4">
            <Text className="text-center text-base text-gray-500">
              No lists yet. Tap the + button to create one!
            </Text>
          </View>
        ) : (
          <View className="space-y-2">
            {listRecords.map((r) => (
              <View key={r.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                <Pressable
                  className="flex-row items-center justify-between p-4 active:bg-gray-50"
                  onPress={() => {
                    router.push({
                      pathname: "/views/todos/edit/[id]",
                      params: { id: r.id },
                    });
                  }}
                >
                  <View className="flex-1">
                    <Text className="text-lg font-medium text-gray-900">{r.name}</Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      {description(r.total_tasks, r.completed_tasks)}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-4">
                    <Pressable
                      className="rounded-full p-2 active:bg-gray-100"
                      onPress={() => deleteList(r.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </Pressable>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
};

export default ListsViewWidget;
