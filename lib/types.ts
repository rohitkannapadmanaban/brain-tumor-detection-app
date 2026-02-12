/**
 * Analysis Result Type
 * Represents the result of a brain tumor detection analysis
 */
export interface AnalysisResult {
  id: string;
  imageUri: string;
  imageName: string;
  timestamp: number;
  result: 'tumor' | 'no-tumor';
  confidence: number;
  modelVersion: string;
  heatmapUri?: string;
  metadata?: {
    imageWidth?: number;
    imageHeight?: number;
    fileSize?: number;
  };
}

/**
 * App State Type
 * Represents the overall app state
 */
export interface AppState {
  analysisHistory: AnalysisResult[];
  isDarkMode: boolean;
  hasSeenOnboarding: boolean;
}

/**
 * Model Inference Result
 * Raw output from the ML model
 */
export interface ModelInferenceResult {
  tumorProbability: number;
  noTumorProbability: number;
  prediction: 'tumor' | 'no-tumor';
  confidence: number;
  processingTime: number;
}

/**
 * Image Upload State
 * Tracks the state of image upload and processing
 */
export interface ImageUploadState {
  isLoading: boolean;
  error?: string;
  progress?: number;
  selectedImageUri?: string;
}
