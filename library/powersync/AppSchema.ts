import { AttachmentTable } from "@powersync/attachments";
import { Column, ColumnType, Index, IndexedColumn, Schema, Table } from "@powersync/react-native";

export const TODO_TABLE = "todos";
export const LIST_TABLE = "lists";
export const PROFILE_TABLE = "profiles";
export const CHALLENGES_TABLE = "challenges";
export const CHALLENGE_DAYS_TABLE = "challenge_days";
export const SOBER_TABLE = "sober_table";
export const DIET_TABLE = "diet_table";

export interface ListRecord {
  id: string;
  name: string;
  created_at: string;
  owner_id?: string;
}

export interface ProfileRecord {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}

export interface ChallengeRecord {
  id: string;
  profile_id: string;
  type: "standard" | "custom";
  duration_days: number;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "abandoned";
}

export interface ChallengeDayRecord {
  id: string;
  challenge_id: string;
  day_number: number;
  date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoRecord {
  id: string;
  created_at: string;
  completed: boolean;
  description: string;
  completed_at?: string;

  created_by: string;
  completed_by?: string;
  list_id: string;

  photo_id?: string; // This is the attachment id, 1:1 relationship with `id` in AttachmentTable
}

export interface SoberEntryRecord {
  id: string;
  challenge_days_id: string;
  challenge_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DietEntryRecord {
  id: string;
  challenge_days_id: string;
  challenge_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const AppSchema = new Schema([
  new Table({
    name: "profiles",
    columns: [
      new Column({ name: "updated_at", type: ColumnType.TEXT }),
      new Column({ name: "username", type: ColumnType.TEXT }),
      new Column({ name: "full_name", type: ColumnType.TEXT }),
      new Column({ name: "avatar_url", type: ColumnType.TEXT }),
      new Column({ name: "website", type: ColumnType.TEXT }),
    ],
  }),
  new Table({
    name: "challenges",
    columns: [
      new Column({ name: "profile_id", type: ColumnType.TEXT }),
      new Column({ name: "type", type: ColumnType.TEXT }),
      new Column({ name: "duration_days", type: ColumnType.INTEGER }),
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "updated_at", type: ColumnType.TEXT }),
      new Column({ name: "start_date", type: ColumnType.TEXT }),
      new Column({ name: "end_date", type: ColumnType.TEXT }),
      new Column({ name: "status", type: ColumnType.TEXT }),
    ],
  }),
  new Table({
    name: "challenge_days",
    columns: [
      new Column({ name: "challenge_id", type: ColumnType.TEXT }),
      new Column({ name: "day_number", type: ColumnType.INTEGER }),
      new Column({ name: "date", type: ColumnType.TEXT }),
      new Column({ name: "completed", type: ColumnType.INTEGER }),
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "updated_at", type: ColumnType.TEXT }),
    ],
    indexes: [
      new Index({
        name: "challenge",
        columns: [new IndexedColumn({ name: "challenge_id" })],
      }),
    ],
  }),
  new Table({
    name: "todos",
    columns: [
      new Column({ name: "list_id", type: ColumnType.TEXT }),
      new Column({ name: "photo_id", type: ColumnType.TEXT }),
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "completed_at", type: ColumnType.TEXT }),
      new Column({ name: "description", type: ColumnType.TEXT }),
      new Column({ name: "completed", type: ColumnType.INTEGER }),
      new Column({ name: "created_by", type: ColumnType.TEXT }),
      new Column({ name: "completed_by", type: ColumnType.TEXT }),
    ],
    indexes: [
      new Index({
        name: "list",
        columns: [new IndexedColumn({ name: "list_id" })],
      }),
    ],
  }),
  new Table({
    name: "lists",
    columns: [
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "name", type: ColumnType.TEXT }),
      new Column({ name: "owner_id", type: ColumnType.TEXT }),
    ],
  }),
  new Table({
    name: SOBER_TABLE,
    columns: [
      new Column({ name: "id", type: ColumnType.TEXT }),
      new Column({ name: "challenge_days_id", type: ColumnType.TEXT }),
      new Column({ name: "challenge_id", type: ColumnType.TEXT }),
      new Column({ name: "completed", type: ColumnType.INTEGER }), // boolean is stored as INTEGER in SQLite
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "updated_at", type: ColumnType.TEXT }),
    ],
  }),
  new Table({
    name: DIET_TABLE,
    columns: [
      new Column({ name: "id", type: ColumnType.TEXT }),
      new Column({ name: "challenge_days_id", type: ColumnType.TEXT }),
      new Column({ name: "challenge_id", type: ColumnType.TEXT }),
      new Column({ name: "completed", type: ColumnType.INTEGER }), // boolean is stored as INTEGER in SQLite
      new Column({ name: "created_at", type: ColumnType.TEXT }),
      new Column({ name: "updated_at", type: ColumnType.TEXT }),
    ],
  }),
  // Add Attachment table
  new AttachmentTable(),
]);
