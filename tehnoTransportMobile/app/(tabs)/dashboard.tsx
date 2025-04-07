import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Customer from "../interfaces/Customer";
import * as SMS from "expo-sms";
import { useLocalSearchParams } from "expo-router";
import Message from "../interfaces/Message";
import { Timestamp } from "firebase/firestore";
import { NativeModules } from "react-native";
import updateCustomer from "../API/API";
const { SmsSender } = NativeModules;
import { MaterialIcons } from "@expo/vector-icons";
import useGetCustomer from "../hooks/useGetCustomer";
import timestampToDateStringConverter from "../tools/timestampConverter";
import * as IntentLauncher from "expo-intent-launcher";
import { useUser } from "../tools/UserContext";
import { Linking } from "react-native";
import createSMS from "../API/APISMS";
export default function DashboardScreen() {
  const { user, loading } = useUser();
  const [refreshSignal, setRefreshSignal] = useState(false);
  const DATA = useGetCustomer(refreshSignal);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newMessage, setNewMessage] = useState(
    "Здравейте, \nна [date] Ви изтича Годишният Технически Преглед на кола с регистрационен номер : '[regNumber]', моля запишете си час преди датата на изтичане на прегледа за да използвате нашата отстъпка от 5%"
  );
  // const { message } = useLocalSearchParams();
  const IPDBURL = "http://192.168.1.6:3000/customers";
  const IPMessageURL = "http://192.168.1.6:3000/message/";
  useEffect(() => {
    if (DATA.length !== customers.length) {
      const dataArr = [];
      for (let i = 0; i < DATA.length; i++) {
        const customer = DATA[i];
        if (customer.isSmsSent === false) {
          if (customer.isSentToApp === true) {
            dataArr.push(customer);
          }
        }
      }
      setCustomers(dataArr);
      // setCustomers(DATA);
    }
  }, [DATA]);

  const handleRefresh = () => {
    setSelectedCustomers([]);
    setSelectAll(false);
    setRefreshSignal((prev) => !prev);
  };

  // useEffect(() => {
  //   if (message.length != 0) {
  //     setNewMessage(JSON.stringify(message));
  //   }
  // }, [message]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomers((prev) => {
      if (prev.some((c) => c.id === customer.id)) {
        return prev.filter((c) => c.id !== customer.id);
      } else {
        return [...prev, customer];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers([...customers]);
    }
    setSelectAll(!selectAll);
  };
  const askIfMessageIsSent = async (
    customerToUpdate: Customer,
    personalizedMessage: string
  ) => {
    try {
      await updateCustomer(customerToUpdate.id, customerToUpdate);
      await createSMS({
        customerID: customerToUpdate.id,
        isSent: true,
        message: personalizedMessage,
        receiverName: customerToUpdate.firstName,
        response: "success",
        senderName: user.displayName || "user",
      });
      handleRefresh();
    } catch (error) {
      console.error(`Error while updating customer: ${error}`);
    }
  };

  const confirmMessageSent = (
    customer: Customer,
    personalizedMessage: string
  ) => {
    // Show a confirmation dialog
    Alert.alert(
      "Confirm SMS Sent",
      `Did you successfully send the message to ${customer.phone}?`,
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              await askIfMessageIsSent(
                { ...customer, isSmsSent: true },
                personalizedMessage
              );
              console.log(`Customer ${customer.id} marked as SMS sent.`);
              // handleRefresh(); // Refresh customer list
            } catch (error) {
              console.error("Failed to update customer:", error);
            }
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  };

  const sendSms = async () => {
    if (selectedCustomers.length !== 0) {
      const phonesArray = selectedCustomers.map((customer) =>
        String(customer.phone)
      );
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        alert("SMS is available on this device");

        // Loop through each phone number and send SMS individually
        for (let customer of selectedCustomers) {
          // Replace placeholders with actual customer data

          const personalizedMessage = newMessage
            .replace("[regNumber]", customer.regNumber)
            .replace("[date]", customer.dateOfNextTehnoTest.toString());
          const { result } = await SMS.sendSMSAsync(
            customer.phone,
            personalizedMessage
          );
          setTimeout(() => {
            confirmMessageSent(customer, personalizedMessage);
          }, 1000);
          // console.log("great");
          // const customerToUpdate = { ...customer, isSmsSent: true };
          // console.log(customerToUpdate);
        }

        // alert("Messages sent successfully to selected customers");
      } else {
        alert("Misfortune... there's no SMS available on this device");
      }
    }
    setSelectedCustomers([]);
    setSelectAll(false);
  };

  const renderCustomer = ({ item }: { item: Customer }) => {
    return (
      <View style={styles.customerRow}>
        <Checkbox
          color="#28A745"
          status={
            selectedCustomers.some((c) => c.id === item.id)
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleSelectCustomer(item)}
        />
        <Text style={styles.customerText}>{item.firstName}</Text>
        <Text style={styles.customerText}>{item.regNumber}</Text>
        <Text style={styles.customerText}>{item.phone}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Tehno Transport</Text>
      <Text style={styles.header}>Due Soon Customers</Text>
      <View style={styles.customerRow}>
        <Checkbox
          status={selectAll ? "checked" : "unchecked"}
          onPress={handleSelectAll}
          color="#28A745"
        />
        <Text style={styles.customerText}>Select All</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.customerText, styles.headerText]}>Name</Text>
        <Text style={[styles.customerText, styles.headerText]}>Reg Number</Text>
        <Text style={[styles.customerText, styles.headerText]}>Phone</Text>
      </View>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={renderCustomer}
        style={styles.table}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendSms}>
        <Text style={styles.sendButtonText}>Send SMS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  companyName: {
    fontFamily: "Roboto",
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    width: "100%",
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  customerText: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    justifyContent: "space-between",
    marginTop: 20,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  refreshButton: {
    marginRight: 10,
    padding: 5,
  },
});
