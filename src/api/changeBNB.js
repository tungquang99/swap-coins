import axios from "axios";

export const changeBNB = async (url) => {
  const res = await axios.get(url);
  return Number(res.data.price);
};
