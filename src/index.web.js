import {AppRegistry} from 'react-native';
import App from './App';
import { enableLegacyWebImplementation } from 'react-native-gesture-handler';

enableLegacyWebImplementation(true);

const appName = 'FloDigital';
AppRegistry.registerComponent(appName, ()=>App);
AppRegistry.runApplication(appName,{
  rootTag: document.getElementById('root')
});
