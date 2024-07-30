// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from "react";
// TODO: EXPO MediaLibrary expo-media-library
//import * as MediaLibrary from "expo-media-library";
import linq from "linq";
// TODO: EXPO VideoThumbnails expo-video-thumbnails  only test

// TODO: EXPO Camera expo-camera ++++  only test
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

import { Linking, Platform } from "react-native";
import { useMessageBoxService } from "../../contexts/MessageBoxService";
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

  const getMediaLibraryPreviewData = async (): Promise<
    any
  > => {
    //TODO: EXPO MediaLibrary !!!!
    //  const assets = await MediaLibrary.getAssetsAsync({ mediaType: "photo" });
    const assets = {assets: []};

    return linq.from(assets.assets).take(10).toArray();
  };

  useEffect(() => {
    const cameraPermission = async () => {
      if (Platform.OS === 'android') {
        check(PERMISSIONS.ANDROID.CAMERA)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından kamera yetkisini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.ANDROID.CAMERA).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (Platform.OS === 'ios') {
        check(PERMISSIONS.IOS.CAMERA)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından kamera yetkisini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.IOS.CAMERA).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
    const microphonePermission = async () => {
      if (Platform.OS === 'android') {
        check(PERMISSIONS.ANDROID.RECORD_AUDIO)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından mikrofon yetkisini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (Platform.OS === 'ios') {
        check(PERMISSIONS.IOS.MICROPHONE)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından mikrofon yetkisini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.IOS.MICROPHONE).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    };

    const mediaLibPermission = async () => {
      if (Platform.OS === 'android') {
        check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından galeriye erişim iznini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });

        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından galeriye erişim iznini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (Platform.OS === 'ios') {
        check(PERMISSIONS.IOS.MEDIA_LIBRARY)
          .then(result => {
            setIsPermitted(RESULTS.GRANTED === result)
            if (RESULTS.DENIED === result || RESULTS.BLOCKED === result) {
              MessageBoxShow('Sayfaya yetkiniz bulunmamaktadır, telefon ayarlarından galeriye erişim iznini aktif ediniz!', {
                yesButtonEvent: () => {
                  Linking.openSettings().then();
                },
              })
              request(PERMISSIONS.IOS.MEDIA_LIBRARY).then((res) => setIsPermitted(RESULTS.GRANTED === result)).catch(error => {
                console.error(error);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
    const checkPermission = async () => {

      try {
        console.log("mic");
        await microphonePermission();
      } catch (err) {
        console.log('mic permission error:',err);
      }

      try {
        await cameraPermission();
      } catch (err) {
        console.log('cam permission error:',err);
      }

      try {
        await mediaLibPermission();
      } catch (err) { }
    };

    checkPermission();
  }, []);

  const generateThumbnail = async (videoUri: string, time: number) => {

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
