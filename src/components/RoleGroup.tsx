import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from ".";
import { translate } from "../helper/localization/locaizationMain";
import { PerfectFontSize } from "../helper/PerfectPixel";
import { colors } from "../theme/colors";
import { useAccountService } from "../contexts/AccountService";

export enum RoleLevel {
  READ,
  UPDATE,
  REMOVE,
  INSERT,
  ALLIN,
}

export enum RoleType {
  UNK,
  HOME,
  DOCUMENT,
  FIND_PRODUCT,
  HELP,
  OTHER,
  CRM,
  EASY_RETURN,
  PTC_TAG,
  CONTACT_US,
}

export type RoleGroupProps = {
  roleName: string;
  children?: ReactNode;
};

const RoleGroup = (props: any) => {
  const AccountService = useAccountService();
  let role = AccountService.userRoles.findIndex(
    (x) => x.roleName === props.roleName && x.permissions.CanRead
  );

  if (role === -1) {
    return (
      <View
        style={{
          padding: 25,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <FontAwesome name={"close"} color={colors.brightOrange} size={100} />
        <Text
          style={{
            fontSize: PerfectFontSize(30),
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {translate("modalRoleGroup.SoryNoAuthorization")}
        </Text>
      </View>
    );
  }

  return props.children;
};

export default RoleGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
