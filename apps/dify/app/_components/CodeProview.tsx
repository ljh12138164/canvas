'use client';
import type React from 'react';
import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  previewUrl?: string;
  isLoading?: boolean;
}

export const CodePreview: React.FC<PreviewProps> = ({ code, previewUrl, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!previewUrl && iframeRef.current) {
      // 如果没有预览URL，则在本地iframe中运行代码
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument;

      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; }
                #root { height: 100vh; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="module">
                ${code}
              </script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [code, previewUrl]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="w-full h-full relative bg-gray-50 rounded-lg overflow-hidden">
      {previewUrl ? (
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      ) : (
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Preview"
        />
      )}
    </div>
  );
};
