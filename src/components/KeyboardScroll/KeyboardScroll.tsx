import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from "react-native"
const KeyboardScroll = ({ children, style, contentContainerStyle, ref, extraScrollHeight, onContentSizeChange }) => {
    return (
        <KeyboardAvoidingView style={style} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {children}
        </KeyboardAvoidingView>
    )
}

export default KeyboardScroll;
