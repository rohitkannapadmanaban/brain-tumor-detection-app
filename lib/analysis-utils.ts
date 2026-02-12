import { AnalysisResult, ModelInferenceResult } from './types';

/**
 * Generate a unique ID for analysis results
 */
export function generateAnalysisId(): string {
  return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create an AnalysisResult from model inference output
 */
export function createAnalysisResult(
  imageUri: string,
  imageName: string,
  inference: ModelInferenceResult
): AnalysisResult {
  return {
    id: generateAnalysisId(),
    imageUri,
    imageName,
    timestamp: Date.now(),
    result: inference.prediction,
    confidence: inference.confidence,
    modelVersion: '1.0.0',
  };
}

/**
 * Format confidence score as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Get result label and color
 */
export function getResultDisplay(result: 'tumor' | 'no-tumor') {
  if (result === 'tumor') {
    return {
      label: 'Tumor Detected',
      color: '#EF4444',
      backgroundColor: '#FEE2E2',
      icon: '⚠️',
    };
  }
  return {
    label: 'No Tumor Detected',
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
    icon: '✓',
  };
}

/**
 * Format timestamp to readable date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Simulate model inference (placeholder for actual model)
 * In production, this would call the actual ML model
 */
export function simulateModelInference(
  imageUri: string
): ModelInferenceResult {
  // Simulate random tumor/no-tumor prediction
  const isTumor = Math.random() > 0.5;
  const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence

  return {
    tumorProbability: isTumor ? confidence : 1 - confidence,
    noTumorProbability: isTumor ? 1 - confidence : confidence,
    prediction: isTumor ? 'tumor' : 'no-tumor',
    confidence: confidence,
    processingTime: Math.random() * 2000 + 1000, // 1-3 seconds
  };
}

/**
 * Validate image format
 */
export function isValidImageFormat(uri: string): boolean {
  const validFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUri = uri.toLowerCase();
  return validFormats.some((format) => lowerUri.endsWith(format));
}

/**
 * Get file size in MB from URI (approximate)
 */
export function estimateFileSizeMB(fileSize?: number): string {
  if (!fileSize) return 'Unknown';
  const mb = fileSize / (1024 * 1024);
  return mb.toFixed(2);
}
