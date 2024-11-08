import {removeCookie} from "./cookie";

export const userLogout = () => {
  removeCookie("accessToken", {path: "/"});
  removeCookie("refreshToken", {path: "/"});
  localStorage.removeItem("accessToken");
};
