import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FloButton} from '../../components';
import {colors} from '../../theme/colors';
import {FloHeader} from '../../components/Header';
import {Actions} from 'react-native-router-flux';
import {translate} from '../../helper/localization/locaizationMain';
import {observer} from 'mobx-react';
import AccountService from '../../core/services/AccountService';

@observer
class ProfileScreen extends React.Component {
  render() {
    return (
      <>
        <FloHeader
          headerType={'standart'}
          enableButtons={['back']}
          headerTitle={translate('profileScreen.profile')}
        />
        <View style={styles.container}>
          <FloButton
            onPress={() => Actions['profileDetailScreen']()}
            title={translate('profileScreen.personalInformation')}
            containerStyle={{
              backgroundColor: colors.white,
              borderColor: colors.warm_grey_two,
              borderWidth: 1,
              borderRadius: 4,
              marginBottom: 20,
            }}
            style={{color: colors.darkGrey}}
          />
          <FloButton
            onPress={() => AccountService.logOut()}
            title={translate('profileScreen.logOut')}
            containerStyle={{
              backgroundColor: colors.white,
              borderColor: colors.warm_grey_two,
              borderWidth: 1,
              borderRadius: 4,
            }}
            style={{color: colors.darkGrey}}
          />
        </View>
      </>
    );
  }
}
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
