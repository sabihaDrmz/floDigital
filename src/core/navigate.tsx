import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationType } from '../../StackNavigator';

export const useCustomNavigation = () => {
    const navigation = useNavigation<NavigationType>();
    const route = useRoute();

    const navigate = async (route: any, params?: object) => {
        navigation.navigate(route, params);
    };

    const goBack = () => {
        navigation.goBack();
    };

    const getPathName = () => {
        return route?.name;
    };

    return { navigate, goBack, getPathName };
};
