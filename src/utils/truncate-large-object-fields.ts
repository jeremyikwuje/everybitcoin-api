export function truncateLargeFieldsInObject(obj: any, maxLength = 500) {
  const truncatedObj: any = {};

  Object.entries(obj).forEach(([key, value]) => {
    // Check if the value is a string and its length exceeds maxLength
    if (typeof value === 'string' && value.length > maxLength) {
      // Truncate the string and append an indicator (e.g., "...")
      truncatedObj[key] = `${value.substring(0, maxLength)}...`;
    } else if (typeof value === 'object' && value !== null) {
      // Recursively truncate fields if the value is an object
      truncatedObj[key] = truncateLargeFieldsInObject(value, maxLength);
    } else {
      // Copy the value as is if it's not a long string or object
      truncatedObj[key] = value;
    }
  });

  return truncatedObj;
}
