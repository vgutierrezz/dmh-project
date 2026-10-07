import React, { createContext, useEffect, useReducer } from 'react';
import userReducer from './userReducer';
import { User } from '../../types';
import { useAuth, useLocalStorage } from '../../hooks';
import { getUser, parseJwt } from '../../utils';
import { userActionTypes } from './types';
import { UNAUTHORIZED } from '../../constants/status';
export interface UserInfoState {
  user: User | null;
  loading: boolean;
}

const initialState : UserInfoState = {
  user: null,
  loading: true,
};

export const userInfoContext = createContext<{
  user: User | null;
  loading: boolean;
  dispatch: React.Dispatch<any>;
}>({
  ...initialState,
  dispatch: () => null,
});

const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [token, setToken] = useLocalStorage('token');

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const localStorageToken = window.localStorage.getItem('token');
      const normalizedStorageToken =
        typeof localStorageToken === 'string'
          ? localStorageToken.replace(/^"(.*)"$/, '$1')
          : null;
      const authToken =
        typeof normalizedStorageToken === 'string' && normalizedStorageToken
          ? normalizedStorageToken
          : token;

      if (authToken && typeof authToken === 'string') {
        const info = parseJwt(authToken);
        const userId = info && info.sub;
        if (!userId) {
          setToken(null);
          setIsAuthenticated(false);
          return;
        }

        getUser(userId)
          .then((res) => {
            dispatch({ type: userActionTypes.SET_USER, payload: res });
            dispatch({
              type: userActionTypes.SET_USER_LOADING,
              payload: false,
            });
          })
          .catch((error) => {
            if (error.status === UNAUTHORIZED) {
              setToken(null);
              setIsAuthenticated(false);
            }
            // eslint-disable-next-line no-console
            console.log(error);
          });
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [dispatch, isAuthenticated, setIsAuthenticated, setToken, token]);

  return (
    <userInfoContext.Provider
      value={{ user: state.user, loading: state.loading, dispatch }}
    >
      {children}
    </userInfoContext.Provider>
  );
};

export default UserInfoProvider;
