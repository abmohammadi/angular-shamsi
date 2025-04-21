/**
   * Converts Shamsi (Jalali) date to Gregorian date
   * @param year Shamsi year (e.g., 1404)
   * @param month Shamsi month (1-12)
   * @param day Shamsi day (1-31)
   * @returns Date object in Gregorian calendar
   */
  sirangShamsiToGregorian(year: number, month: number, day: number): Date {
    // Validate input
    if (month < 1 || month > 12 || day < 1 || day > this.sirangMonthMaxDay(year, month)) {
      return new Date(NaN); // Invalid date
    }

    const nowruz = this.sirangFirstGDate(year);
    const dayOfYear = this.sirangDayOfYear(year, month, day);

    const result = new Date(nowruz);
    result.setDate(result.getDate() + dayOfYear - 1);
    return result;
  }

  /**
   * Gets the first Gregorian date of the Shamsi year.
   * @param year The Shamsi year to convert.
   * @returns The first Gregorian date of the Shamsi year.
   */
  sirangFirstGDate(year: number) {
    let gYearStart = year + 621;
    var firstCalendar = (new Date(`${gYearStart}-03-21`));
    let firstShamsi = firstCalendar.toLocaleDateString("fa-ir").split("/");
    if (firstShamsi[2] != "۱") {
      firstCalendar.setDate(firstCalendar.getDate() - 1);
    }

    // console.log(firstCalendar.setDate(firstCalendar.getDate()));
    return firstCalendar;
  }

  /**
   * Gets the maximum number of days in a given month of the Shamsi year.
   * @param year The Shamsi year.
   * @param month The month (1-12).
   * @returns The maximum number of days in the specified month.
   */
  sirangMonthMaxDay(year: number, month: number) {
    let isLeap = this.sirangIsLeap(year);
    // let monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    // if (isLeap) {
    //   monthDays[11] = 30;
    // }
    let monthDays = this.sirangGetMonthDays(year);

    let monthMaxDay = monthDays[month - 1];
    return monthMaxDay;
  }

  /**
   * Checks if the given year is a leap year in the Shamsi (Jalali) calendar.
   * @param year The Shamsi year to check.
   * @returns true if the year is a leap year, false otherwise.
   */

  sirangIsLeap(year: number): boolean {

    let gYearStart = year + 621 + 1;
    let calendar = (new Date(`${gYearStart}-03-20`));
    let shamsi = this.persianToEnglishNumbers(calendar.toLocaleDateString("fa-ir").split("/")[2]);

    if (+shamsi == 30) {
      return true;
    }
    calendar = (new Date(`${gYearStart}-03-21`));
    shamsi = this.persianToEnglishNumbers(calendar.toLocaleDateString("fa-ir").split("/")[2]);

    if (+shamsi == 30) {
      return true;
    }

    return false;

    // The Shamsi calendar has a 33-year cycle with 8 leap years
    const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
    console.log(year, (year) % 33);

    return leapYears.includes((year + 1) % 33);
  }
  /**
 * Calculates day of year (1-365/366)
 */
  private sirangDayOfYear(year: number, month: number, day: number): number {
    const monthDays = this.sirangGetMonthDays(year);
    let sum = 0;
    for (let i = 0; i < month - 1; i++) {
      sum += monthDays[i];
    }
    return sum + day;
  }


  /**
 * Gets days in each month for a given year
 */
  sirangGetMonthDays(year: number): number[] {
    return [
      31, 31, 31, 31, 31, 31,  // First 6 months
      30, 30, 30, 30, 30,       // Next 5 months
      this.sirangIsLeap(year) ? 30 : 29 // Esfand
    ];
  }





  /**
   * Persian number to English number conversion
   * @param input 
   * @returns 
   */
  private persianToEnglishNumbers(input: string | number): string {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    let result = input.toString();

    for (let i = 0; i < 10; i++) {
      // Replace Persian numbers
      result = result.replace(
        new RegExp(persianNumbers[i], 'g'),
        i.toString()
      );
      // Replace Arabic numbers
      result = result.replace(
        new RegExp(arabicNumbers[i], 'g'),
        i.toString()
      );
    }

    return result;
  }
