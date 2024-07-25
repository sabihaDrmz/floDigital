import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import AnouncementIcon from "../../components/CustomIcons/AnouncementIcon";
import ArrowDownIcon from "../../components/CustomIcons/ArrowDownIcon";
import AttachmentIcon from "../../components/CustomIcons/AttachmentIcon";
import ExcelIcon from "../../components/CustomIcons/ExcelIcon";
import ImgFileIcon from "../../components/CustomIcons/ImgFileIcon";
import PdfIcon from "../../components/CustomIcons/PdfIcon";
import { translate } from "../../helper/localization/locaizationMain";
import { colors } from "../../theme/colors";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { AppColor, AppText } from "@flomagazacilik/flo-digital-components";
import { useAnnouncementService } from "../../contexts/AnnouncementService";
import {
  AnnouncementFile,
  AnnouncementModel,
} from "../../contexts/model/AnnouncementModel";

const AnnouncementsScreen: React.FC<{ currentTab: number }> = (props) => {
  const AnnouncementService = useAnnouncementService();
  const [currentTab, setCurrentTab] = useState(props.currentTab);

  useEffect(() => {
    AnnouncementService.loadAllAnnouncement();
  }, []);

  const handleDownload = async (
    uri: string,
    name: string,
    id: any,
    ext: string
  ) => {
    AnnouncementService.downloadFile(uri, id, "." + ext);
  };

  // Common
  const Seperator: React.FC = () => {
    return (
      <View
        style={{
          borderStyle: "solid",
          borderWidth: 0.5,
          borderColor: "rgb(228, 228, 228)",
        }}
      ></View>
    );
  };

  // Announcements

  const AnnouncmentItem = (ancProps: AnnouncementModel) => {
    const files =
      ancProps.announcementFiles && ancProps.announcementFiles.length > 0
        ? ancProps.announcementFiles
        : null;
    return (
      <View style={styles.itemContainer}>
        {files ? (
          <FileIcon type={files[0].type} />
        ) : (
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <AnouncementIcon />
            </View>
          </View>
        )}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {!ancProps.isRead && (
            <FontAwesomeIcon
              icon="new"
              size={25}
              color={AppColor.FD.Brand.Solid}
              style={{ marginBottom: 10 }}
            />
          )}
          <View style={styles.orangeLine}></View>
        </View>
        <View
          style={[
            styles.descContainer,
            files ? styles.flexColBetween : styles.flexColCenter,
          ]}
        >
          <View
            style={{
              maxWidth: "95%",
            }}
          >
            <Text
              style={[
                styles.text,
                styles.textPassive,
                {
                  fontFamily: ancProps.isRead
                    ? "Poppins_500Medium"
                    : "Poppins_700Bold",
                  marginTop: -5,
                  padding: 0,
                  marginBottom: 5,
                  fontSize: PerfectFontSize(18),
                },
                !ancProps.isRead && { color: AppColor.FD.Text.Dark },
              ]}
            >
              {ancProps.title}
            </Text>
            <Text
              style={[
                styles.text,
                styles.textPassive,
                { marginBottom: 10 },
                !ancProps.isRead && {
                  color: AppColor.FD.Text.Dark,
                  fontFamily: "Poppins_500Medium",
                },
              ]}
            >
              {ancProps.contents}
            </Text>
          </View>
          {/* {files && (
            <View
              style={{
                maxWidth: "95%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                numberOfLines={1}
                style={[styles.text, styles.textPassive, styles.textLink]}
                onPress={() => {
                  handleDownload(
                    files[0].url,
                    files[0].name,
                    files[0].id,
                    files[0].type
                  );
                }}
              >
                {files[0].name}
              </Text>
              {files.length > 1 && (
                <View style={styles.fileBadge}>
                  <Text style={styles.badgeText}>+{files.length - 1}</Text>
                </View>
              )}
            </View>
          )} */}
          {files &&
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
              {files.map((file, index) => {
                return (
                  <Text
                    numberOfLines={1}
                    style={[styles.text, styles.textPassive, { marginRight: 10, textDecorationLine: "underline", marginVertical: 5 }]}
                    onPress={() => {
                      handleDownload(
                        file.url,
                        file.name,
                        file.id,
                        file.type
                      );
                    }}
                  >
                    {file.name}
                  </Text>
                )
              })
              }
            </View>
          }
        </View>
      </View>
    );
  };

  const renderAncList = () => {
    const [onlyAttchment, setOnlyAttachment] = useState(false);
    return (
      <ScrollView>
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            margin: 10,
          }}
        >
          {/* <Entypo name={"attachment"} size={20} /> */}
          <AppText
            style={[
              { fontWeight: "500" },
              onlyAttchment && { color: AppColor.FD.Text.Default },
            ]}
          >
            {translate("announceMiddlewareAlerts.onlyFiles")}
          </AppText>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              AnnouncementService.loadAllAnnouncement(!onlyAttchment);
              setOnlyAttachment(!onlyAttchment);
            }}
            style={{
              width: 60,
              height: 30,
              borderRadius: 15,
              backgroundColor: !onlyAttchment
                ? AppColor.FD.Text.Light
                : AppColor.FD.Brand.Solid,
              flexDirection: "row",
              justifyContent: !onlyAttchment ? "flex-start" : "flex-end",
              marginLeft: 10,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 15,
                backgroundColor: "#fff",
                marginVertical: 3,
                marginHorizontal: 3,
              }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.listContainer}
          data={
            AnnouncementService.announcements &&
              AnnouncementService.announcements.length > 0
              ? AnnouncementService.announcements
              : []
          }
          keyExtractor={(item) => item.id?.toString()}
          renderItem={(itr) => <AnnouncmentItem {...itr.item} />}
          ListFooterComponent={() => <View style={{ height: 180 }} />}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins_700Bold",
                  fontSize: 20,
                  color: colors.darkGrey,
                }}
              >
                {AnnouncementService.isLoading
                  ? translate("homeScreen.loadingAncs")
                  : translate("homeScreen.noRecord")}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={Seperator}
          refreshControl={
            <RefreshControl
              refreshing={AnnouncementService.isLoading}
              tintColor={colors.brightOrange}
              onRefresh={() => AnnouncementService.loadAllAnnouncement()}
            />
          }
        />
      </ScrollView>
    );
  };

  // Documents

  const FileIcon = (props: { type: string; color?: string; size?: number }) => {
    const imageExt = ["jpg", "jpeg", "bmp", "gif", "png"];

    const renderIcon = () => {
      switch (props.type) {
        case "xls":
        case "xlsx":
          return (
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <ExcelIcon />
              </View>
              <View style={styles.icon}>
                <ArrowDownIcon />
              </View>
            </View>
          );
        case "pdf":
          return (
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <PdfIcon />
              </View>
              <View style={styles.icon}>
                <ArrowDownIcon />
              </View>
            </View>
          );
        case "doc":
        case "tex":
        case "odt":
        case "docx":
          return (
            <View style={styles.iconContainer}>
              <FontAwesomeIcon
                style={styles.icon}
                icon={"wordfile1"}
                size={props.size != null ? props.size : 32}
                color={props.color || "#707070"}
              />
              <View style={styles.icon}>
                <ArrowDownIcon />
              </View>
            </View>
          );
        case "jpg":
        case "jpeg":
        case "bmp":
        case "gif":
        case "png":
          return (
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <ImgFileIcon />
              </View>
              <View style={styles.icon}>
                <ArrowDownIcon />
              </View>
            </View>
          );
        default:
          return (
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <AttachmentIcon />
              </View>
            </View>
          );
      }
    };

    return renderIcon();
  };

  const DocItem = (props: AnnouncementFile) => {
    return (
      <View style={styles.itemContainer}>
        <View style={[styles.orangeLine, { marginRight: 15 }]}></View>
        <FileIcon type={props.type} />
        <View style={[styles.descContainer, styles.flexColCenter]}>
          <View
            style={{
              maxWidth: "95%",
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.text, styles.textPassive, styles.textLink]}
              onPress={() => {
                handleDownload(props.url, props.name, props.id, props.type);
              }}
            >{`${props.name}.${props.type}`}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDocList = () => {
    return (
      <FlatList
        style={styles.listContainer}
        data={
          AnnouncementService.announcementFiles &&
            AnnouncementService.announcementFiles.length > 0
            ? AnnouncementService.announcementFiles
            : []
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={(itr) => <DocItem {...itr.item} />}
        ListEmptyComponent={() => (
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Poppins_700Bold",
              fontSize: 20,
              color: colors.darkGrey,
            }}
          >
            {AnnouncementService.isLoading
              ? translate("homeScreen.loadingDocs")
              : translate("homeScreen.noDocs")}
          </Text>
        )}
        ItemSeparatorComponent={Seperator}
        refreshControl={
          <RefreshControl
            refreshing={AnnouncementService.isLoading}
            tintColor={colors.brightOrange}
            onRefresh={() => AnnouncementService.loadAllFiles()}
          />
        }
      />
    );
  };

  // Main View

  return (
    currentTab === 0 ? renderAncList() : renderDocList()
  );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    // flex: 1 // toplam dipte dursun istenirse
  },
  tabItem: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 0,
    flexBasis: "50%",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItemPassive: {
    color: "rgb(112,112,112)",
    backgroundColor: "#fff",
  },
  tabItemActive: {
    backgroundColor: "#ff8600",
    color: "#fff",
  },
  textCenter: {
    textAlign: "center",
  },
  text: {
    fontFamily: "Poppins_300Light",
    fontSize: PerfectFontSize(14),
  },
  textPassive: {
    color: "rgb(112,112,112)",
  },
  textActive: {
    color: "#fff",
  },
  textLink: {
    textDecorationLine: "underline",
    flex: 1,
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 0,
    paddingHorizontal: 20,
    marginBottom: 30,
    // paddingTop: 30,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginVertical: 20,
  },
  orangeLine: {
    backgroundColor: "#ff8600",
    height: "80%",
    minHeight: 80,
    width: 6,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 43,
    marginRight: 5,
  },
  icon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  descContainer: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    height: "100%",
    maxWidth: "95%",
    flexGrow: 1,
  },
  flexColBetween: {
    justifyContent: "space-between",
  },
  flexColCenter: {
    justifyContent: "center",
  },
  fileBadge: {
    backgroundColor: "rgb(152, 151, 151)",
    borderRadius: 5,
    marginLeft: 5,
    height: 27,
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: "Poppins_300Light",
    color: "#fff",
    textAlign: "center",
    fontSize: PerfectFontSize(14),
    letterSpacing: 0.75,
    lineHeight: PerfectFontSize(20),
  },
});
