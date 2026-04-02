import Axios from "@/utils/Axios";

export const getAvailableNumbers = (params) =>
  Axios.get("/twilio/available-numbers", { params });

export const buyNumber = (data) =>
  Axios.post("/twilio/buy-number", data);

export const getMyNumbers = () =>
  Axios.get("/twilio/my-numbers");

export const releaseNumber = (sid) =>
  Axios.post(`/twilio/release-number/${sid}`);
 