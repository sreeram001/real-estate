import moment from "moment";
/**
 * @param {*} utcTime time
 * @returns return local time
 */
export const UTCtimeToLocalTimeConvertion = (utcTime = "") => {
  if (utcTime) {
    return moment.utc(utcTime).local().format("YYYY-MM-DD HH:mm:ss");
  }
  return "";
};

/**
 * @returns moment utc time
 */
export const currentUTCtime = () => {
  return moment.utc().format();
};
