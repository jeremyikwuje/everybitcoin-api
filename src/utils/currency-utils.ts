export function round_to_decimal_places(
  value: number,
  min_decimals: number = 2,
  max_decimals: number = 8,
): string {
  // Ensure the value is a number
  if (Number.isNaN(value)) {
    throw new Error('Value must be a number');
  }

  // Round the value to the maximum number of decimal places
  let rounded_value = value.toFixed(max_decimals);

  // Remove trailing zeros
  rounded_value = rounded_value.replace(/\.?0+$/, '');

  // Ensure at least the minimum number of decimal places
  const decimal_index = rounded_value.indexOf('.');
  if (decimal_index === -1) {
    // If there's no decimal point, add one with the minimum number of decimals
    rounded_value += `.${'0'.repeat(min_decimals)}`;
  } else {
    const current_decimals = rounded_value.length - decimal_index - 1;
    if (current_decimals < min_decimals) {
      // If there are fewer decimals than the minimum, pad with zeros
      rounded_value += '0'.repeat(min_decimals - current_decimals);
    }
  }

  return rounded_value;
}
