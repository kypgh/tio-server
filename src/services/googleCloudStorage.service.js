import { Storage } from "@google-cloud/storage";
import {
  GOOGLE_CLOUD_STORAGE_PRIVATE_KEY,
  GOOGLE_CLOUD_STORAGE_ARCHIVE_BUCKET,
  GOOGLE_CLOUD_STORAGE_STANDARD_BUCKET,
} from "../config/envs";
import mime from "mime-types";

const _credentials = {
  type: "service_account",
  project_id: "tio-crm-kyc",
  private_key_id: "b1c05dfdeea3ee209a97053c5caa02a943b48d5c",
  private_key: GOOGLE_CLOUD_STORAGE_PRIVATE_KEY,
  client_email: "staging@tio-crm-kyc.iam.gserviceaccount.com",
  client_id: "110468478323015969590",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/staging%40tio-crm-kyc.iam.gserviceaccount.com",
};
const storage = new Storage({
  credentials: _credentials,
});

const googleCloudStorageService = {
  saveToStandardBucket: async (file, fileName, mimeType) => {
    let savedFile = await storage
      .bucket(GOOGLE_CLOUD_STORAGE_STANDARD_BUCKET)
      .upload(file, { destination: fileName, contentType: mimeType });
    if (savedFile.length > 0) {
      let fileRes = savedFile[0] ?? {};
      return {
        name: fileRes.name,
        bucket: fileRes.bucket?.id,
        id: fileRes.id,
        size: fileRes.metadata?.size,
        selfLink: fileRes.metadata?.selfLink,
        mediaLink: fileRes.metadata?.mediaLink,
        mimeType,
        extension: mime.extension(mimeType),
      };
    }
  },
  saveToArchiveBucket: async (file, fileName, mimeType) => {
    let savedFile = await storage
      .bucket(GOOGLE_CLOUD_STORAGE_ARCHIVE_BUCKET)
      .upload(file, { destination: fileName, contentType: mimeType });
    if (savedFile.length > 0) {
      let fileRes = savedFile[0] ?? {};
      return {
        name: fileRes.name,
        bucket: fileRes.bucket?.id,
        id: fileRes.id,
        size: fileRes.metadata?.size,
        selfLink: fileRes.metadata?.selfLink,
        mediaLink: fileRes.metadata?.mediaLink,
        mimeType,
        extension: mime.extension(mimeType),
      };
    }
  },
  getPresignedUrl: async (bucket, fileName) => {
    let url = await storage
      .bucket(bucket)
      .file(fileName)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: new Date(Date.now() + 1000 * 60 * 10),
      });
    return url[0];
  },
  archiveFile: async (fileName) => {
    let savedFile = await storage
      .bucket(GOOGLE_CLOUD_STORAGE_STANDARD_BUCKET)
      .file(fileName)
      .move(storage.bucket(GOOGLE_CLOUD_STORAGE_ARCHIVE_BUCKET).file(fileName));
    if (savedFile.length > 1) {
      let file = savedFile[1].resource ?? {};
      return {
        name: file.name,
        bucket: file.bucket,
        id: file.id,
        size: file.size,
        selfLink: file.selfLink,
        mediaLink: file.mediaLink,
        mimeType: file.contentType,
        extension: mime.extension(file.contentType),
      };
    }
  },
  removeFile: async (bucket, fileName) => {
    return storage.bucket(bucket).file(fileName).delete();
  },
};

export default googleCloudStorageService;
