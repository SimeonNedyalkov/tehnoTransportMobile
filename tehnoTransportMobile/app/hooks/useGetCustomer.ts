import { useEffect, useState } from "react";
import Customer from "../interfaces/Customer";
import { Timestamp } from "firebase/firestore";

export default function useGetCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const DBURL = "http://192.168.1.6:3000/due-soon-customers";

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

        const filteredData: Customer[] = data.map((customer: any) => {
          const date = new Date(customer.dateOfTehnoTest.seconds * 1000);
          const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          );
          let testDate: Date;
          if (customer.dateOfTehnoTest instanceof Timestamp) {
            // If it's a Firebase Timestamp
            testDate = customer.dateOfTehnoTest.toDate();
          } else if (customer.dateOfTehnoTest instanceof Date) {
            // If it's already a Date object
            testDate = customer.dateOfTehnoTest;
          } else {
            // If it's an object with seconds and nanoseconds (common in Firestore documents)
            testDate = new Date(customer.dateOfTehnoTest.seconds * 1000);
          }

          return {
            id: customer.id,
            brand: customer.brand,
            createdAt: customer.createdAt,
            dateOfTehnoTest: localDate.toISOString().split("T")[0],
            firstName: customer.firstName,
            model: customer.model,
            phone: String(customer.phone),
            regNumber: customer.regNumber,
          };
        });

        setCustomers(filteredData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    getCustomer();
  }, []);

  return customers;
}
