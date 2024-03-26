import crypto from 'crypto';
import fs from 'fs';

export const isEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
export const isPassword = (password: string) => password.length > 8;

export const resolveTx = (
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

export function getFileExtension(fileName: string): string {
  const fileNameSplited = fileName.split('.');
  const ext = fileNameSplited[fileNameSplited.length - 1];

  return ext;
}

export function randomInt(
  min: number,
  max: number,
): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateUniqueID() {
  return crypto.randomBytes(12).toString('hex');
}

export function generateReferenceNumber(preword: string = 'PR') {
  return `${preword}${Date.now()}`;
}

export function generateToken(): number {
  let code: number = 0;
  const min = randomInt(1000, 9999);
  const max = randomInt(5000, 999999);

  if (max > min) {
    code = randomInt(min, max);
  } else {
    code = randomInt(max, min);
  }

  return Math.floor(code);
}

export function generateApiKey(): string {
  // Generate a random buffer using a secure method
  const buffer = crypto.randomBytes(32);

  // Convert the buffer to a hexadecimal string
  const apiKey = buffer.toString('hex');

  return apiKey;
}

export function generateSHA256(input: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

export function generateSignature(payload: any, secret: string) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

export function generateSHA256Hash(data: string, secretKey: string): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('hex');
}

export function centToDollar(amount: number | string): number {
  const value = parseFloat(`${amount}`);
  return value / 100;
}

export function dollarToCent(amount: number | string): number {
  const value = parseFloat(`${amount}`);
  return value * 100;
}
