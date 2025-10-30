import dayjs from "@/lib/dayjs";

export function isAfter(startDate: Date | string, endDate?: Date | string | null): boolean {
  if (!startDate || !endDate) return false;

  const result = dayjs(startDate).isAfter(endDate);

  return result;
}

export function isAfterOrSame(startDate: Date | string, endDate?: Date | string | null): boolean {
  if (!startDate || !endDate) return false;

  const result = dayjs(startDate).isAfter(endDate) || dayjs(startDate).isSame(endDate);

  return result;
}

export function format(date: Date | string | null): Date | null {
  if (dayjs(date).isValid()) {
    const result = dayjs(date).utc().second(0).millisecond(0).toDate();

    return result;
  }

  return null;
}

export function formatWithTime(date: Date | string, time: string, timezone: string): Date {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const newDate = dayjs.tz(date, timezone).hour(hours).minute(minutes).second(seconds);

  return newDate.utc().toDate();
}

export function formatWithTimezone(date: Date | string | null, timezone: string): string | null {
  if (dayjs(date).isValid()) {
    const newDate = dayjs(date).tz(timezone).format();

    return newDate;
  }

  return null;
}

export function addOneDay(startDate: string | Date, endDate: string | Date) {
  const newEndDate = dayjs(endDate).add(1, "day").format("YYYY-MM-DD");

  return { startDate, endDate: newEndDate };
}

export function diffInMinutes(startDate: Date, endDate: Date) {
  const minutes = dayjs(startDate).diff(endDate, "minute");

  return Math.abs(minutes);
}
