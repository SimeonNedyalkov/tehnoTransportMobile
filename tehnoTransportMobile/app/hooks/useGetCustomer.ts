import { useEffect, useState } from "react";
import Customer from "../interfaces/Customer";
import { Timestamp } from "firebase/firestore";

export default function useGetCustomer(refreshSignal: boolean) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const DBURL = "http://192.168.1.6:3000/customers";

  useEffect(() => {
    const getCustomer = async () => {
      try {
        let response = await fetch(DBURL, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          try {
            console.log("Retrying request with refreshed token...");
            response = await fetch(DBURL, {
              method: "GET",
              credentials: "include",
            });
          } catch (error) {}
          throw new Error("Failed to fetch customer data");
        }

        const data = await response.json();

        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    getCustomer();
  }, [refreshSignal]);

  return customers;
}
