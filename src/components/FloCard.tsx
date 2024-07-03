import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export interface IFloCardProps {
  header: ReactNode;
  body: ReactNode;
  cardStyle: StyleProp<ViewStyle>;
  cardBodyStyle: StyleProp<ViewStyle>;
  children?: React.ReactFragment;
}

const FloCard: React.FC<Partial<IFloCardProps>> = (props) => {
  return (
    <View style={[styles.cardStyle, props.cardStyle]}>
      <View style={[styles.cardBodyStyle, props.cardBodyStyle]}>
        {props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    borderRadius: 6,
    borderColor: "rgb(208, 202, 202)",
    borderWidth: 1,
    elevation: 8,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#333",
    shadowOpacity: 0.13,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardBodyStyle: {
    marginHorizontal: 18,
    marginVertical: 10,
  },
});

export default FloCard;
