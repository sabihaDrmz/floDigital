import {observer} from 'mobx-react';
import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {FloTextBox} from '../../components';
import {FloHeader} from '../../components/Header';
import AccountService from '../../core/services/AccountService';
import {translate} from '../../helper/localization/locaizationMain';

@observer
class ProfileDetailScreen extends Component<any> {
  render() {
    return (
      <>
        <FloHeader
          headerType={'standart'}
          enableButtons={['back']}
          headerTitle={translate('profileDetailScreen.personalInformation')}
        />
        <ScrollView style={styles.container}>
          <View style={{height: 20}}></View>
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.FirstName}
            placeholder={translate('profileDetailScreen.personalInformation')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={moment(AccountService.employeeInfo.BirthDate).format(
              'DD/MM/yyyy',
            )}
            placeholder={translate('profileDetailScreen.birthDay')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.Email}
            placeholder={translate('profileDetailScreen.email')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.EfficiencyRecord}
            placeholder={translate('profileDetailScreen.efficiencyRecord')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.DepartmentName}
            placeholder={translate('profileDetailScreen.department')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.PositionName}
            placeholder={translate('profileDetailScreen.position')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.ExpenseLocationCode}
            placeholder={translate('profileDetailScreen.expenseCentre')}
            floatingLabel
          />
          <FloTextBox
            editable={false}
            value={AccountService.employeeInfo.ExpenseLocationName}
            placeholder={translate('profileDetailScreen.expenseCentreName')}
            floatingLabel
          />
          <View style={{height: 80}}></View>
        </ScrollView>
      </>
    );
  }
}
export default ProfileDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
