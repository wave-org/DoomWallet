import EncryptedStorage from 'react-native-encrypted-storage';
import React from 'react';
let mode: boolean | undefined;
const AirgapModeKey = 'AIRGAP_MODE';

export async function loadAirgapMode() {
  const storedValue = await EncryptedStorage.getItem(AirgapModeKey);
  if (storedValue !== null && storedValue !== undefined) {
    mode = storedValue === 'true';
  } else {
    mode = true;
  }
  return mode;
}

export function getAirgapMode() {
  if (mode === undefined) {
    throw new Error('Mode not loaded');
  }
  return mode;
}

const AirgapContext = React.createContext({
  airgapMode: false,
  toggleAirgapMode: () => {},
});

export const AirgapProvider = ({children}: {children: any}) => {
  const [airgapMode, setMode] = React.useState(getAirgapMode());

  return (
    <AirgapContext.Provider
      value={{
        airgapMode: airgapMode,
        toggleAirgapMode: () => {
          setMode(prev => {
            setAirgapMode(!prev);
            return !prev;
          });
        },
      }}>
      {children}
    </AirgapContext.Provider>
  );
};

export const useAirgapMode = () => {
  const {airgapMode, toggleAirgapMode} = React.useContext(AirgapContext);
  return {airgapMode, toggleAirgapMode};
};

export async function setAirgapMode(value: boolean) {
  mode = value;
  await EncryptedStorage.setItem(AirgapModeKey, value.toString());
}
