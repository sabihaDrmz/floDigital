import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { useLinkService, Link } from "../../contexts/LinkService";
import FloHeaderNew from "../../components/Header/FloHeaderNew";
import { translate } from "../../helper/localization/locaizationMain";
import FloLoading from "../../components/FloLoading";

interface LinkProps {
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
  const { downloadFile, downloadingFile } = useLinkService();
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

  const handleDownload = async (
    uri: string,
    name: string,
    id: any,
    ext: string
  ) => {
    downloadFile(uri, id, "." + ext);
  };

  return (
    <>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.groupContainer}
          onPress={changeState}
        >
          <>
            <View style={styles.collapseCircle}>
              <FontAwesomeIcon icon="menu" color={"#fff"} size={18} />
              <FontAwesomeIcon icon="chevron-thin-down" color={"#fff"} size={13} />
            </View>
            <AppText selectable style={styles.groupText}>
              {props.title}
            </AppText>
            <Animated.View style={animatedIcon}>
              <FontAwesomeIcon icon={"chevron-thin-up"} size={20} />
            </Animated.View>
          </>
        </TouchableOpacity>
        <ScrollView>
          {hasOpen &&
            props.links.map((item, index) => {
              return (
                <View key={index} style={{ flexDirection: "row", alignItems: "center", height: 100 }}>
                  <View style={styles.orangeLine} />
                  <View style={{ padding: 10 }}>
                    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                      <AppText selectable style={styles.groupText}>
                        {item.name}
                      </AppText>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", marginVertical: 5, maxWidth: Dimensions.get("screen").width - 50, flexWrap: "wrap" }}>
                      {item.helpFiles && item.helpFiles.map((item2, index2) => {
                        return (
                          <TouchableOpacity key={index2} style={{ marginRight: 5 }} onPress={() => handleDownload(item2.url, item2.name, item2.id, item2.type)}>
                            <AppText selectable style={styles.linkText}>
                              {item2.name}
                            </AppText>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </Animated.View>
      {downloadingFile && (
        <View
          style={{
            position: "absolute",
            ...Dimensions.get("window"),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.4)",
          }}
        >
          <FloLoading />
        </View>
      )}
    </>
  );
};

const LinkView: React.FC<LinkProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const { links, getLinks } = useLinkService();
  useEffect(() => {
    if (loading) {
      getLinks().finally(() => setLoading(false));
    }
  }, []);
  return (
    <View style={styles.container}>
      <FloHeaderNew
        headerType={"standart"}
        headerTitle={translate("linksScreen.title")}
        enableButtons={["back", "notification"]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.wrapper}
        nestedScrollEnabled
      >
        {links.map((x, index) => (
          <LinkAccordion key={index} title={x.name} links={x.helps || []} />
        ))}
      </ScrollView>
    </View>
  );
};
export default LinkView;

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
    height: 20,
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
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: AppColor.FD.Text.Dark,
  },
  linkText: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: AppColor.FD.Text.Dark,
    textDecorationLine: "underline"
  },
  orangeLine: {
    backgroundColor: "#ff8600",
    minHeight: 80,
    width: 6,
    marginLeft: 16,
  },
});
