import logger from '../../logger/logger';
import ApiResponse from '../../utils/api-response';
import { get_user } from '../users/user.service';

export const generate_unique_password = (length: number) => {
  const numbers = '0123456789';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let password = '';
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
  password += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];

  const allCharacters = numbers + lowerCaseLetters + upperCaseLetters;
  for (let i = 3; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  return password.split('').sort(() => 0.5 - Math.random()).join('');
};
