// https://medium.com/swlh/react-native-authentication-with-context-api-global-state-management-db8d3bf4e3f9
import createDataContext from './createDataContext';
import { bookingApi } from "../api/bookingApi";
import { Alert } from "react-native";
import base64 from "react-native-base64";

const uid = 0;

const authReducer = (state, action) => {
  switch (action.type) {
    case 'logout':
      return {token: null, username: ''};
    case 'login':
    case 'createuser':
      return {
        // token: action.payload.token,
        password: action.payload.password,
        username: action.payload.username,
      };
    default:
      return state;
  }
};

const createuser = dispatch => {
  return async ({username, password}) => {
    try {
      console.log(username, password);
      const response = await bookingApi.post("/users", {
          name: username,
          email: username + "@bookie.com",
          password: password,
        }
      );
      console.log("posting");
      console.log(response);
      Alert.alert(username + " has joined as a Book!e");
    } catch (error) {
      Alert.alert("Password at least 6 characters");
      console.log(error);
    }
    console.log('createuser');
  };
};

const login = dispatch => {
  return async ({username, password}) => {
    // Do some API Request here
    try {
      const token = base64.encode(`${username}:${password}`);
      console.log(username + password + token)
      const response = await bookingApi.get("/users/find", {
        headers: {
          Authorization: `Basic ${token}`,
        },
        params: {
          name: username,
        }
      });
      console.log("getting userid");
      console.log(username + "\'s response.data.uid: " + response.data.uid);
    } catch (error) {
      Alert.alert("Error! Access denied!");
      console.log(error);
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "Unauthorized",
          "You are not a book!e yet."
        );
      } else {
        // setError(error.message);
      }
    } finally {
      
    }
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
  {token: null, uid: 0, username: ''},
);