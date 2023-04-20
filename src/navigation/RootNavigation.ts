import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: any, params: any) {
  console.log('ready', navigationRef);
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
