import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useAnalysis();

  const handleGetStarted = () => {
    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between gap-8 py-8">
          {/* Header Section */}
          <View className="items-center gap-4">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center">
              <Text className="text-4xl">🧠</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground text-center">
              Brain Tumor Detector
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Fast, accurate MRI analysis powered by AI
            </Text>
          </View>

          {/* Features Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              How it works
            </Text>

            <View className="bg-surface rounded-xl p-4 border border-border gap-3">
              <View className="flex-row gap-3">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                  <Text className="text-white font-bold">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Upload MRI Image</Text>
                  <Text className="text-sm text-muted">
                    Select from your device or take a photo
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-surface rounded-xl p-4 border border-border gap-3">
              <View className="flex-row gap-3">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                  <Text className="text-white font-bold">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">AI Analysis</Text>
                  <Text className="text-sm text-muted">
                    Deep learning model processes your image
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-surface rounded-xl p-4 border border-border gap-3">
              <View className="flex-row gap-3">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                  <Text className="text-white font-bold">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Get Results</Text>
                  <Text className="text-sm text-muted">
                    Instant tumor detection with confidence score
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Disclaimer Section */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning/30">
            <Text className="text-xs text-warning font-semibold mb-2">
              ⚠️ Medical Disclaimer
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              This app is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals.
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-primary rounded-full py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
