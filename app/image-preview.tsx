import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';
import { simulateModelInference, createAnalysisResult } from '@/lib/analysis-utils';

export default function ImagePreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addResult } = useAnalysis();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const imageUri = params.imageUri as string;
  const imageName = params.imageName as string;
  const imageWidth = parseInt(params.imageWidth as string) || 0;
  const imageHeight = parseInt(params.imageHeight as string) || 0;

  const handleCancel = () => {
    router.back();
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);

      // Simulate model inference (in production, this would call actual ML model)
      const inference = simulateModelInference(imageUri);

      // Create analysis result
      const result = createAnalysisResult(imageUri, imageName, inference);

      // Add to history
      addResult(result);

      // Navigate to results screen
      router.push({
        pathname: '/results',
        params: { resultId: result.id },
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScreenContainer className="p-6" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Review MRI Image
            </Text>
            <Text className="text-sm text-muted">
              Check the image before analysis
            </Text>
          </View>

          {/* Image Preview */}
          <View className="bg-surface rounded-2xl p-4 border border-border overflow-hidden">
            <Image
              source={{ uri: imageUri }}
              style={{
                width: '100%',
                height: 300,
                borderRadius: 12,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Image Details */}
          <View className="bg-surface rounded-xl p-4 border border-border gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">File Name</Text>
              <Text className="text-sm font-semibold text-foreground">{imageName}</Text>
            </View>
            <View className="h-px bg-border" />
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Dimensions</Text>
              <Text className="text-sm font-semibold text-foreground">
                {imageWidth} × {imageHeight}
              </Text>
            </View>
            <View className="h-px bg-border" />
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Format</Text>
              <Text className="text-sm font-semibold text-foreground">
                {imageName.split('.').pop()?.toUpperCase() || 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-xl p-4 border border-primary/30">
            <Text className="text-xs text-primary font-semibold mb-2">
              ℹ️ Analysis Information
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              The AI model will analyze this MRI image to detect potential brain tumors. Results are provided with confidence scores for reference only.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleAnalyze}
              disabled={isAnalyzing}
              className={`rounded-full py-4 items-center justify-center ${
                isAnalyzing ? 'bg-primary/50' : 'bg-primary'
              }`}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Analyze Image
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              disabled={isAnalyzing}
              className="border-2 border-border rounded-full py-4 items-center"
            >
              <Text className="text-foreground font-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
