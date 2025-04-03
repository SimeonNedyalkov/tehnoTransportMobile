import AsyncStorage from "@react-native-async-storage/async-storage";
import SMS from "../interfaces/SMS";
const getAuthToken = async (): Promise<string | null> => {
  try {
    const idToken = await AsyncStorage.getItem("authToken");

    return idToken;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

const createSMS = async (sms: SMS) => {
  const DBURL = "http://192.168.1.6:3000/sms-logs";
  const authToken = await getAuthToken();
  console.log(authToken);
  if (!authToken) {
    console.error("No auth token found");
    return;
  }
  try {
    const response = await fetch(DBURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      //   credentials: "include",
      body: JSON.stringify(sms),
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.log(errorResponse);
      console.log("Error Update failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating customer data:", error);
    throw error;
  }
};
export default createSMS;
