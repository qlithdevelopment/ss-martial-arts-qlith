import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";

import {
  setCookie,
  getCookie,
  removeCookie,
} from "../utils/cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (formData) => {
    const response = await axios.post(
      "/login",
      formData
    );

    const token = response.data.access_token;

    const userData = response.data.user;

    setCookie("token", token);

    setCookie("user", userData);

    setUser(userData);

    return userData;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch (error) {}

    removeCookie("token");

    removeCookie("user");

    setUser(null);
  };

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const token = getCookie("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("/me");

      setUser(response.data);
    } catch (error) {
      removeCookie("token");

      removeCookie("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};