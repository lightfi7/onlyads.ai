import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import authService from "../services/authService";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
  SIGN_OUT: "SIGN_OUT",
  SET_USER: "SET_USER",
};

const initialState = {
  isAuthenticated: authService.isAuthenticated(),
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SET_USER]: (state, action) => {
    const user = action.payload;
    return {
      ...state,
      user,
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_UP]: (state) => {
    return state;
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    authService.setAxiosInterceptors({
      onLogout: () => dispatch(signOut()),
    });

    authService.handleAuthentication();

    let isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      try {
        const user = await authService.loginInWithToken();
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const signIn = (email, password, ipAddress, deviceInfo) =>
    new Promise(async (resolve, reject) => {
      try {
        const user = await authService.loginWithEmailAndPassword(
          email,
          password,
          { ipAddress, deviceInfo }
        );
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user,
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });

  const signUp = (
    firstName,
    lastName,
    email,
    password,
    ipAddress,
    deviceInfo
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        await authService.signUp(firstName, lastName, email, password, {
          ipAddress,
          deviceInfo,
        });
        dispatch({
          type: HANDLERS.SIGN_UP,
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });

  const signOut = async () => {
    await authService.logout();
    return dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  const setUser = (user) =>
    dispatch({ type: HANDLERS.SET_USER, payload: user });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setUser,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
