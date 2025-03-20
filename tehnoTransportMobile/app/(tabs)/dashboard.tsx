import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import Customer from "../interfaces/Customer";
import * as SMS from "expo-sms";
import { useLocalSearchParams } from "expo-router";
import Message from "../interfaces/Message";
import { Timestamp } from "firebase/firestore";
import useGetCustomer from "../hooks/useGetCustomer";
export default function DashboardScreen() {
  const DATA = useGetCustomer();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newMessage, setNewMessage] = useState(
    "Здравейте, \nна [date] Ви изтича Годишният Технически Преглед на кола с регистрационен номер : '[regNumber]', моля запишете си час преди датата на изтичане на прегледа за да използвате нашата отстъпка от 5%"
  );
  // const { message } = useLocalSearchParams();
  const IPDBURL = "http://192.168.1.6:3000/due-soon-customers";
  const IPMessageURL = "http://192.168.1.6:3000/message/";

  useEffect(() => {
    if (DATA.length !== customers.length) {
      setCustomers(DATA);
    }
  }, [DATA]);

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
            .replace("[date]", customer.dateOfTehnoTest.toString());
          const { result } = await SMS.sendSMSAsync(
            customer.phone,
            personalizedMessage
          );
          if (result === "sent") {
            console.log(`Message sent to ${customer.phone}`);
          } else {
            console.log(`Failed to send message to ${customer.phone}`);
          }
        }

        alert("Messages sent successfully to selected customers");
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
      <Text style={styles.header}>Due Soon Customers</Text>
      <View style={styles.customerRow}>
        <Checkbox
          status={selectAll ? "checked" : "unchecked"}
          onPress={handleSelectAll}
        />
        <Text style={styles.customerText}>Select All</Text>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    marginTop: 20,
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
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
