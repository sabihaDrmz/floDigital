import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import Svg, { Defs, G, Path } from "react-native-svg";
import {
  AppColor,
  AppText,
  ColorType,
} from "@flomagazacilik/flo-digital-components";
import { FontAwesome5 } from "../../components";
import { Product } from "../../core/models/ReturnedProduct/ErFindFicheResult";
import AppCardColorizeSVG from "../../components/AppColorizeSvg";

interface ProductCardProps extends Product {
  showCombo?: boolean;
  selectedCombo?: string;
  onOpenCombo?: () => void;
  selQuantity?: number;
  onOpenQuantity?: () => void;
}

const MenuIcon: React.FC = (props) => {
    return (
      <Svg
        //@ts-ignore xmlns error
        xmlns="http://www.w3.org/2000/svg"
        width={21.939}
        height={17.843}
        {...props}
      >
        <Defs></Defs>
        <G id="ru7Gjk.tif" transform="translate(-429.179 -194.054)">
          <G
            id="Group_3140"
            data-name="Group 3140"
            transform="translate(429.179 194.054)"
          >
            <Path
              id="Path_2205"
              data-name="Path 2205"
              //@ts-ignore classname error
              className="cls-1"
              d="M603.79 227.664a1.418 1.418 0 0 1-1.073 1.055 1.322 1.322 0 0 1-.3.029h-12.333a1.377 1.377 0 0 1-1.19-2.1 1.282 1.282 0 0 1 1.148-.67q6.209-.005 12.419 0a1.388 1.388 0 0 1 1.326 1.083z"
              transform="translate(-581.851 -224.61)"
            />
            <Path
              id="Path_2206"
              data-name="Path 2206"
              //@ts-ignore classname error
              className="cls-1"
              d="M603.789 387.352a1.418 1.418 0 0 1-1.073 1.055 1.324 1.324 0 0 1-.3.029h-12.333a1.377 1.377 0 0 1-1.19-2.1 1.282 1.282 0 0 1 1.148-.67q6.209-.005 12.419 0a1.388 1.388 0 0 1 1.326 1.083z"
              transform="translate(-581.85 -377.446)"
            />
            <Path
              id="Path_2207"
              data-name="Path 2207"
              //@ts-ignore classname error
              className="cls-1"
              d="M603.789 547.04a1.418 1.418 0 0 1-1.073 1.055 1.328 1.328 0 0 1-.3.029h-12.333a1.377 1.377 0 0 1-1.19-2.1 1.282 1.282 0 0 1 1.148-.67q6.209-.005 12.419 0a1.388 1.388 0 0 1 1.326 1.083z"
              transform="translate(-581.85 -530.283)"
            />
            <Path
              id="Path_2208"
              data-name="Path 2208"
              //@ts-ignore classname error
              className="cls-1"
              d="M431.244 198.192a2.069 2.069 0 1 1 2.073-2.055 2.049 2.049 0 0 1-2.073 2.055z"
              transform="translate(-429.179 -194.054)"
            />
            <Path
              id="Path_2209"
              data-name="Path 2209"
              //@ts-ignore classname error
              className="cls-2"
              d="M431.268 353.742a2.069 2.069 0 1 1-2.088 2.04 2.049 2.049 0 0 1 2.088-2.04z"
              transform="translate(-429.18 -346.89)"
            />
            <Path
              id="Path_2210"
              data-name="Path 2210"
              //@ts-ignore classname error
              className="cls-2"
              d="M429.179 515.5a2.069 2.069 0 1 1 2.056 2.071 2.05 2.05 0 0 1-2.056-2.071z"
              transform="translate(-429.179 -499.726)"
            />
          </G>
        </G>
      </Svg>
    );
  },
  ProductCard: React.FC<ProductCardProps> = (props) => {
    return (
      <TouchableOpacity style={styles.container}>
        <View style={{ position: "absolute" }}>
          <AppCardColorizeSVG color={AppColor.OMS.Background.OpacityOrange} />
        </View>
        <View style={{ flexDirection: "row", marginLeft: 30 }}>
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: AppColor.OMS.Background.Success,
              borderRadius: 4,
              marginVertical: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome5 name={"check"} size={20} color={"white"} />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 30 }}>
          <Image
            source={{ uri: props.picture }}
            style={{ width: 60, height: 60 }}
          />
          <View>
            <AppText selectable style={styles.medium}>
              {props.productName}
            </AppText>
            <View>
              <AppText selectable>
                Beden : {props.size} | Adet : {props.quantity}
              </AppText>
              <AppText selectable>
                {props.barcode} / {props.sku}
              </AppText>
              <AppText
                selectable
                labelColorType={ColorType.Brand}
                style={styles.medium}
              >
                Satış Fiyatı : {Number(props.price).toFixed(2)}
              </AppText>
            </View>
          </View>
        </View>
        {props.showCombo && (
          <>
            <TouchableOpacity
              onPress={props.onOpenCombo}
              style={{
                height: 50,
                borderWidth: 1,
                marginHorizontal: 30,
                marginTop: 20,
                borderRadius: 5,
                borderColor: "#c1bdbd",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 20,
              }}
            >
              <AppText selectable>{props.selectedCombo || "-"}</AppText>
              <View
                style={{
                  backgroundColor: "#919191",
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0.7,
                }}
              >
                <MenuIcon />
              </View>
            </TouchableOpacity>
            {Number(props.quantity) > 0 && (
              <TouchableOpacity
                onPress={props.onOpenQuantity}
                style={{
                  height: 50,
                  borderWidth: 1,
                  marginHorizontal: 30,
                  marginTop: 20,
                  borderRadius: 5,
                  borderColor: "#c1bdbd",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 20,
                }}
              >
                <AppText selectable>{props.selQuantity || "-"}</AppText>
                <View
                  style={{
                    backgroundColor: "#919191",
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.7,
                  }}
                >
                  <MenuIcon />
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    minHeight: 100,
    paddingBottom: 20,
  },
  medium: {
    fontFamily: "Poppins_500Medium",
  },
});
