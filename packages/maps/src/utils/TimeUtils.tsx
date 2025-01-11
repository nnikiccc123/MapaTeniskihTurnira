import {ensureNumLen} from "./CommonUtil";

export class TimeUtils {

    public static readonly ONE_SECOND: number = 1000;
    public static readonly ONE_MINUTE: number = TimeUtils.ONE_SECOND * 60;
    public static readonly ONE_HOUR: number = TimeUtils.ONE_MINUTE * 60;
    public static readonly ONE_DAY: number = TimeUtils.ONE_HOUR * 24;

    public static readonly MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    public static readonly MONTH_NAMES_SHORT = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    public static readonly WEEK_NAMES = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    public static readonly WEEK_NAMES_SHORT = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];

    private static readonly PATTERNS = {
        y: d => d.getFullYear() % 10,
        yy: d => d.getFullYear() % 100,
        yyy: d => d.getFullYear() % 1000,
        yyyy: d => d.getFullYear(),
        M: d => d.getMonth() + 1,
        MM: d => ensureNumLen(d.getMonth() + 1, 2),
        MMM: d => TimeUtils.MONTH_NAMES_SHORT[d.getMonth()],
        MMMM: d => TimeUtils.MONTH_NAMES[d.getMonth()],
        d: d => d.getDate(),
        dd: d => ensureNumLen(d.getDate(), 2),
        ddd: d => TimeUtils.WEEK_NAMES_SHORT[d.getDay()],
        dddd: d => TimeUtils.WEEK_NAMES[d.getDay()],
        h: d => d.getHours(),
        hh: d => ensureNumLen(d.getHours(), 2),
        H: d => {
            let h = d.getHours();
            if (h == 0) {
                return "12am";
            } else if (h == 12) {
                return "12pm";
            } else {
                return h % 12 + `${h < 12 && h > 0 ? "am" : "pm"}`;
            }
        },
        m: d => d.getMinutes(),
        mm: d => ensureNumLen(d.getMinutes(), 2),
        s: d => d.getSeconds(),
        ss: d => ensureNumLen(d.getSeconds(), 2)
    };


    public static getCurrentTimeZoneOffset(): number {
        return new Date().getTimezoneOffset();
    }


    public static ensureDate(d: number|Date): Date {
        return typeof d === 'number' ? new Date(d) : d;
    }

    // public static truncToMinute(time: number): number {
    //     return Math.floor(time / TimeUtils.ONE_MINUTE) * TimeUtils.ONE_MINUTE;
    // }

    // public static round(time: number, unit: number, isZulu: boolean = false): number {
    //     // if (!isZulu) {
    //     //     time -= new Date(time).getTimezoneOffset() * this.ONE_HOUR;
    //     // }
    //     return Math.round(time / unit) * unit;
    // }

    // public static trunc(time: number, unit: number, isZuluTime: boolean = true): number {
    //     if (!isZuluTime && unit > this.ONE_HOUR) {
    //         time -= new Date(time).getTimezoneOffset() * TimeUtils.ONE_MINUTE;
    //     }
    //     return Math.floor(time / unit) * unit;
    // }

    // public static truncToHour(time: number): number {
    //     return this.trunc(time, TimeUtils.ONE_HOUR);
    // }

    // public static truncToDay(time: number): number {
    //     return this.trunc(time, TimeUtils.ONE_DAY);
    // }

    // public static truncToWeek(time: number): number {
    //     return time - (new Date(time).getDay()) * TimeUtils.ONE_DAY;
    // }

    // public static today(isZulu: boolean = true) {
    //     return this.trunc(this.now(), TimeUtils.ONE_DAY, isZulu);
    // }

    // public static hour() {
    //     return this.trunc(this.now(), TimeUtils.ONE_HOUR);
    // }

    // public static getMonthName(date: number|Date, short:boolean = true): string {
    //     let names = short ? TimeUtils.MONTH_NAMES_SHORT : TimeUtils.MONTH_NAMES;
    //     return names[TimeUtils.ensureDate(date).getMonth()];
    // }

    // public static getHour(date: number|Date): number {
    //     return TimeUtils.ensureDate(date).getHours();
    // }

    // public static getMinute(date: number|Date): number {
    //     return TimeUtils.ensureDate(date).getMinutes();
    // }

    // public static getDay(date: number|Date): number {
    //     return TimeUtils.ensureDate(date).getDate();
    // }

    // public static getWeekDay(date: number|Date): number {
    //     return TimeUtils.ensureDate(date).getUTCDay();
    // }

    // public static getMonth(date: number): number {
    //     return TimeUtils.ensureDate(date).getUTCMonth();
    // }

    // public static getYear(date: number): number {
    //     return TimeUtils.ensureDate(date).getUTCFullYear();
    // }

    // public static toEpochTime(d: number|Date): number {
    //     let date: Date = TimeUtils.ensureDate(d);
    //     return Math.round(date.getTime()/1000);
    // }

    // public static ensureNumLength(n: number, digits: number = 2): string {
    //     let s = n.toFixed(0);
    //     while (s.length < digits) {
    //         s = "0" + s;
    //     }
    //     return s;
    // }

    public static format(d: number, formatter: string) {
        let date: Date = TimeUtils.ensureDate(d);

        let pattern: string = formatter as string;
        let i = 0;
        let formatted = "";
        let currToken = "";
        let currPattern = null;
        let isConstant = false;

        while (i < formatter.length) {
            let ch = pattern.charAt(i);
            let newToken = currToken + ch;
            let newPattern = TimeUtils.PATTERNS[currToken + ch];
            if (newPattern) {
                currToken = newToken;
                currPattern = newPattern;
            } else {
                formatted += currPattern ? currPattern(date) : currToken;
                currToken = ch;
                currPattern = TimeUtils.PATTERNS[currToken];
            }

            i++;
        }
        formatted += currPattern ? currPattern(date) : currToken;

        return formatted;
    }

    static now(): number {
        return Date.now();
    }

    // static isNowTime(time: number, precision: number = TimeUtils.ONE_HOUR) {
    //     return Math.trunc(time / precision) === Math.trunc(TimeUtils.now() / precision);
    // }

    // static isThisYear(time: number): boolean {
    //     return new Date().getFullYear() === new Date(time).getFullYear();
    // }

}
