import { Timestamp } from "firebase/firestore";

export default interface Customer {
  id: string;
  brand: string | "Unknown Brand";
  createdAt?: Timestamp | Date;
  dateOfTehnoTest: Timestamp | Date;
  firstName: string;
  model: string;
  phone: string;
  regNumber: string;
  status?: string;
  daysRemaining?: number;
  checked?: false;
}
