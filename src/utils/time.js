export function convertUTCtoIST(utcDate) {
  return new Date(utcDate).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
}