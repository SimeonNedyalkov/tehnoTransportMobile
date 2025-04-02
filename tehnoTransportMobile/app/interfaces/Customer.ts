import { Timestamp } from "firebase/firestore";

interface Customer {
  id: string;
  brand: string | "Unknown Brand";
  createdAt?: Timestamp | Date;
  dateOfLastTehnoTest: Timestamp | Date;
  firstName: string;
  model: string;
  phone: string;
  regNumber: string;
  status?: string;
  daysRemaining?: number;
  checked?: false;
}
export default Customer;
