import { BlurView } from "expo-blur";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Defs, G, Path, TSpan } from "react-native-svg";
import { MessageBoxType } from "../../core/services/MessageBox";
import MessageBoxNew from "../../core/services/MessageBoxNew";
import { PerfectFontSize } from "../../helper/PerfectPixel";
import ErNotComplete from "./MessageBoxs/ErNotComplete";
import ErNotValidStatus from "./MessageBoxs/ErNotValidStatus";
import ErOrderNotFound from "./MessageBoxs/ErOrderNotFound";
import ErQty from "./MessageBoxs/ErQty";
import ErSuccess from "./MessageBoxs/ErSuccess";
import ErVirement from "./MessageBoxs/ErVirement";
import MbStandart from "./MessageBoxs/MbStandart";
import MbYesNo from "./MessageBoxs/MbYesNo";
// import {BlurView} from 'expo-blur';
// import MbStandart from './MessageBoxs/MbStandart';

const { width, height } = Dimensions.get("window");
@observer
class MessageboxNewModal extends Component {
  state = { validateSmsCode: "" };
  render() {
    if (MessageBoxNew.isShow)
      return (
        <BlurView
          style={{
            position: "absolute",
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {MessageBoxNew.options &&
            MessageBoxNew.options.type !== undefined &&
            MessageBoxNew.options.type === MessageBoxType.Standart && (
              <MbStandart
                options={MessageBoxNew.options}
                message={MessageBoxNew.message}
              />
            )}
          {MessageBoxNew.options &&
            MessageBoxNew.options.type !== undefined &&
            MessageBoxNew.options.type === MessageBoxType.YesNo && (
              <MbYesNo
                options={MessageBoxNew.options}
                message={MessageBoxNew.message}
              />
            )}
          {MessageBoxNew.options &&
            MessageBoxNew.options.type !== undefined &&
            MessageBoxNew.options.type === MessageBoxType.OrderNotFound && (
              <View>
                {(MessageBoxNew.options?.customParameters?.type === undefined ||
                  MessageBoxNew.options?.customParameters?.type === "1") && (
                  <ErOrderNotFound />
                )}
                {MessageBoxNew.options?.customParameters?.type !== undefined &&
                  MessageBoxNew.options?.customParameters?.type === "2" && (
                    <ErVirement />
                  )}
                {MessageBoxNew.options?.customParameters?.type !== undefined &&
                  MessageBoxNew.options?.customParameters?.type === "3" && (
                    <ErNotValidStatus />
                  )}
                {MessageBoxNew.options?.customParameters?.type !== undefined &&
                  MessageBoxNew.options?.customParameters?.type === "4" && (
                    <ErQty />
                  )}
                {MessageBoxNew.options?.customParameters?.type !== undefined &&
                  MessageBoxNew.options?.customParameters?.type === "10" && (
                    <ErNotComplete />
                  )}
                {MessageBoxNew.options?.customParameters?.type !== undefined &&
                  MessageBoxNew.options?.customParameters?.type === "11" && (
                    <ErSuccess />
                  )}
              </View>
            )}
          {/* Eğer messagebox ayarı yapılmadıysa */}
          {(MessageBoxNew.options === undefined ||
            MessageBoxNew.options.type === undefined) && (
            <MbStandart
              options={MessageBoxNew.options}
              message={MessageBoxNew.message}
            />
          )}
        </BlurView>
      );

    return null;
  }
}
export default MessageboxNewModal;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  card: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
  },
  description: {
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.3,
    fontSize: PerfectFontSize(15),
    marginTop: 9,
    textAlign: "center",
  },
});

