import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from "@powersync/attachments";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";

import { PROFILE_TABLE, STREAK_PHOTO_TABLE } from "./AppSchema";
import { AppConfig } from "../supabase/AppConfig";

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {
  async init() {
    if (!AppConfig.supabaseBucket) {
      console.debug("No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches");
      // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
      this.options.syncInterval = 0;
      return;
    }

    await super.init();
  }

  onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
    this.powersync.watch(
      `
      SELECT photo_id as id FROM ${PROFILE_TABLE} WHERE photo_id IS NOT NULL
      UNION
      SELECT photo_id as id FROM ${STREAK_PHOTO_TABLE} WHERE photo_id IS NOT NULL
      `,
      [],
      {
        onResult: (result) => onUpdate(result.rows?._array.map((r) => r.id) ?? []),
      }
    );
  }

  async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
    const photoId = record?.id ?? randomUUID();
    const filename = record?.filename ?? `${photoId}.jpg`;
    return {
      id: photoId,
      filename,
      media_type: "image/jpeg",
      state: AttachmentState.QUEUED_UPLOAD,
      ...record,
    };
  }

  async savePhoto(base64Data: string): Promise<AttachmentRecord> {
    const photoAttachment = await this.newAttachmentRecord();
    photoAttachment.local_uri = this.getLocalFilePathSuffix(photoAttachment.filename);
    const localUri = this.getLocalUri(photoAttachment.local_uri);
    await this.storage.writeFile(localUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      photoAttachment.size = fileInfo.size;
    }

    return this.saveToQueue(photoAttachment);
  }
}
