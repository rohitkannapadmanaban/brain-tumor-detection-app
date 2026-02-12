import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAnalysis } from '@/lib/analysis-context';
import { formatDate, getResultDisplay, formatConfidence } from '@/lib/analysis-utils';

export default function HistoryScreen() {
  const router = useRouter();
  const { state, deleteResult, clearHistory } = useAnalysis();

  const handleDeleteResult = (id: string) => {
    Alert.alert('Delete Analysis', 'Are you sure you want to delete this analysis?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => deleteResult(id),
        style: 'destructive',
      },
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all analyses? This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Clear All',
          onPress: () => clearHistory(),
          style: 'destructive',
        },
      ]
    );
  };

  const handleViewResult = (resultId: string) => {
    router.push({
      pathname: '/results',
      params: { resultId },
    });
  };

  const renderHistoryItem = ({ item }: any) => {
    const resultDisplay = getResultDisplay(item.result);
    return (
      <TouchableOpacity
        onPress={() => handleViewResult(item.id)}
        className="bg-surface rounded-xl p-4 border border-border mb-3 active:opacity-80"
      >
        <View className="flex-row justify-between items-start gap-3">
          <View className="flex-1 gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">{resultDisplay.icon}</Text>
              <Text className="text-base font-semibold text-foreground flex-1">
                {resultDisplay.label}
              </Text>
            </View>
            <Text className="text-sm text-muted">
              {formatDate(item.timestamp)}
            </Text>
            <Text className="text-xs text-muted mt-1">
              Confidence: {formatConfidence(item.confidence)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteResult(item.id)}
            className="p-2 active:opacity-50"
          >
            <Text className="text-lg">🗑️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">
                Analysis History
              </Text>
              <Text className="text-sm text-muted">
                {state.analysisHistory.length} analysis
                {state.analysisHistory.length !== 1 ? 'es' : ''}
              </Text>
            </View>
            {state.analysisHistory.length > 0 && (
              <TouchableOpacity
                onPress={handleClearHistory}
                className="p-2 active:opacity-50"
              >
                <Text className="text-lg">🗑️</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* History List */}
          {state.analysisHistory.length > 0 ? (
            <FlatList
              data={state.analysisHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 0 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center gap-4 py-12">
              <Text className="text-5xl">📋</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                No Analyses Yet
              </Text>
              <Text className="text-sm text-muted text-center max-w-xs">
                Start by uploading an MRI image from the Analyze tab to see your analysis history here.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)')}
                className="bg-primary rounded-full px-6 py-3 mt-4"
              >
                <Text className="text-white font-semibold">Go to Analyze</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Stats Card */}
          {state.analysisHistory.length > 0 && (
            <View className="bg-surface rounded-xl p-4 border border-border gap-3 mt-4">
              <Text className="text-sm font-semibold text-muted uppercase tracking-wider">
                Statistics
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-primary">
                    {state.analysisHistory.filter((r) => r.result === 'tumor').length}
                  </Text>
                  <Text className="text-xs text-muted">Tumors Detected</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-success">
                    {state.analysisHistory.filter((r) => r.result === 'no-tumor').length}
                  </Text>
                  <Text className="text-xs text-muted">No Tumor</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-foreground">
                    {state.analysisHistory.length}
                  </Text>
                  <Text className="text-xs text-muted">Total</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
