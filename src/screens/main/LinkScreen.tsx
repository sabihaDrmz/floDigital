import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import LinkService, { Link } from "../../core/services/LinkService";
import { translate } from "../../helper/localization/locaizationMain";

interface LinkScreenProps {
  disableHeader?: boolean;
}

interface LinkAccordionProps {
  hasOpen?: boolean;
  onOpen?: (hasOpen: boolean) => void;
  links: Link[];
  title: string;
}

const LinkAccordion: React.FC<LinkAccordionProps> = (props) => {
  const [hasOpen, setOpen] = useState(props.hasOpen === true);
  const sharedHeight = useSharedValue(
    props.hasOpen ? (props.links.length + 1) * 61 : 61
  );
  const rotate = useSharedValue(props.hasOpen ? 0 : 180);

  const changeState = () => {
    "worklet";

    if (props.onOpen) props.onOpen(!hasOpen);

    sharedHeight.value = withTiming(
      hasOpen === true ? 61 : (props.links.length + 1) * 61,
      { easing: Easing.ease, duration: 200 }
    );

    rotate.value = withTiming(hasOpen === true ? 180 : 0, {
      easing: Easing.ease,
      duration: 200,
    });

    setOpen(!hasOpen);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: sharedHeight.value,
      overflow: "scroll",
    };
  });

  const animatedIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotate.value}deg` }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.groupContainer}
        onPress={changeState}
      >
        <View style={styles.collapseCircle}>
          <Entypo name="menu" color={"#fff"} size={18} />
          <Entypo name="chevron-thin-down" color={"#fff"} size={13} />
        </View>
        <AppText selectable style={styles.groupText}>
          {props.title}
        </AppText>
        <Animated.View style={animatedIcon}>
          <Entypo name={"chevron-thin-up"} size={20} />
        </Animated.View>
      </TouchableOpacity>
      {props.links.map((item, index) => {
        return (
          <TouchableOpacity
            key={`subLink_${item.id}`}
            onPress={() => Linking.openURL(item.url)}
            style={styles.groupContainer}
          >
            <View
              style={[
                styles.collapseCircle,
                { backgroundColor: AppColor.OMS.Background.OpacityOrange },
              ]}
            />
            <AppText selectable style={styles.groupText}>
              {item.name}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const LinkScreen: React.FC<LinkScreenProps> = (props) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      LinkService.getLinks().finally(() => setLoading(false));
    }
  });
  return (
    <View style={styles.container}>
      {props.disableHeader ? null : (
        <FloHeaderNew
          headerType={"standart"}
          headerTitle={translate("linksScreen.title")}
          enableButtons={["back"]}
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.wrapper}
        nestedScrollEnabled
      >
        <Observer>
          {() => {
            return (
              <React.Fragment>
                {LinkService.links.map((x) => (
                  <LinkAccordion title={x.name} links={x.helps || []} />
                ))}
              </React.Fragment>
            );
          }}
        </Observer>
      </ScrollView>
    </View>
  );
};
export default LinkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    margin: 20,
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    height: 41,
  },
  collapseCircle: {
    width: 41,
    height: 41,
    borderRadius: 41,
    backgroundColor: AppColor.FD.Brand.Solid,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  groupText: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: AppColor.FD.Text.Dark,
    flex: 1,
  },
});
