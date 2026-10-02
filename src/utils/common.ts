import { Platform } from "react-native";

const behavior =
  Platform.OS === 'ios'
    ? 'padding'
    : Platform.OS === 'android' && Platform.Version >= 35
    ? 'padding'
    : 'height';
    
   export { behavior }; 