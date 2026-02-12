import { View, Text, TouchableOpacity, Image, ScrollView, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';
import { formatDate, getResultDisplay, formatConfidence } from '@/lib/analysis-utils';
import { useMemo } from 'react';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state } = useAnalysis();

  const resultId = params.resultId as string;
  const result = useMemo(
    () => state.analysisHistory.find((r) => r.id === resultId),
    [resultId, state.analysisHistory]
  );

  if (!result) {
    return (
      <ScreenContainer className="p-6" edges={['top', 'left', 'right', 'bottom']}>
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-lg font-semibold text-foreground">
            Result not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary rounded-full px-6 py-3"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const resultDisplay = getResultDisplay(result.result);
  const confidencePercent = formatConfidence(result.confidence);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Brain Tumor Detection Result\n\nResult: ${resultDisplay.label}\nConfidence: ${confidencePercent}\nDate: ${formatDate(result.timestamp)}\n\nNote: This is for informational purposes only. Consult with medical professionals for diagnosis.`,
        title: 'MRI Analysis Result',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAnalyzeAnother = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer className="p-6" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Analysis Results
            </Text>
            <Text className="text-sm text-muted">
              {formatDate(result.timestamp)}
            </Text>
          </View>

          {/* Main Result Card */}
          <View
            className="rounded-2xl p-6 items-center justify-center gap-4"
            style={{ backgroundColor: resultDisplay.backgroundColor }}
          >
            <Text className="text-6xl">{resultDisplay.icon}</Text>
            <Text
              className="text-3xl font-bold text-center"
              style={{ color: resultDisplay.color }}
            >
              {resultDisplay.label}
            </Text>
            <Text className="text-sm text-muted text-center">
              {result.result === 'tumor'
                ? 'Potential tumor detected in the MRI scan'
                : 'No tumor detected in the MRI scan'}
            </Text>
          </View>

          {/* Confidence Score */}
          <View className="bg-surface rounded-xl p-6 border border-border gap-4">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wider">
              Confidence Score
            </Text>
            <View className="gap-3">
              <Text className="text-5xl font-bold text-foreground text-center">
                {confidencePercent}
              </Text>
              {/* Confidence Bar */}
              <View className="bg-border rounded-full h-2 overflow-hidden">
                <View
                  className="h-full bg-primary"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </View>
              <Text className="text-xs text-muted text-center">
                Model confidence level for this prediction
              </Text>
            </View>
          </View>

          {/* Image Preview */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Analyzed Image
            </Text>
            <View className="bg-surface rounded-2xl p-4 border border-border overflow-hidden">
              <Image
                source={{ uri: result.imageUri }}
                style={{
                  width: '100%',
                  height: 250,
                  borderRadius: 12,
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Analysis Details */}
          <View className="bg-surface rounded-xl p-4 border border-border gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">File Name</Text>
              <Text className="text-sm font-semibold text-foreground">
                {result.imageName}
              </Text>
            </View>
            <View className="h-px bg-border" />
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Model Version</Text>
              <Text className="text-sm font-semibold text-foreground">
                {result.modelVersion}
              </Text>
            </View>
            <View className="h-px bg-border" />
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Analysis ID</Text>
              <Text className="text-xs font-mono text-foreground">
                {result.id.slice(0, 12)}...
              </Text>
            </View>
          </View>

          {/* Medical Disclaimer */}
          <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
            <Text className="text-xs font-semibold text-warning mb-2">
              ⚠️ Important Disclaimer
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              This analysis is for informational purposes only and should not be used for medical diagnosis. Always consult with qualified healthcare professionals for proper diagnosis and treatment.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-auto">
            <TouchableOpacity
              onPress={handleAnalyzeAnother}
              className="bg-primary rounded-full py-4 items-center"
            >
              <Text className="text-white font-semibold text-base">
                Analyze Another Image
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="border-2 border-border rounded-full py-4 items-center"
            >
              <Text className="text-foreground font-semibold text-base">
                Share Result
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