const OmsCompleteIcon: React.FC = (props) => {
  return (
    <Svg width={39.104} height={48}>
      <Defs></Defs>
      <G
        id="Group_3037"
        data-name="Group 3037"
        transform="translate(2527.949 -609.543)"
      >
        <Path
          id="Path_2178"
          data-name="Path 2178"
          className="cls-1"
          d="M-2527.945 753.6v-16.286a3.016 3.016 0 0 1 1.275-2.525 1.485 1.485 0 0 1 .924-.306c1.737.009 3.474 0 5.211 0 .235 0 .223 0 .2.236a3.424 3.424 0 0 0 .711 2.6 3.287 3.287 0 0 0 2.66 1.274c2.976.011 5.952.019 8.929 0a3.273 3.273 0 0 0 3.061-1.952 3.286 3.286 0 0 0 .274-1.96c-.023-.167.028-.2.176-.2 1.424 0 2.849-.017 4.273.012a3.434 3.434 0 0 1 2.475.98 2.435 2.435 0 0 1 .712 1.742 199.75 199.75 0 0 1-.007 5.307c-.009.477.035.952 0 1.431-.022.292.013.6.013.9v12.8c.013.151-.052.2-.2.192-.21-.014-.421-.007-.632-.01a9.547 9.547 0 0 0-2.382.3c-.266.064-.267.067-.267-.2v-15.597c0-.251 0-.252-.252-.252h-19.115c-.345 0-.689.01-1.034.009q-1.644 0-3.289-.009c-.247 0-.247 0-.247.253v24.449c0 .8.007 1.609 0 2.413 0 .194.049.244.244.244q7.635-.008 15.271 0c.291 0 .286 0 .311.282a10.506 10.506 0 0 0 .676 2.947c.085.217.074.237-.16.237h-9.293c-2.567 0-5.134-.009-7.7 0a2.842 2.842 0 0 1-2.71-2.015 3.186 3.186 0 0 1-.1-.85v-9.714q-.006-3.366-.008-6.732z"
          transform="translate(0 -120.152)"
        />
        <Path
          id="Path_2179"
          data-name="Path 2179"
          className="cls-1"
          d="M-1964.767 1413.824a8.934 8.934 0 0 1-8.9-8.932 8.932 8.932 0 0 1 8.983-8.93 8.94 8.94 0 0 1 8.879 8.979 8.934 8.934 0 0 1-8.962 8.883zm-.685-4.177a1.252 1.252 0 0 0 1.042-.448q1.812-2.039 3.626-4.075c.638-.718 1.291-1.423 1.9-2.164a1.176 1.176 0 0 0 .133-1.41 1.329 1.329 0 0 0-2.21-.275c-.609.667-1.2 1.347-1.8 2.02-.889 1-1.782 1.989-2.661 2.993-.129.147-.195.16-.343.038-.668-.548-1.349-1.081-2.017-1.628a1.638 1.638 0 0 0-1.1-.464 1.3 1.3 0 0 0-1.267 1.005 1.294 1.294 0 0 0 .489 1.412q.471.372.938.748l2.409 1.934a1.246 1.246 0 0 0 .86.314z"
          transform="translate(-533.036 -756.281)"
        />
        <Path
          id="Path_2180"
          data-name="Path 2180"
          className="cls-1"
          d="M-2289.063 617.1h-3.561c-.3 0-.6 0-.9.013a2.045 2.045 0 0 1-1.944-1.394 2.08 2.08 0 0 1 1.364-2.662 2.358 2.358 0 0 1 .677-.1c.319 0 .639-.015.958 0a1 1 0 0 0 1-.966 2.337 2.337 0 0 1 .56-1.587 2.354 2.354 0 0 1 2.421-.8 2.32 2.32 0 0 1 1.649 1.321 2.209 2.209 0 0 1 .208.962 1.042 1.042 0 0 0 .39.856.956.956 0 0 0 .579.213 8.506 8.506 0 0 1 1.491.043 2.071 2.071 0 0 1 1.572 2.648 2.052 2.052 0 0 1-1.543 1.432 1.854 1.854 0 0 1-.477.029h-4.445zm.028-4.142a1.006 1.006 0 0 0 1-1 1 1 0 0 0-1.015-.99.982.982 0 0 0-.985.995.984.984 0 0 0 1 .998z"
          transform="translate(-223.467)"
        />
        <Path
          id="Path_2181"
          data-name="Path 2181"
          className="cls-1"
          d="M-2199.891 1020.5c1.782 0 3.563.011 5.345-.007a.778.778 0 0 1 .841.838c-.01.178 0 .358 0 .536a.735.735 0 0 1-.762.741h-10.881a.719.719 0 0 1-.743-.732c-.005-.2 0-.4 0-.594a.713.713 0 0 1 .783-.782h5.417z"
          transform="translate(-309.518 -395.201)"
        />
        <Path
          id="Path_2182"
          data-name="Path 2182"
          className="cls-1"
          d="M-2199.969 1183.712c-1.794 0-3.588-.012-5.382.008a.743.743 0 0 1-.8-.806c.014-.2 0-.409.007-.613a.69.69 0 0 1 .71-.677h10.956a.705.705 0 0 1 .714.7c.011.229.011.46 0 .689a.7.7 0 0 1-.729.7q-2.193.005-4.386.006h-1.09z"
          transform="translate(-309.464 -550.155)"
        />
        <Path
          id="Path_2183"
          data-name="Path 2183"
          className="cls-1"
          d="M-2201.609 1326.222h-3.657a.749.749 0 0 1-.747-.456.669.669 0 0 1-.048-.28v-.574a.746.746 0 0 1 .823-.814h7.276a.787.787 0 0 1 .78.413.616.616 0 0 1 .073.293v.632a.725.725 0 0 1-.783.789h-3.714z"
          transform="translate(-309.55 -687.17)"
        />
        <Path
          id="Path_2184"
          data-name="Path 2184"
          className="cls-1"
          d="M-2202.395 1485.314c1 0 1.993.011 2.989 0a.733.733 0 0 1 .794.791 2.988 2.988 0 0 0 0 .555.734.734 0 0 1-.781.774H-2202c-1.1 0-2.21-.007-3.314 0a.782.782 0 0 1-.878-.88c.013-.165 0-.332 0-.5a.706.706 0 0 1 .747-.739h2.548z"
          transform="translate(-309.424 -842.203)"
        />
        <Path
          id="Path_2185"
          data-name="Path 2185"
          className="cls-1"
          d="M-2375.284 982.213c.245-.045.41.161.6.3.248.188.485.39.725.588.093.077.159.088.253-.018q.962-1.1 1.938-2.18a.64.64 0 0 1 .879-.192.615.615 0 0 1 .186.948c-.4.482-.829.947-1.245 1.419s-.812.912-1.215 1.371a.666.666 0 0 1-1.057.1q-.747-.592-1.491-1.187a.642.642 0 0 1-.209-.769.64.64 0 0 1 .636-.38z"
          transform="translate(-146.154 -356.849)"
        />
        <Path
          id="Path_2186"
          data-name="Path 2186"
          className="cls-1"
          d="M-2373.867 1296.234a.762.762 0 0 1-.5-.223c-.477-.379-.951-.763-1.427-1.144a.658.658 0 0 1-.283-.611.656.656 0 0 1 .493-.571.6.6 0 0 1 .556.12c.333.255.66.517.982.785.1.081.145.071.228-.024.649-.741 1.305-1.476 1.958-2.213a.722.722 0 0 1 .779-.217.689.689 0 0 1 .413.632.709.709 0 0 1-.2.444q-1.229 1.382-2.459 2.762a.673.673 0 0 1-.54.26z"
          transform="translate(-146.046 -656.396)"
        />
        <Path
          id="Path_2187"
          data-name="Path 2187"
          className="cls-1"
          d="M-2375.288 1141.187a.545.545 0 0 1 .411.155c.327.272.679.514.987.81.053.051.086.071.135 0 .366-.5.813-.94 1.219-1.409.279-.322.561-.641.854-.95a.615.615 0 0 1 .891-.042.612.612 0 0 1 .078.888c-.554.647-1.125 1.28-1.689 1.918-.253.286-.509.568-.76.855a.664.664 0 0 1-1.069.1q-.75-.588-1.492-1.186a.641.641 0 0 1-.2-.771.637.637 0 0 1 .635-.368z"
          transform="translate(-146.151 -509.727)"
        />
        <Path
          id="Path_2188"
          data-name="Path 2188"
          className="cls-1"
          d="M-2370.629 1445.729a.722.722 0 0 1-.211.477l-1.991 2.235-.442.5a.654.654 0 0 1-.993.09c-.309-.244-.608-.5-.916-.747-.188-.151-.384-.292-.573-.44a.645.645 0 0 1-.283-.611.66.66 0 0 1 .493-.569.587.587 0 0 1 .554.122c.334.253.661.515.984.782.1.082.165.073.237-.02.309-.4.661-.754.992-1.13.357-.405.712-.812 1.086-1.2a.59.59 0 0 1 .664-.091.653.653 0 0 1 .399.602z"
          transform="translate(-146.083 -803.505)"
        />
      </G>
    </Svg>
  );
};

