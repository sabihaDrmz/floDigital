import { useApplicationGlobalService } from "../contexts/ApplicationGlobalService";
import React from "react";
import { ImageProps, Image, TouchableOpacity } from "react-native";

const FsImage: React.FC<ImageProps> = (props) => {
  const ApplicationGlobalService = useApplicationGlobalService();
  return (
    <TouchableOpacity
      onPress={() =>
        //@ts-ignore
        ApplicationGlobalService.showFullScreenImage(props.source?.uri)
      }
    >
      <Image {...props} />
    </TouchableOpacity>
  );
};
export default FsImage;
