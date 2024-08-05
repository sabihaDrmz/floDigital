import React, { createContext, useContext, useEffect, useState } from "react";

import linq from "linq";
import createThumbnail from 'react-native-create-thumbnail';

import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

import { Linking, PermissionsAndroid, Platform } from "react-native";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
import RNFetchBlob from 'react-native-blob-util';

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
  const [isPermitted, setIsPermitted] = useState<boolean>(false);
  const MessageBoxShow = useMessageBoxService(state => state.show);

  const [settings, setSettings] = useState<MediaSelectorSettings | undefined>();

  const openMediaLibrary = () => { };

  const openCamera = () => { };

  const getMediaLibraryPreviewData = async (): Promise<any> => {
    try {
      const dirs = RNFetchBlob.fs.dirs;
      const photosPath = Platform.OS === 'android' ? dirs.DCIMDir : dirs.DocumentDir;
      const files = await RNFetchBlob.fs.ls(photosPath);
      const photoFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
      return linq.from(photoFiles).take(10).toArray();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);
  const cameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await check(PERMISSIONS.ANDROID.CAMERA);
        if (result === RESULTS.GRANTED) {
          setIsPermitted(true);
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından kamera yetkisini aktif ediniz!CAMERA', {
            yesButtonEvent: () => {
              Linking.openSettings().then();
            },
          });
          const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
          setIsPermitted(requestResult === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const result = await check(PERMISSIONS.IOS.CAMERA);
        if (result === RESULTS.GRANTED) {
          setIsPermitted(true);
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından kamera yetkisini aktif ediniz!', {
            yesButtonEvent: () => {
              Linking.openSettings().then();
            },
          });
          const requestResult = await request(PERMISSIONS.IOS.CAMERA);
          setIsPermitted(requestResult === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const microphonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (result === RESULTS.GRANTED) {
          setIsPermitted(true);
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından mikrofon yetkisini aktif ediniz!RECORD_AUDIO', {
            yesButtonEvent: () => {
              Linking.openSettings();
            },
          });
          const requestResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          setIsPermitted(requestResult === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const result = await check(PERMISSIONS.IOS.MICROPHONE);
        if (result === RESULTS.GRANTED) {
          setIsPermitted(true);
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından mikrofon yetkisini aktif ediniz!', {
            yesButtonEvent: () => {
              Linking.openSettings();
            },
          });
          const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
          setIsPermitted(requestResult === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const mediaLibPermission = async () => {
   if (Platform.OS === 'ios') {
      try {
        const result = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
        if (result === RESULTS.GRANTED) {
          setIsPermitted(true);
        } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından galeriye erişim iznini aktif ediniz!MEDIA_LIBRARY', {
            yesButtonEvent: () => {
              Linking.openSettings();
            },
          });
          const requestResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
          setIsPermitted(requestResult === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const nearbyPermission = async () => {
    try {
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, {
          title: "Yakındaki cihaz izni",
          message: "Yakındaki Cihazlara izin ver",
          buttonPositive: "Tamam"
        }
      );
      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES, {
          title: "Yakındaki cihaz izni",
          message: "Yakındaki Cihazlara izin ver",
          buttonPositive: "Tamam"
        }
      );
    } catch (error) {
      console.error("Nearby permission error:", error);
    }
  };

  const checkPermission = async () => {
    try {
      console.log('Checking nearby permission');
      await nearbyPermission();
    } catch (err) {
      console.log('Nearby permission error:', err);
    }

    try {
      console.log("Checking microphone permission");
      await microphonePermission();
    } catch (err) {
      console.log('Microphone permission error:', err);
    }

    try {
      console.log("Checking media library permission");
      await mediaLibPermission();
    } catch (err) {
      console.log('Media library permission error:', err);
    }
  };
  const generateThumbnail = async (videoUri: string, time: number) => {
    try {
      const { path } = await createThumbnail({
        url: videoUri,
        timeStamp: time
      });
      return path;
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
    checkPermission,
    mediaLibPermission,
    nearbyPermission,
    microphonePermission,
    cameraPermission,
    isPermitted
  };
  return (
    <MediaSelectorContext.Provider value={contextValue}>
      {children}
    </MediaSelectorContext.Provider>
  );
};
