
import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigation/stacks/RootStackParams';


export const useAppNavigation = <
  T extends keyof RootStackParams = keyof RootStackParams,
>() => {
  return useNavigation<
    NativeStackNavigationProp<RootStackParams, T>
  >();
};


export const useAppRoute = <
  T extends keyof RootStackParams,
>() => {
  return useRoute<RouteProp<RootStackParams, T>>();
};