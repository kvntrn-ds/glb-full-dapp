import { useState } from 'react';
import { uploadCompleteNFT } from '../lib/pinata';

export function useIpfsUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, name: string, description: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadCompleteNFT(file, name, description);
      setIsUploading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
      throw err;
    }
  };

  return { upload, isUploading, error };
}
