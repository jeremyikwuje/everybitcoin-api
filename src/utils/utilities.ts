import crypto from 'crypto';
import fs from 'fs';

export const is_email = (email: string) => /^\S+@\S+\.\S+$/.test(email);
export const is_password = (password: string) => password.length > 8;

export const resolve_tx = (
  type: string,
  currency: string,
  accountId: string,
  amount: number,
) => {
  // Specify the file path
  const logFile = '../transactions.log';
  // Data to append to the file
  const logContent = `resolve: ${type} ${amount} ${currency} by ${accountId}`;

  // Append data to the file
  fs.appendFile(logFile, logContent, 'utf8', (err) => {
    if (err) {
      console.error('Error appending to the file:', err);
    } else {
      console.log('Data appended to the file successfully!');
    }
  });
};

export function empty(value: string): boolean {
  if (value === null || value === undefined) return true;
  if (value.trim().length > 0) return false;

  return true;
}

export function random_int(
  min: number,
  max: number,
): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generate_unique_id() {
  return crypto.randomBytes(12).toString('hex');
}

export function generate_reference_number(preword: string = 'PR') {
  return `${preword}${Date.now()}`;
}

export function generate_token(): number {
  let code: number = 0;
  const min = random_int(1000, 9999);
  const max = random_int(5000, 999999);

  if (max > min) {
    code = random_int(min, max);
  } else {
    code = random_int(max, min);
  }

  return Math.floor(code);
}

export function generate_api_key(): string {
  // Generate a random buffer using a secure method
  const buffer = crypto.randomBytes(32);

  // Convert the buffer to a hexadecimal string
  const apiKey = buffer.toString('hex');

  return apiKey;
}

export function generate_sha_256(input: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

export function generate_signature(payload: any, secret: string) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

export function generate_sha_256_hash(data: string, secretKey: string): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('hex');
}

export function percentage_difference(
  num1: number,
  num2: number,
) {
  const difference = num1 - num2;
  const average = (num1 + num2) / 2;
  const percentage = (difference / average) * 100;

  return percentage;
}

export function cent_to_dollar(amount: number | string): number {
  const value = parseFloat(`${amount}`);
  return value / 100;
}

export function dollar_to_cent(amount: number | string): number {
  const value = parseFloat(`${amount}`);
  return value * 100;
}
