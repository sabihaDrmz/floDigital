import { observer } from "mobx-react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { FloHeader } from "../../components/Header";
import RoleGroup from "../../components/RoleGroup";
import {
  fileExt,
  getFileIcon,
  imageExt,
} from "../../core/models/FileImageSelector";
import AnnouncementService from "../../core/services/AnnouncementService";
import { GetServiceUri, ServiceUrlType } from "../../core/Settings";
import { translate } from "../../helper/localization/locaizationMain";
import { colors } from "../../theme/colors";

interface DocumentScreenProps {
  GetAllFiles?: () => void;
  documents?: any[];
  loadingVisibibility: boolean;
}

@observer
class DocumentScreen extends Component<DocumentScreenProps> {
  state = { data: [] };
  componentDidMount() {
    this._loadData();
  }

  isDownloaded(itr: any) {
    let found = AnnouncementService.downloadFiles.indexOf(itr.id);
    return found > -1;
  }

  download = async (uri: string, name: string, id: any, ext: string) => {
    AnnouncementService.DownloadFile(uri, id, name + "." + ext);
  };

  _loadData = async () => {
    await AnnouncementService.LoadAllFiles();
    this.setState({ data: AnnouncementService.announcementFiles });
  };

  _renderFile = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.download(item.url, item.name, item.id, item.type)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={getFileIcon(item.type)}
            style={{ width: 30, height: 35 }}
          />
          <View
            style={{
              marginLeft: 20,
              width: Dimensions.get("window").width - 120,
            }}
          >
            <Text>{item.name}</Text>
            <Text>{item.name}</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
            }}
          >
            <Feather
              name={"download"}
              size={20}
              color={!this.isDownloaded(item) ? colors.darkGrey : "green"}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderPicture = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.download(item.url, item.name, item.id, item.type)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={{
              uri:
                GetServiceUri(ServiceUrlType.BASE_URL) + item.url.substring(1),
            }}
            style={{ width: 30, height: 35 }}
          />
          <View
            style={{
              marginLeft: 20,
              width: Dimensions.get("window").width - 90,
            }}
          >
            <Text>{item.name}</Text>
            <Text>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderSparetor() {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(0,0,0,0.1)",
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    );
  }
  render() {
    let l = AnnouncementService.downloadFiles;
    return (
      <FloHeader
        headerType={"searchtab"}
        headerTitle={translate("documentScreen.title")}
        enableButtons={["profile"]}
        onFilterData={(data) => this.setState({ data })}
        data={AnnouncementService.announcementFiles}
        tabs={[
          translate("documentScreen.file"),
          translate("documentScreen.picture"),
        ]}
        tabsScreen={[
          <RoleGroup roleName={"omc-document"}>
            <FlatList
              data={this.state.data.filter((x: any) =>
                fileExt.includes(x.type)
              )}
              style={{
                width: Dimensions.get("window").width - 40,
                height: Dimensions.get("screen").height,
              }}
              renderItem={(itr) => this._renderFile(itr.item)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._renderSparetor}
              refreshControl={
                <RefreshControl
                  refreshing={AnnouncementService.isLoading}
                  tintColor={colors.brightOrange}
                  onRefresh={() => this._loadData()}
                />
              }
              ListEmptyComponent={
                <Text
                  style={{ textAlign: "center", fontSize: 20, marginTop: 30 }}
                >
                  {translate("documentScreen.emptyMessage")}
                </Text>
              }
            />
          </RoleGroup>,
          <RoleGroup roleName={"omc-document"}>
            <FlatList
              data={this.state.data.filter((x: any) =>
                imageExt.includes(x.type)
              )}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: Dimensions.get("window").width - 40 }}
              renderItem={(itr) => this._renderPicture(itr.item)}
              ItemSeparatorComponent={this._renderSparetor}
              refreshControl={
                <RefreshControl
                  refreshing={AnnouncementService.isLoading}
                  tintColor={colors.brightOrange}
                  onRefresh={() => this._loadData()}
                />
              }
              ListEmptyComponent={
                <Text
                  style={{ textAlign: "center", fontSize: 20, marginTop: 30 }}
                >
                  {translate("documentScreen.emptyMessage")}
                </Text>
              }
            />
          </RoleGroup>,
        ]}
      />
    );
  }
}
export default DocumentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
