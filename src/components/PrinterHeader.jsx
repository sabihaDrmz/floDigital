import { PerfectFontSize } from 'helper/PerfectPixel';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from 'theme/colors';
// const Header1 = ({ isConnected, scaning, disabled, onPress, }) => {
//     return (React.createElement(View, { style: styles.container },
//         React.createElement(TouchableOpacity, { activeOpacity: 0.7, style: [styles.buttonView, { opacity: disabled ? 0.7 : 1 }], disabled: disabled, onPress: onPress },
//             React.createElement(Text, { style: [styles.buttonText] }, scaning ? 'Aranıyor' : isConnected ? 'Bağlantıyı kes' : 'Cihaz Ara')),
//         React.createElement(Text, { style: { marginLeft: 10, marginTop: 10 } }, isConnected ? 'Bağlı Cihaz' : 'Mevcut Cihazlar :')));
// };

const PrinterHeader = ({isConnected, scaning, disabled, onPress}) => {
    
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.7}  style= {[styles.buttonView, { opacity: disabled ? 0.7 : 1 }]}  disabled= {disabled} onPress={onPress}>
                <Text style={[styles.buttonText]}  >
                    {
                        scaning ? 'Aranıyor' : isConnected ? 'Bağlantıyı kes' : 'Cihaz Ara'
                    }
                </Text>
            </TouchableOpacity>
            <Text style={{marginLeft:10,marginTop:10}}>
                {
                    isConnected ? 'Bağlı Cihaz' : 'Mevcut Cihazlar :'
                } 
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    buttonView: {
        backgroundColor: colors.floOrange,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: PerfectFontSize(16),
    },
});
export default PrinterHeader;
