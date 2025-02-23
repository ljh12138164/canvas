'use client';
import { CodePreview } from '@/app/_components/CodeProview';
import { Editor } from '@/app/_components/Edit';
import { useCodePreview } from '@/app/_hooks/useCodeProview';
import type React from 'react';

export const CodeEditor: React.FC = () => {
  const { code, setCode, previewUrl, isLoading, error, generatePreview } = useCodePreview({
    initialCode: '// Write your code here',
  });

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 border-r">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">代码编辑器</h2>
          <button type="button" onClick={() => generatePreview(code)} disabled={isLoading}>
            生成预览
          </button>
        </div>
        <Editor
          value={code}
          onChange={setCode}
          language="javascript"
          className="h-[calc(100%-60px)]"
        />
      </div>

      <div className="w-1/2 p-4">
        <h2 className="text-lg font-semibold mb-4">预览</h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <CodePreview code={code} previewUrl={previewUrl} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};
