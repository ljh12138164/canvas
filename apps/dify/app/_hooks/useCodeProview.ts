import { useCallback, useState } from 'react';

interface UseCodePreviewProps {
  initialCode?: string;
}

export const useCodePreview = ({ initialCode = '' }: UseCodePreviewProps) => {
  const [code, setCode] = useState(initialCode);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const generatePreview = useCallback(async (newCode: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: newCode }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      setPreviewUrl(data.previewUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    code,
    setCode,
    previewUrl,
    isLoading,
    error,
    generatePreview,
  };
};
