import Cookies from "js-cookie";

import CryptoJS from "crypto-js";

const SECRET_KEY =
  import.meta.env.VITE_SECRET_KEY;

// SET COOKIE
export const setCookie = (
  key,
  value
) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET_KEY
  ).toString();

  Cookies.set(key, encrypted, {
    expires: 7,
    sameSite: "Strict",
    secure: false,
  });
};

// GET COOKIE
export const getCookie = (key) => {
  const data = Cookies.get(key);

  if (!data) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(
      data,
      SECRET_KEY
    );

    return JSON.parse(
      bytes.toString(CryptoJS.enc.Utf8)
    );
  } catch (error) {
    return null;
  }
};

// REMOVE COOKIE
export const removeCookie = (key) => {
  Cookies.remove(key);
};