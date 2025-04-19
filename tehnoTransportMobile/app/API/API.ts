import Customer from "../interfaces/Customer";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getAuthToken = async (): Promise<string | null> => {
  try {
    const idToken = await AsyncStorage.getItem("authToken");

    return idToken;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

const updateCustomer = async (id: string, customer: Customer) => {
  const DBURL = "https://tehno-transport-b.onrender.com/customers/";
  const authToken = await getAuthToken();
  if (!authToken) {
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
      body: JSON.stringify(customer),
    });
    if (!response.ok && customer.brand != "") {
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
export default updateCustomer;
