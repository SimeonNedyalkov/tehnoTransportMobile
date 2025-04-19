import { Timestamp } from "firebase/firestore";

const calculateDaysRemaining = (testDate: Timestamp) => {
  const newTestDate = new Date(testDate.seconds * 1000);
  const nextTehnoDate = newTestDate.toISOString().split("T")[0];

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  const todaysDate = yyyy + "-" + mm + "-" + dd;

  const nextTehnoDateObj: any = new Date(nextTehnoDate);
  const todayObj: any = new Date(today);

  const timeDiff = nextTehnoDateObj - todayObj;

  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysRemaining;
};

const getStatus = (daysRemaining: number) => {
  if (isNaN(daysRemaining)) {
    return "Invalid Date";
  } else if (daysRemaining < 0 && daysRemaining >= -30) {
    return "Overdue";
  } else if (daysRemaining < -30) {
    return "Expired";
  } else if (daysRemaining <= 7) {
    return "Due Soon";
  } else if (daysRemaining <= 14) {
    return "Upcoming";
  } else if (daysRemaining <= 365) {
    return "Valid";
  } else {
    return "Expired";
  }
};

const daysRemainingAndStatusCalc = { calculateDaysRemaining, getStatus };

export default daysRemainingAndStatusCalc;
