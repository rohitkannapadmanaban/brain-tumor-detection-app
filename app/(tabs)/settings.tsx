import { ScrollView, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';
import * as WebBrowser from 'expo-web-browser';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { state, setDarkMode } = useAnalysis();

  const isDarkMode = state.isDarkMode || colorScheme === 'dark';

  const handleToggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const handleOpenURL = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open URL');
    }
  };

  const handleSendFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'Thank you for using Brain Tumor Detector! Your feedback helps us improve.',
      [
        {
          text: 'Email',
          onPress: () => {
            // In a real app, this would open email client
            Alert.alert('Email', 'feedback@braintumordetector.app');
          },
        },
        { text: 'Cancel', onPress: () => {} },
      ]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Settings
            </Text>
            <Text className="text-sm text-muted">
              Configure app preferences and information
            </Text>
          </View>

          {/* Appearance Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wider">
              Appearance
            </Text>
            <View className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center">
              <View className="flex-1 gap-1">
                <Text className="font-semibold text-foreground">Dark Mode</Text>
                <Text className="text-sm text-muted">
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#0a7ea4' }}
                thumbColor={isDarkMode ? '#0a7ea4' : '#f5f5f5'}
              />
            </View>
          </View>

          {/* Model Information Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wider">
              Model Information
            </Text>
            <View className="bg-surface rounded-xl p-4 border border-border gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Model Name</Text>
                <Text className="text-sm font-semibold text-foreground">
                  ResNet50-Tumor
                </Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Version</Text>
                <Text className="text-sm font-semibold text-foreground">
                  1.0.0
                </Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Accuracy</Text>
                <Text className="text-sm font-semibold text-foreground">
                  94.2%
                </Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Last Updated</Text>
                <Text className="text-sm font-semibold text-foreground">
                  Feb 2026
                </Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wider">
              About
            </Text>
            <TouchableOpacity
              onPress={() => handleOpenURL('https://braintumordetector.app/privacy')}
              className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center active:opacity-80"
            >
              <Text className="font-semibold text-foreground">Privacy Policy</Text>
              <Text className="text-lg">→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenURL('https://braintumordetector.app/terms')}
              className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center active:opacity-80"
            >
              <Text className="font-semibold text-foreground">Terms of Service</Text>
              <Text className="text-lg">→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSendFeedback}
              className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center active:opacity-80"
            >
              <Text className="font-semibold text-foreground">Send Feedback</Text>
              <Text className="text-lg">→</Text>
            </TouchableOpacity>
          </View>

          {/* Medical Disclaimer */}
          <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
            <Text className="text-xs font-semibold text-warning mb-2">
              ⚠️ Medical Disclaimer
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              This app is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals.
            </Text>
          </View>

          {/* App Version */}
          <View className="bg-surface rounded-xl p-4 border border-border text-center items-center">
            <Text className="text-xs text-muted">
              Brain Tumor Detector v1.0.0
            </Text>
            <Text className="text-xs text-muted mt-1">
              © 2026 Medical AI Labs
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