const NotFoundIcon: React.FC = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={72} height={83} {...props}>
      <Defs></Defs>
      <G id="siparisbulunamad\u0131error" transform="translate(-159 -285)">
        <G id="Group_4462" data-name="Group 4462">
          <G
            id="Ellipse_262"
            data-name="Ellipse 262"
            transform="translate(159 296)"
            style={{
              stroke: "#ff2424",
              fill: "none",
            }}
          >
            <Circle
              cx={36}
              cy={36}
              r={36}
              style={{
                stroke: "none",
              }}
            />
            <Circle
              cx={36}
              cy={36}
              r={35.5}
              style={{
                fill: "none",
              }}
            />
          </G>
          <Path
            id="Path_4326"
            data-name="Path 4326"
            className="cls-2"
            d="M-832.881-6.885c-2.081-1.147-4.164-2.29-6.239-3.446a.858.858 0 0 0-.932-.014c-1.444.787-2.9 1.543-4.36 2.309-.293.154-.588.3-.877.451a10.933 10.933 0 0 0-12.146-4.227 10.466 10.466 0 0 0-7.612 9.371c-.326 5.734 2.577 9.458 7.869 11.489l-.554 2.546c-.662-.14-1.283-.281-1.909-.4-.578-.109-.85.067-.96.62-.584 2.927-1.173 5.853-1.739 8.784a3.437 3.437 0 0 0 2.116 3.923c.227.084.462.145.694.217h1.19a.716.716 0 0 1 .151-.086 3.359 3.359 0 0 0 2.536-2.715c.222-1.043.438-2.086.656-3.13.377-1.8.756-3.607 1.127-5.412.142-.691-.043-.971-.709-1.119l-1.793-.4.558-2.609.776.1c0 .407.016.787 0 1.166a.977.977 0 0 0 .528.969q7.084 4.447 14.143 8.935a1.259 1.259 0 0 0 1.46.041q6.985-3.747 14-7.444a1.055 1.055 0 0 0 .628-1.053c-.015-3.05-.1-11.192-.16-14.241m-8.241-4.942 1.137 2.642 5 2.667L-829.32-.2a.893.893 0 0 1-1.166.107c-4.051-2.238-8.12-4.445-12.182-6.662-.172-.094-.342-.194-.563-.321 1.186-.629 2.324-1.239 3.471-1.831a.486.486 0 0 1 .375.057q3.871 2.107 7.734 4.232m-10.879-.443q5.689 3.109 11.381 6.213a.649.649 0 0 1 .4.67c-.022 1.082.006 2.164-.022 3.246a.747.747 0 0 1-.3.525c-.561.358-1.153.666-1.816 1.04 0-1.194-.029-2.292.012-3.386a1.077 1.077 0 0 0-.66-1.116c-3.219-1.725-6.425-3.475-9.644-5.2a1 1 0 0 1-.524-.718c-.2-.757-.465-1.5-.72-2.3.648.351 1.271.687 1.892 1.025zm-12.787 18.58-1.143 5.54c-.182.88-.351 1.762-.548 2.638a2.034 2.034 0 0 1-1.97 1.661 1.924 1.924 0 0 1-1.943-1.431 2.582 2.582 0 0 1-.045-1.126c.528-2.658 1.088-5.309 1.639-7.963a.816.816 0 0 1 .083-.157zm-8.353-14.986a9.327 9.327 0 0 1 9.335-9.38 9.648 9.648 0 0 1 9.58 9.5 9.333 9.333 0 0 1-9.316 9.409 9.65 9.65 0 0 1-9.6-9.53zm23.34 19.934a1.835 1.835 0 0 1-.035.212c-.619-.385-1.186-.736-1.752-1.089l-11.053-6.89a1.077 1.077 0 0 1-.348-1.184.363.363 0 0 1 .255-.136 10.457 10.457 0 0 0 8.315-5.185c.015-.024.047-.037.11-.086.2.113.425.236.646.36 1.182.664 2.368 1.319 3.54 2a.674.674 0 0 1 .309.471c.017 3.84.013 7.683.012 11.526zm.533-13.153c-1.475-.818-2.938-1.66-4.308-2.441l.859-4.4 8.194 4.445c-.131.09-.218.162-.317.216-1.312.708-2.623 1.418-3.943 2.113a.622.622 0 0 1-.488.066zm14.148-1.438v7.467c0 .237-.012.421-.273.558q-6.385 3.363-12.759 6.746a2 2 0 0 1-.246.08v-.511c0-3.7.006-7.41-.009-11.115a.675.675 0 0 1 .423-.7c1.28-.674 2.544-1.378 3.814-2.069.129-.07.263-.129.462-.226 0 1.071.048 2.076-.013 3.074-.067 1.11.392 1.751 1.62.939a27.615 27.615 0 0 1 2.668-1.5 1.2 1.2 0 0 0 .715-1.243c-.033-1.143-.009-2.287-.01-3.43a1.868 1.868 0 0 1 1.14-1.739L-825.648-1"
            transform="translate(1040.072 329.283)"
          />
        </G>
        <G id="Group_4463" data-name="Group 4463">
          <Circle
            id="Ellipse_261"
            data-name="Ellipse 261"
            className="cls-2"
            cx={15}
            cy={15}
            r={15}
            transform="translate(200 287)"
          />
          <Text
            id="x"
            transform="translate(210 309)"
            style={{
              fill: "#fff",
              fontSize: 23,
            }}
          >
            <TSpan x={0} y={0}>
              {"x"}
            </TSpan>
          </Text>
        </G>
      </G>
    </Svg>
  );
};
