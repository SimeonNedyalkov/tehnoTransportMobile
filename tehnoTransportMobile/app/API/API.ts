import Customer from "../interfaces/Customer";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getAuthToken = async (): Promise<string | null> => {
  try {
    const idToken = await AsyncStorage.getItem("idToken");

    return idToken;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

const updateCustomer = async (id: string, customer: Customer) => {
  const DBURL = "http://192.168.1.6:3000/customers/";
  const authToken = await getAuthToken();
  console.log(authToken);
  if (!authToken || authToken == null) {
    console.error("No auth token found");
    return;
  }
  try {
    const response = await fetch(DBURL + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      credentials: "include",
      body: JSON.stringify(customer),
    });
    if (!response.ok && customer.brand != "") {
      console.log("Error Update failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating customer data:", error);
  }
};
export default updateCustomer;
