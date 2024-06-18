/**
 * check is null or not ,is null mean retun obj
 * @param obj
 */
export const nullToObj = (obj: any = null) => {
  if (obj) {
    return typeof obj === "object" ? obj : {};
  }
  return {};
};

/**
 * check is null or string
 * @param str
 */
export const nullToString = (str: any = null) => {
  if (str) {
    return typeof str === "string" ? str : "";
  }
  return "";
};

/**
 * check is null or not ,is null mean retun obj
 * @param obj
 */
export const nullToArray = (array: any = null) => {
  return Array.isArray(array) ? array : [];
};
