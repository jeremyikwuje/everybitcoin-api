import date from 'date-and-time';

export default class Time {
  // ✅ Or get a Date object with the specified Time zone
  static changeTimeZone(
    datevalue: string | Date = new Date(),
    timeZone: string = 'Africa/Lagos',
  ) {
    if (typeof datevalue === 'string') {
      return new Date(
        new Date(datevalue).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }

    return new Date(
      datevalue.toLocaleString('en-US', {
        timeZone,
      }),
    );
  }

  static getTime = (value: string | Date = new Date()): number => {
    const datevalue = new Date(value);
    return Math.floor(datevalue.getTime() / 1000);
  };

  static now = (): string => {
    const now = new Date();
    return date.format(now, 'YYYY-MM-DD HH:mm:ss');
  };

  static today = (): string => {
    const now = new Date();
    return date.format(now, 'YYYY-MM-DD');
  };

  static next = (
    count: number,
    interval: string = 'seconds',
    from: string | Date = new Date(),
  )
  : string | number => {
    const now = new Date(from);
    let later = null;

    if (interval === 'minutes') { later = date.addMinutes(now, count); }
    if (interval === 'hours') { later = date.addHours(now, count); }
    if (interval === 'days') { later = date.addDays(now, count); }
    if (interval === 'months') { later = date.addMonths(now, count); }

    if (later != null) { return this.format(later, 'datetime'); }

    return 0;
  };

  static prev = (count: number, interval: string = 'seconds'): string | undefined => {
    const now = new Date();
    let later = null;

    if (interval === 'minutes') { later = date.addMinutes(now, count); }
    if (interval === 'hours') { later = date.addHours(now, count); }

    if (later != null) { return this.format(later, 'datetime'); }

    return undefined;
  };

  static format = (dt: Date | string, d: string = 'datetime'): string => {
    let datevalue = dt;
    if (typeof (datevalue) === 'string') {
      datevalue = new Date(datevalue);
    }

    if (d === 'date') {
      return date.format(datevalue, 'v');
    }

    return date.format(datevalue, 'ddd, MMM DD YYYY h:mm:ss A');
  };
}
