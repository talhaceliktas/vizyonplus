import { addDays, format } from "date-fns";

export function randomDateNext30Days() {
  const start = new Date();
  const end = addDays(start, 30);

  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return format(new Date(timestamp), "dd/MM/yyyy");
}

export function randomDatePrevious30Days() {
  const end = new Date();
  const start = addDays(end, -30);

  const timestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return format(new Date(timestamp), "dd/MM/yyyy");
}
