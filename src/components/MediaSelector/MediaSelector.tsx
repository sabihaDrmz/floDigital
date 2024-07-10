// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from "react";
// TODO: EXPO MediaLibrary
//import * as MediaLibrary from "expo-media-library";
import linq from "linq";
// TODO: EXPO VideoThumbnails
//import * as VideoThumbnails from "expo-video-thumbnails";
// TODO: EXPO Camera
//import { Camera } from "expo-camera";
import { PermissionsAndroid, Platform } from "react-native";
type MediaSelectorProviderProps = {};

type MediaType = "video" | "picture";

export type Media = {
  MediaType: MediaType;
  Url: string;
  Thumb?: string;
  Height?: any;
  Width?: any;
};

type MediaSelectorSettings = {
  removeEnable?: boolean;
};

type MediaSelector = {
  isShow: boolean;
  medias: Media[];
  settings?: MediaSelectorSettings;
  openMediaLibrary: () => void;
  openCamera: () => void;
  setIsShowData: (visiblity: boolean) => void;
  // TODO: EXPO MediaLibrary
  // getMediaLibraryPreviewData: () => Promise<MediaLibrary.Asset[]>;
  getMediaLibraryPreviewData: () => Promise<any>;
  onAssetSelect: (media: Media) => void;
  removeMedia: (media: Media) => void;
  setMediasData: (medias: Media[]) => void;
};

const MediaSelectorContext = createContext({} as MediaSelector);

export const useMediaSelector = () => useContext(MediaSelectorContext);

export const MediaSelectorProvider: React.FC<any> = ({ children }: any) => {
  const [isShow, setIsShow] = useState(false);
  const [medias, setMedias] = useState<Media[]>([]);

  const [settings, setSettings] = useState<MediaSelectorSettings | undefined>();

  const openMediaLibrary = () => { };

  const openCamera = () => { };

  const getMediaLibraryPreviewData = async (): Promise<
    any
  > => {
    //  const assets = await MediaLibrary.getAssetsAsync({ mediaType: "photo" });
    const assets = {assets: []};

    return linq.from(assets.assets).take(10).toArray();
  };

  useEffect(() => {
    const cameraPermission = async () => {
      const permission = {}//await Camera.getCameraPermissionsAsync();

      console.log(permission);

      if (!permission?.granted) {
        if (Platform.OS === "android" || permission?.canAskAgain) {
          const last = {} // await Camera.requestCameraPermissionsAsync();
        }
      }
    };
    const microphonePermission = async () => {
      console.log('microphonePermission:')
      const permission = {}//await Camera.getMicrophonePermissionsAsync();
      console.log('permission:', permission)
      if (!permission?.granted) {
        if (Platform.OS === "android" || permission?.canAskAgain) {
          const last = {}//await Camera.requestMicrophonePermissionsAsync();
        }
      }
    };

    const mediaLibPermission = async () => {
      const permission ={granted:true}// await MediaLibrary.getPermissionsAsync();
      if (!permission?.granted) {
        if (Platform.OS === "android" || permission?.canAskAgain) {
         // const last = await MediaLibrary.requestPermissionsAsync();
        }
      }
    };

    const nearbyPermission = async () => {
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, {
        title: "Yakındaki cihaz izni",
        message: "Yakındaki Cihazlara izin ver",
        buttonPositive: "Tamam"
      }
      );
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES, {
        title: "Yakındaki cihaz izni",
        message: "Yakındaki Cihazlara izin ver",
        buttonPositive: "Tamam"
      }
      );
    }

    const checkPermission = async () => {
      try {
        await nearbyPermission();
      } catch (err) { }
      try {
        console.log("mic");
        await microphonePermission();
      } catch (err) {
        console.log(err);
      }

      try {
        await cameraPermission();
      } catch (err) {
        console.log(err);
      }

      try {
        await mediaLibPermission();
      } catch (err) { }
    };

    checkPermission();
  }, []);

  const generateThumbnail = async (videoUri: string, time: number) => {
    try {
     /* TODO: EXPO VideoThumbnails
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time,
      });
     */
      return '';
    } catch (e) {
      console.warn(e);
    }
  };

  const onAssetSelect = async (media: Media) => {
    if (media.MediaType === "picture") {
      setMedias((m) => {
        if (m.find((x) => x.Url === media.Url)) {
          return m;
        }

        media.Thumb = media.Url;
        return [...m, media];
      });
    } else {
      const thumb = await generateThumbnail(media.Url, 1);
      setMedias((m) => {
        if (m.find((x) => x.Url === media.Url)) {
          return m;
        }

        media.Thumb = thumb;
        return [...m, media];
      });
    }

    setIsShow(false);
  };

  const removeMedia = (media: Media) => {
    setMedias((m) => {
      return m.filter((x) => x.Url !== media.Url);
    });
  };

  const setIsShowData = (visiblity: boolean) => {
    setIsShow(visiblity);
  };

  const setMediasData = (medias: Media[]) => {
    setMedias(medias);
  };

  const contextValue: MediaSelector = {
    isShow,
    medias,
    settings,
    openMediaLibrary,
    openCamera,
    setIsShowData,
    getMediaLibraryPreviewData,
    onAssetSelect,
    removeMedia,
    setMediasData,
  };
  return (
    <MediaSelectorContext.Provider value={contextValue}>
      {children}
    </MediaSelectorContext.Provider>
  );
};
