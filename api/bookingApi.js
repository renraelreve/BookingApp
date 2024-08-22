import axios from "axios";

const BASE_URL = "http://192.168.1.11:8080/"
// const BASE_URL = "https://booking-api-55ab36857552.herokuapp.com/";

export const bookingApi = axios.create({ baseURL: BASE_URL });
