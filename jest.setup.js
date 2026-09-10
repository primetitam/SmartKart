/**
 * SafeAreaView backs into a native view that the Jest renderer can't mount, so it
 * silently drops its children. Screens pin their content (and any text under test)
 * inside it, so stub just that one export with a plain View and keep the rest of
 * the module real (the Tabs navigator depends on SafeAreaProvider internally).
 */
jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  const React = require('react');
  const { View } = require('react-native');
  const SafeAreaView = ({ children, style, ...rest }) =>
    React.createElement(View, { ...rest, style }, children);
  return { ...actual, SafeAreaView };
});

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    getItem: jest.fn(async (key) => (store.has(key) ? store.get(key) : null)),
    setItem: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    removeItem: jest.fn(async (key) => {
      store.delete(key);
    }),
    clear: jest.fn(async () => {
      store.clear();
    }),
  };
});

/**
 * expo-speech-recognition embarca código nativo injetado pelo prebuild; o
 * renderer de Jest não tem o módulo registrado, então expomos um stub dos
 * membros usados pela tela de pré-lista (eventos + controle do reconhecedor).
 */
jest.mock('expo-speech-recognition', () => {
  const handlers = new Map();
  const module = {
    isRecognitionAvailable: jest.fn(() => true),
    requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    getStateAsync: jest.fn(async () => 'inactive'),
    getSupportedLocales: jest.fn(async () => ({ locales: [], installedLocales: [] })),
    androidTriggerOfflineModelDownload: jest.fn(async () => ({ status: 'download_success', message: 'ok' })),
  };
  return {
    ...module,
    ExpoSpeechRecognitionModule: module,
    useSpeechRecognitionEvent: jest.fn((eventName, listener) => {
      handlers.set(eventName, listener);
    }),
    // helper usado internamente pelos testes
    __emit: (eventName, payload) => {
      handlers.get(eventName)?.(payload);
    },
  };
});
