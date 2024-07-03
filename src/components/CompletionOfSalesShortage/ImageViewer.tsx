import React from "react";
import { Modal, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AppText } from "@flomagazacilik/flo-digital-components";

interface ImageViewerProps {
    imageSource: string;
    isVisible: boolean;
    onClose: () => void;
};

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
    return (
        <Modal visible={props.isVisible} animationType="none" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={props.onClose}>
                        <View style={styles.close}>
                            <AppText>X</AppText>
                        </View>
                    </TouchableOpacity>
                    <Image source={{ uri: props.imageSource }} style={styles.image} resizeMode="contain" />
                </View>
            </View>
        </Modal>
    );
};
export default ImageViewer;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    imageContainer: {
        width: "90%",
        height: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden"
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 999
    },
    close: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 25,
        height: 25,
        backgroundColor: "rgba(0,0,0,.1)",
        borderRadius: 12.5,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 30
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%"
    }
});