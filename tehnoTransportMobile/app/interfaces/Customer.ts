import { Timestamp } from "firebase/firestore";

interface Customer {
  id: string;
  brand: string | "Unknown Brand";
  createdAt?: Timestamp;
  dateOfLastTehnoTest: Timestamp;
  dateOfNextTehnoTest: Timestamp;
  firstName: string;
  model: string;
  phone: string;
  regNumber: string;
  isSmsSent: boolean;
  isSentToApp: boolean;
  status?: string;
  daysRemaining?: number;
  checked?: boolean;
}
export default Customer;
