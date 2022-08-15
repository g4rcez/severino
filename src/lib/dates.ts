import { add, endOfDay, getUnixTime } from "date-fns";

export namespace Dates {
  export const nextDay = (day: Date) => endOfDay(add(day, { days: 1 }));

  export const epoch = (date: Date) => getUnixTime(date);
}
