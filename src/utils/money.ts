import { Currencies } from '../constants';

export default class Money {
  static to_denomination(
    amount: number,
    currency_code: string,
  ): number {
    const divisor = Currencies.find(
      (c) => c.code === currency_code.toUpperCase(),
    )?.denomination_divisor || 2;

    const amount_value = this.multiply(
      this.format_currency_amount(amount, currency_code),
      divisor,
    );

    return amount_value;
  }

  static to_currency(
    amount: number,
    currency_code: string,
  ): number {
    const divisor = Currencies.find(
      (c) => c.code === currency_code.toUpperCase(),
    )?.denomination_divisor || 2;

    const amount_value = this.divide(
      this.format_currency_amount(amount, currency_code),
      divisor,
    );

    return amount_value;
  }

  static multiply(a: number, b: number): number {
    const total = a * b;

    return total;
  }

  static divide(a: number, b: number): number {
    const total = Number(a) / Number(b);

    return total;
  }

  static format(
    amount: string | number,
    format = 'en-NG',
    currency_code = 'NGN',
  ): string {
    const amount_value = Number(`${amount}`);
    const formatter = new Intl.NumberFormat(format, {
      style: 'currency',
      currency: currency_code,
      minimumFractionDigits: 0,
    });

    return formatter.format(amount_value);
  }

  static format_currency_amount(
    amount: number,
    currency_code: string,
  ): number {
    const decimal = Currencies.find(
      (c) => c.code === currency_code.toUpperCase(),
    )?.decimal || 2;

    // round to decimal places and remove extra zeroes
    const formatted = amount.toFixed(decimal).replace(/\.?0+$/, '');

    return Number(formatted);
  }

  static get_number_from_string(str: string | number): number {
    const value = `${str}`;
    const replaced = value.replace(/[^0-9.]+/g, '');

    let num: number = 0;

    if (replaced !== '') { num = Number(replaced); }

    return num;
  }

  static round(amount: string | number, decimal: number = 2): number {
    const amount_value = Number(
      Money.get_number_from_string(`${amount}`).toFixed(decimal),
    );

    return amount_value;
  }

  static thousandSeparator(number: number, fractionDigits: number = 0): string {
    const defaultLocale = undefined;
    const formatted = number.toLocaleString(defaultLocale, {
      minimumFractionDigits: fractionDigits,
    });
    return formatted;
  }
}
