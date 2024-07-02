/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
//@ts-nocheck
import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#ffffff',
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={backgroundStyle}>
        <Text> selam dünya </Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
