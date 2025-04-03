import { Timestamp } from "firebase/firestore";

function timestampToDateStringConverter(timestamp: Timestamp) {
  let date;
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date((timestamp as any)["_seconds"] * 1000);
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  localDate.toISOString().split("T")[0];
  return localDate;
}
export default timestampToDateStringConverter;
