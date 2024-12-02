import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percemtage) => {
  return (percemtage * deviceHeight) / 100;
};

export const wp = (percemtage) => {
  return (percemtage * deviceWidth) / 100;
};

export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>?/gm, "");
};
