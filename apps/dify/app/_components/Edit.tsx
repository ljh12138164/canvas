import MonacoEditor from '@monaco-editor/react';
import type React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  className,
}) => {
  return (
    <div className={className}>
      <MonacoEditor
        value={value}
        onChange={(value) => onChange(value || '')}
        language={language}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
