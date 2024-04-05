import { jwtDecode } from "jwt-decode";
import axios from "./axios";

class AuthService {
  setAxiosInterceptors = ({ onLogout }) => {
    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getAccessToken();
        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.setSession(null);
          if (onLogout) {
            onLogout();
          }
        }

        return Promise.reject(error);
      }
    );
  };

  handleAuthentication() {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return;
    }

    if (this.isValidToken(accessToken)) {
      this.setSession(accessToken);
    } else {
      this.setSession(null);
    }
  }

  loginWithEmailAndPassword = (email, password, others) =>
    new Promise((resolve, reject) => {
      const { ipAddress, deviceInfo } = others;
      axios
        .post("/api/login", { email, password, ipAddress, deviceInfo })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.accessToken);
            if (response.data.user.role == "admin")
              reject("You are not authorized to perform this action");
            resolve(response.data.user);
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject(error.response?.data);
        });
    });

  loginInWithToken = () =>
    new Promise((resolve, reject) => {
      axios
        .post("/api/me", { accessToken: this.getAccessToken() })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.accessToken);
            resolve(response.data.user);
          } else {
            this.setSession(null);
            reject();
          }
        })
        .catch((error) => {
          this.setSession(null);
          reject(error.response?.data);
        });
    });

  signUp = (firstName, lastName, email, password, others) =>
    new Promise((resolve, reject) => {
      const { ipAddress, deviceInfo } = others;
      axios
        .post("/api/register", {
          userName: firstName + " " + lastName,
          email,
          password,
          ipAddress,
          deviceInfo,
        })
        .then((response) => {
          if (response.data.user) {
            resolve(response.data.user);
          } else {
            reject();
          }
        })
        .catch((error) => {
          reject(error.response?.data);
        });
    });

  forgotPassword = (email) =>
    new Promise((resolve, reject) => {
      axios
        .post("/api/forgot-password", {
          email,
        })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });

  resetPassword = (id, token, password) =>
    new Promise((resolve, reject) => {
      axios
        .post("/api/reset-password", {
          id,
          token,
          password,
        })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });

  logout = () => {
    this.setSession(null);
  };

  setSession = (accessToken) => {
    if (accessToken) {
      window.localStorage.setItem("#accessToken", accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      window.localStorage.removeItem("#accessToken");
      delete axios.defaults.headers.common.Authorization;
    }
  };

  getAccessToken = () => window.localStorage.getItem("#accessToken");

  isValidToken = (accessToken) => {
    if (!accessToken) {
      return false;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  };

  isAuthenticated = () => this.getAccessToken() != null;
}

const authService = new AuthService();

export default authService;
