declare module '@vercel/blob/client' {
  export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
  }
  export interface UploadOptions {
    access: 'public' | 'private';
    handleUploadUrl: string;
    clientPayload?: string;
    multipart?: boolean;
    onUploadProgress?: (p: UploadProgress) => void;
  }
  export interface PutBlobResult {
    pathname: string;
    contentType: string;
    contentDisposition: string;
    url: string;
    downloadUrl: string;
  }
  export function upload(
    pathname: string,
    body: Blob | File | ArrayBuffer | string,
    options: UploadOptions
  ): Promise<PutBlobResult>;
}
