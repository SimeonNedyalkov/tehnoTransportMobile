import { Timestamp } from "firebase/firestore";

export default interface SMS {
  customerID: string;

  isSent: boolean;

  message: string;

  receiverName: string;

  response: string;

  senderName: string;

  sentAt?: Timestamp;
}
