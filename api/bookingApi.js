import axios from "axios";

const BASE_URL = "https://booking-api-55ab36857552.herokuapp.com/";

// const BASE_URL = "http://localhost:8080/";

export const bookingApi = axios.create({ baseURL: BASE_URL });
