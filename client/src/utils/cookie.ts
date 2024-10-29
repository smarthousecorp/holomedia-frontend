import {Cookies} from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: any) => {
  cookies.set(name, value, {...options});
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const removeCookie = (name: string, options?: any) => {
  cookies.remove(name, {...options});
};
