import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult, AppState } from './types';

const STORAGE_KEY = '@brain_tumor_app_state';

type AnalysisAction =
  | { type: 'ADD_RESULT'; payload: AnalysisResult }
  | { type: 'DELETE_RESULT'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_HISTORY'; payload: AnalysisResult[] }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_ONBOARDING'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  analysisHistory: [],
  isDarkMode: false,
  hasSeenOnboarding: false,
};

function analysisReducer(state: AppState, action: AnalysisAction): AppState {
  switch (action.type) {
    case 'ADD_RESULT':
      return {
        ...state,
        analysisHistory: [action.payload, ...state.analysisHistory],
      };
    case 'DELETE_RESULT':
      return {
        ...state,
        analysisHistory: state.analysisHistory.filter(
          (result) => result.id !== action.payload
        ),
      };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        analysisHistory: [],
      };
    case 'SET_HISTORY':
      return {
        ...state,
        analysisHistory: action.payload,
      };
    case 'SET_DARK_MODE':
      return {
        ...state,
        isDarkMode: action.payload,
      };
    case 'SET_ONBOARDING':
      return {
        ...state,
        hasSeenOnboarding: action.payload,
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface AnalysisContextType {
  state: AppState;
  addResult: (result: AnalysisResult) => void;
  deleteResult: (id: string) => void;
  clearHistory: () => void;
  setDarkMode: (isDark: boolean) => void;
  setOnboardingComplete: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export function AnalysisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    loadState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async (appState: AppState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const addResult = (result: AnalysisResult) => {
    dispatch({ type: 'ADD_RESULT', payload: result });
  };

  const deleteResult = (id: string) => {
    dispatch({ type: 'DELETE_RESULT', payload: id });
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  const setDarkMode = (isDark: boolean) => {
    dispatch({ type: 'SET_DARK_MODE', payload: isDark });
  };

  const setOnboardingComplete = () => {
    dispatch({ type: 'SET_ONBOARDING', payload: true });
  };

  return (
    <AnalysisContext.Provider
      value={{
        state,
        addResult,
        deleteResult,
        clearHistory,
        setDarkMode,
        setOnboardingComplete,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
