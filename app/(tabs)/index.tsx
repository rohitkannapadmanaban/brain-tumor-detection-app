import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';
import { formatDate } from '@/lib/analysis-utils';

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useAnalysis();

  const handleUploadImage = async () => {
    try {
      // Request camera roll permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to upload MRI images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        router.push({
          pathname: '/image-preview',
          params: {
            imageUri: asset.uri,
            imageName: asset.fileName || 'mri_scan.jpg',
            imageWidth: asset.width,
            imageHeight: asset.height,
          },
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your camera to capture MRI images.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        router.push({
          pathname: '/image-preview',
          params: {
            imageUri: asset.uri,
            imageName: asset.fileName || `mri_${Date.now()}.jpg`,
            imageWidth: asset.width,
            imageHeight: asset.height,
          },
        });
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const recentAnalysis = state.analysisHistory[0];

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Brain Tumor Detector
            </Text>
            <Text className="text-base text-muted">
              Upload MRI scans for instant analysis
            </Text>
          </View>

          {/* Main Upload Section */}
          <View className="gap-4">
            <TouchableOpacity
              onPress={handleUploadImage}
              className="bg-primary rounded-2xl p-8 items-center justify-center gap-3 active:opacity-80"
            >
              <Text className="text-5xl">📁</Text>
              <Text className="text-lg font-semibold text-white text-center">
                Upload from Gallery
              </Text>
              <Text className="text-sm text-white/80 text-center">
                Select MRI image from your device
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCameraCapture}
              className="bg-surface border-2 border-primary rounded-2xl p-8 items-center justify-center gap-3 active:opacity-80"
            >
              <Text className="text-5xl">📷</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                Capture with Camera
              </Text>
              <Text className="text-sm text-muted text-center">
                Take a photo of MRI scan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Supported Formats */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Supported Formats
            </Text>
            <Text className="text-sm text-muted">
              JPEG, PNG, GIF, WebP • Recommended: 256×256 px or larger
            </Text>
          </View>

          {/* Recent Analysis */}
          {recentAnalysis && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                Recent Analysis
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/results',
                    params: { resultId: recentAnalysis.id },
                  })
                }
                className="bg-surface rounded-xl p-4 border border-border active:opacity-80"
              >
                <View className="flex-row justify-between items-start gap-3">
                  <View className="flex-1 gap-2">
                    <Text className="font-semibold text-foreground">
                      {recentAnalysis.result === 'tumor'
                        ? '⚠️ Tumor Detected'
                        : '✓ No Tumor Detected'}
                    </Text>
                    <Text className="text-sm text-muted">
                      {formatDate(recentAnalysis.timestamp)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      Confidence: {Math.round(recentAnalysis.confidence * 100)}%
                    </Text>
                  </View>
                  <Text className="text-2xl">→</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Tips Section */}
          <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
            <Text className="text-sm font-semibold text-warning mb-2">
              💡 Tips for Best Results
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Use clear, high-quality MRI images{'\n'}
              • Ensure proper lighting when capturing{'\n'}
              • Avoid blurry or distorted images{'\n'}
              • Multiple angles improve accuracy
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
