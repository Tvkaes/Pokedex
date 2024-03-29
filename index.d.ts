declare module 'react-extract-colors' {
    export function useExtractColor(imageUrl: string, optionsCustom?: Record<string, any>): {
      dominantColor: string | null;
      darkerColor: string | null;
      lighterColor: string | null;
      loading: boolean;
      error: Error | null;
      colors: string[];
    };
  }