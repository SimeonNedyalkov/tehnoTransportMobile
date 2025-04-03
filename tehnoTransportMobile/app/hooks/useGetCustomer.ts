import { useEffect, useState } from "react";
import Customer from "../interfaces/Customer";
import { Timestamp } from "firebase/firestore";
import daysRemainingAndStatusCalc from "../tools/daysRemainingAndStatusCalc";

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
        const data = await response.json();

        const filteredData: Customer[] = data.map((customer: any) => {
          const lastTehnodate = new Date(
            customer.dateOfLastTehnoTest._seconds * 1000
          );
          const nextTehnoDate = new Date(
            customer.dateOfNextTehnoTest._seconds * 1000
          );

          const localDateLast = new Date(
            lastTehnodate.getTime() - lastTehnodate.getTimezoneOffset() * 60000
          );
          const localDateNext = new Date(
            nextTehnoDate.getTime() - nextTehnoDate.getTimezoneOffset() * 60000
          );

          const timestampLast = Timestamp.fromDate(localDateLast);
          const timestampNext = Timestamp.fromDate(localDateNext);

          const daysRemaining =
            daysRemainingAndStatusCalc.calculateDaysRemaining(timestampNext);
          const status = daysRemainingAndStatusCalc.getStatus(daysRemaining);
          return {
            id: customer.id,
            brand: customer.brand,
            createdAt: customer.createdAt,
            dateOfLastTehnoTest: localDateLast.toISOString().split("T")[0],
            dateOfNextTehnoTest: localDateNext.toISOString().split("T")[0],
            firstName: customer.firstName,
            model: customer.model,
            phone: String(customer.phone),
            regNumber: customer.regNumber,
            status: status,
            daysRemaining: daysRemaining,
            isSmsSent: customer.isSmsSent,
            isSentToApp: customer.isSentToApp,
          };
        });
        setCustomers(filteredData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    getCustomer();
  }, [refreshSignal]);

  return customers;
}
