import React,{useEffect,useRef,useState} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import {useMediaSelector} from "./MediaSelector";
import {
  AppColor,
  AppText,
  ColorType,
  FontSizes,
} from "@flomagazacilik/flo-digital-components";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Portal} from "react-native-portalize";
import {ifIphoneX} from "react-native-iphone-x-helper";
import Animated,{
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ImagePreview from "./ImagePreview";
import {useStopwatch} from "react-timer-hook";;
import Video from 'react-native-video';
import * as ImagePicker from 'react-native-image-picker';
import {useMessageBoxService} from "../../contexts/MessageBoxService";
import {PerfectFontSize} from "../../helper/PerfectPixel";
interface MediaSelectorPopupProps {
  alertMessage?: string;
  settings?: {
    canEditable?: boolean;
    limitCount?: number;
  };
}

const AnimatedTouchableOpacity=
  Animated.createAnimatedComponent(TouchableOpacity);
const MediaSelectorPopup: React.FC<MediaSelectorPopupProps>=(props) => {

  const {
    isShow,
    setIsShowData,
    getMediaLibraryPreviewData,
    medias,
    settings,
    removeMedia,
    onAssetSelect,
    cameraPermission,
    isPermitted
  }=useMediaSelector();
  const [selectedVideo,setSelectedVideo]=useState("");
  const [assets,setAssets]=useState<any>([]);
  const [isVideoStarted,setIsVideoStarted]=useState(false);
  const color=useSharedValue(0);
  const [capturePicuture,setCameracapPicture]=
    useState<any>();
  const camera=useRef<any>(null);
  const [videoElapsedTime,setVideoElapsedTime]=useState(0);
  const timer=useStopwatch({autoStart: false});
  const MessageBox=useMessageBoxService();
  useEffect(() => {
    // getMediaLibraryPreviewData()
    //   .then((res) => {
    //     setAssets(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // color.value = withRepeat(
    //   withTiming(1, { duration: 800, easing: Easing.ease }),
    //   -1,
    //   true
    // );
    // setIsShowData(false);
    cameraPermission();

  },[]);

  const cameraPermissionAlert=() => {
    MessageBox.show(
      "Kamera İzniniz bulunmamaktadır.Uygulamayı kapatıp Ayarlar'dan izin vermeniz gerekmektedir."
    );
  };

  const circleButtonAnimatedStyle=useAnimatedStyle(() => {
    var c=interpolateColor(
      color.value,
      [0,1],
      ["rgba(255, 0, 0, 0.4)",AppColor.FD.Functional.Error],
      "RGB"
    );

    return {
      backgroundColor: c,
    };
  });

  const videoStart=() => {
    setIsVideoStarted(true);
    timer.reset();
    timer.start();
    camera.current.startRecording({
      onRecordingFinished: (video) =>{
          setSelectedVideo(video?.path.includes('file://')?video?.path:`file://${video?.path}`)
        },
      onRecordingError: (error) => console.error(error)
    })
  };

  const stopVideoRecord=() => {
    setIsVideoStarted(false);
    timer.pause();
     camera.current?.stopRecording();
  };
  const takePicture=async () => {
    var picture =  await camera.current.takePhoto()
    setCameracapPicture({height:picture?.height,uri:picture?.path.includes('file://')?picture?.path:`file://${picture?.path}`,width:picture?.width});

  };

  const openMediaLibrary=async () => {

  };

  return (
    <View>
      <View style={{alignItems: "center"}}>
        {(props.settings===undefined||
          props.settings.limitCount===undefined||
          props.settings?.limitCount>medias.length)&&(
            <TouchableOpacity
              style={{
                width: 59,
                height: 59,
                borderRadius: 59/2,
                backgroundColor: AppColor.FD.Brand.Solid,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => {
                setIsShowData(true);
                setCameracapPicture(undefined);
              }}
            >
              <FontAwesomeIcon
                icon="camera-plus"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          )}
        {props.alertMessage&&(
          <AppText
            labelColorType={ColorType.Danger}
            size={FontSizes.XS}
            style={{textAlign: "center"}}
          >
            {props.alertMessage}
          </AppText>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          {medias.map((media,index) => {
            return (
              <View key={`image-${index}`}>
                <Image
                  source={{uri: media.Thumb||media.Url}}
                  style={{
                    width: 60,
                    height: 107,
                    resizeMode: "contain",
                    backgroundColor: "rgba(0,0,0,.3)",
                    marginLeft: 10,
                    borderRadius: 10,
                  }}
                />
                {props.settings?.canEditable&&(
                  <TouchableOpacity
                    onPress={() => removeMedia(media)}
                    style={{
                      position: "absolute",
                      left: 25,
                      top: 35,
                      backgroundColor: "#fff",
                      width: 26,
                      height: 26,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 13,
                    }}
                  >
                    <FontAwesomeIcon icon="closecircle" size={25} color={"black"} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>
      {isShow&&(
        <React.Fragment>
          {(capturePicuture===null||capturePicuture===undefined)&&
            selectedVideo===""&&(
              <Portal>
                {isPermitted? (
                  <View
                    style={{
                      position: "absolute",
                      width,
                      height,
                      backgroundColor: "#fff",
                    }}
                  >

                    {isVideoStarted && (
                      <View
                        style={{
                          position: "absolute",
                          top: 100,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          width,
                        }}
                      >
                        <AppText style={{ color: "#fff" }}>
                          {timer.minutes > 9
                            ? `${timer.minutes}`
                            : `0${timer.minutes}`}
                          :
                          {timer.seconds > 9
                            ? `${timer.seconds}`
                            : `0${timer.seconds}`}
                        </AppText>
                        <Animated.View
                          style={[
                            {
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              marginLeft: 5,
                            },
                            circleButtonAnimatedStyle,
                          ]}
                        />
                      </View>
                    )}
                    <TouchableOpacity
                      style={{
                        width: 30,
                        height: 30,
                        position: "absolute",
                        right: 30,
                        top: 50,
                      }}
                      onPress={() => setIsShowData(false)}
                      hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
                    >
                      <FontAwesomeIcon icon="close" size={25} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ position: "absolute", bottom: 60, width }}>
                      <FlatList
                        data={assets}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              height: 66,
                              width: 66,
                              backgroundColor: "#fff",
                              marginRight: 5,
                            }}
                            onPress={() => setCameracapPicture(item)}
                          >
                            <Image
                              source={{ uri: item.uri }}
                              style={StyleSheet.absoluteFillObject}
                            />
                          </TouchableOpacity>
                        )}
                        horizontal
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          marginVertical: 15,
                        }}
                      >
                        <TouchableOpacity
                          onPress={openMediaLibrary}
                          style={{
                            width: 70,
                            height: 70,
                            backgroundColor: "transparent",
                            borderRadius: 35,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon="folder-upload"
                            size={35}
                            color="white"
                          />
                        </TouchableOpacity>
                        <AnimatedTouchableOpacity
                          onLongPress={() => videoStart()}
                          onPress={() =>
                            isVideoStarted ? stopVideoRecord() : takePicture()
                          }
                          style={[
                            {
                              width: 70,
                              height: 70,
                              borderWidth: 5,
                              borderColor: "#fff",
                              backgroundColor: isVideoStarted
                                ? AppColor.FD.Brand.Solid
                                : "transparent",
                              borderRadius: 35,
                            },
                          ]}
                        ></AnimatedTouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        ...ifIphoneX(
                          {
                            height: 60,
                          },
                          { height: 26 }
                        ),
                        padding: 4,
                        backgroundColor: AppColor.FD.Brand.Solid,
                        position: "absolute",
                        width,
                        bottom: 0,
                      }}
                    >
                      <AppText
                        style={{
                          textAlign: "center",
                          fontFamily: "Poppins_400Regular",
                          fontSize: 12,
                        }}
                        labelColorType={ColorType.Light}
                      >
                        Video için basılı tutun, fotoğraf için dokunun
                      </AppText>
                    </View>
                  </View>
            ) : (
          <View
            style={{
              position: "absolute",
              width,
              height,
              backgroundColor: "#fff",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsShowData(false);
                setCameracapPicture(undefined);
              }}
              style={{left: width-100,top: 30}}
            >
              <FontAwesomeIcon icon="times" size={40} color="black" />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: height/5,
              }}
            >
              <TouchableOpacity
                onPress={openMediaLibrary}
                style={{
                  width: width-100,
                  height: 300,
                  backgroundColor: "#cecece",
                  borderRadius: 35,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon="file-image-plus"
                  size={36}
                  color="black"
                />
                <AppText
                  style={{
                    color: "#fff",
                    fontSize: PerfectFontSize(20),
                  }}
                >
                  Resim Yüklemek İçin Tıklayınız
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
                )}
        </Portal>
      )}
      {capturePicuture!==null&&capturePicuture!==undefined&&(
        <ImagePreview
          onCancel={() => setCameracapPicture(undefined)}
          {...capturePicuture}
        />
      )}
      {selectedVideo!==""&&(
        <Portal>
          <View
            style={{
              position: "absolute",
              backgroundColor: "rgba(0,0,0,1)",
              width,
              height,
            }}
          >

            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                position: "absolute",
                right: 30,
                top: 50,
              }}
              onPress={() => setSelectedVideo("")}
              hitSlop={{top: 20,left: 20,right: 20,bottom: 20}}
            >
              <FontAwesomeIcon icon="close" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onAssetSelect({
                  Url: selectedVideo,
                  MediaType: "video",
                });
                setSelectedVideo("");
              }}
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                width: width,
                height: 70,
                ...ifIphoneX(
                  {
                    bottom: 75,
                  },
                  {bottom: 35}
                ),
              }}
            >
              <FontAwesomeIcon icon="pluscircleo" size={70} color="white" />
            </TouchableOpacity>
            <View
              style={{
                ...ifIphoneX(
                  {
                    height: 60,
                  },
                  {height: 26}
                ),
                padding: 4,
                backgroundColor: AppColor.FD.Brand.Solid,
                position: "absolute",
                width,
                bottom: 0,
              }}
            >
              <AppText
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                }}
                labelColorType={ColorType.Light}
              >
                Görüntüyü kaydet
              </AppText>
            </View>
          </View>
        </Portal>
      )}
    </React.Fragment>
  )
}
    </View>
  );
};
export default MediaSelectorPopup;

const {width,height}=Dimensions.get("window");
const styles=StyleSheet.create({
  container: {
    position: "absolute",
    width,
    height,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(0,0,0,.2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});