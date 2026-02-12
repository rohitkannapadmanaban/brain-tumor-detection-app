import { describe, it, expect } from 'vitest';
import {
  generateAnalysisId,
  createAnalysisResult,
  formatConfidence,
  getResultDisplay,
  formatDate,
  isValidImageFormat,
  simulateModelInference,
} from '@/lib/analysis-utils';

describe('Analysis Utils', () => {
  describe('generateAnalysisId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateAnalysisId();
      const id2 = generateAnalysisId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^analysis_/);
      expect(id2).toMatch(/^analysis_/);
    });
  });

  describe('formatConfidence', () => {
    it('should format confidence as percentage', () => {
      expect(formatConfidence(0.95)).toBe('95%');
      expect(formatConfidence(0.5)).toBe('50%');
      expect(formatConfidence(0.75)).toBe('75%');
    });

    it('should round confidence correctly', () => {
      expect(formatConfidence(0.956)).toBe('96%');
      expect(formatConfidence(0.944)).toBe('94%');
    });
  });

  describe('getResultDisplay', () => {
    it('should return tumor display for tumor result', () => {
      const display = getResultDisplay('tumor');
      expect(display.label).toBe('Tumor Detected');
      expect(display.color).toBe('#EF4444');
      expect(display.icon).toBe('⚠️');
    });

    it('should return no-tumor display for no-tumor result', () => {
      const display = getResultDisplay('no-tumor');
      expect(display.label).toBe('No Tumor Detected');
      expect(display.color).toBe('#22C55E');
      expect(display.icon).toBe('✓');
    });
  });

  describe('formatDate', () => {
    it('should format today date correctly', () => {
      const now = Date.now();
      const formatted = formatDate(now);
      expect(formatted).toContain('Today');
    });

    it('should format past dates correctly', () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      const formatted = formatDate(yesterday);
      expect(formatted).toContain('Yesterday');
    });
  });

  describe('isValidImageFormat', () => {
    it('should validate supported image formats', () => {
      expect(isValidImageFormat('image.jpg')).toBe(true);
      expect(isValidImageFormat('image.jpeg')).toBe(true);
      expect(isValidImageFormat('image.png')).toBe(true);
      expect(isValidImageFormat('image.gif')).toBe(true);
      expect(isValidImageFormat('image.webp')).toBe(true);
    });

    it('should reject unsupported formats', () => {
      expect(isValidImageFormat('image.txt')).toBe(false);
      expect(isValidImageFormat('image.pdf')).toBe(false);
      expect(isValidImageFormat('image.bmp')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isValidImageFormat('IMAGE.JPG')).toBe(true);
      expect(isValidImageFormat('Image.PNG')).toBe(true);
    });
  });

  describe('simulateModelInference', () => {
    it('should return valid inference result', () => {
      const result = simulateModelInference('test.jpg');
      expect(result).toHaveProperty('tumorProbability');
      expect(result).toHaveProperty('noTumorProbability');
      expect(result).toHaveProperty('prediction');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('processingTime');
    });

    it('should have valid prediction values', () => {
      const result = simulateModelInference('test.jpg');
      expect(['tumor', 'no-tumor']).toContain(result.prediction);
    });

    it('should have confidence in valid range', () => {
      const result = simulateModelInference('test.jpg');
      expect(result.confidence).toBeGreaterThanOrEqual(0.75);
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it('should have valid probabilities', () => {
      const result = simulateModelInference('test.jpg');
      // Probabilities should be between 0 and 1
      expect(result.tumorProbability).toBeGreaterThanOrEqual(0);
      expect(result.tumorProbability).toBeLessThanOrEqual(1);
      expect(result.noTumorProbability).toBeGreaterThanOrEqual(0);
      expect(result.noTumorProbability).toBeLessThanOrEqual(1);
    });
  });

  describe('createAnalysisResult', () => {
    it('should create valid analysis result', () => {
      const inference = simulateModelInference('test.jpg');
      const result = createAnalysisResult('file://test.jpg', 'test.jpg', inference);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('imageUri', 'file://test.jpg');
      expect(result).toHaveProperty('imageName', 'test.jpg');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('modelVersion', '1.0.0');
    });

    it('should match inference prediction', () => {
      const inference = simulateModelInference('test.jpg');
      const result = createAnalysisResult('file://test.jpg', 'test.jpg', inference);
      expect(result.result).toBe(inference.prediction);
      expect(result.confidence).toBe(inference.confidence);
    });
  });
});
