import React from 'react';
import { View, Text } from "react-native"

const KeyboardScroll = ({ children, style }) => {
    return (
        <View style={style}>
            {children}
        </View>
    )
}

export default KeyboardScroll
