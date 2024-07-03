import { createNavigationContainerRef, NavigationContainerRef } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<NavigationContainerRef>();

// for navigate
export function navigate(name: string, params?: object | undefined): void {
    if (navigationRef.isReady()) {
        navigationRef.current?.navigate(name, params);
    }
}

// for replace 
export function navigateReplace(name: string, param: object): void {
    if (navigationRef.isReady()) {
        navigationRef.current?.dispatch(
            StackActions.replace(name, {
                param,
            }),
        );
    }
}

export function goBack(): void {
    if (navigationRef.isReady()) {
        navigationRef.current?.goBack();
    }
}

export function getPathName(): string | undefined {
    if (navigationRef.isReady()) {
        return navigationRef.current?.getCurrentRoute()?.name;
    }
}
