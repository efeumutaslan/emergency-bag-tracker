// frontend/src/context/AuthContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import AuthService from '../services/authService';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = AuthService.getCurrentUser();
        
        if (user) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: user
          });
        } else {
          dispatch({
            type: 'AUTH_ERROR'
          });
        }
      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: error.message
        });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const user = await AuthService.login(email, password);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: user
      });
      
      return user;
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response ? error.response.data.message : error.message
      });
      throw error;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      return await AuthService.register(userData);
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response ? error.response.data.message : error.message
      });
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    AuthService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Update user
  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        updateUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};