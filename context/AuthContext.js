// https://medium.com/swlh/react-native-authentication-with-context-api-global-state-management-db8d3bf4e3f9
import createDataContext from './createDataContext';
import { bookingApi } from "../api/bookingApi";
import { Alert } from "react-native";


const authReducer = (state, action) => {
  switch (action.type) {
    case 'logout':
      return {token: null, username: ''};
    case 'login':
    case 'createuser':
      return {
        // token: action.payload.token,
        password: action.payload.password,
        email: '',
        username: action.payload.username,
      };
    default:
      return state;
  }
};

const createuser = dispatch => {
  return ({username, password}) => {
    try {
      console.log(username, password);
      const response = bookingApi.post("/users", {
          name: username,
          email: username + "@bookie.com",
          password: password,
        }
      );
      console.log("posting");
      console.log(response);
    } catch (error) {
      Alert.alert("Error! Access denied!");
      console.log(error);
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "Unauthorized",
          "Please check your authentication credentials."
        );
      } else {
        setError(error.message);
      }
    } finally {
      
    }
    console.log('createuser');
  };
};

const login = dispatch => {
  return ({username, password}) => {
    // Do some API Request here
    console.log('login');
    dispatch({
      type: 'login',
      payload: {
        // token: 'some access token here',
        username,
        password,
      },
    });
  };
};

const logout = dispatch => {
  return () => {
    dispatch({type: 'logout'});
  };
};




export const {Provider, Context} = createDataContext(
  authReducer,
  {login, logout, createuser},
  {token: null, username: ''},
);