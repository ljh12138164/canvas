export interface PreviewData {
  code: string;
  css?: string;
  createdAt: number;
}

export interface GeneratePreviewResponse {
  previewUrl: string;
}

export interface PreviewError {
  error: string;
}
