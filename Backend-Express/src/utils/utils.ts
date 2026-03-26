export const isInCurrentMonth =(date: Date): boolean => {
  const now = new Date();

  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export const getCurrentMonthRange = () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { startOfMonth, startOfNextMonth };
}

type CurrentMonthInfo = {
  year: number;
  month: number; // 0-11
  daysInMonth: number;
  weeksInMonth: number;
  start: Date;
  end: Date;
};

export const getCurrentMonthInfo = (): CurrentMonthInfo => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const daysInMonth = end.getDate();

  const startDay = start.getDay();
  const weeksInMonth = Math.ceil((daysInMonth + startDay) / 7);

  return {
    year,
    month,
    daysInMonth,
    weeksInMonth,
    start,
    end,
  };
}

type RemainingCurrentMonthInfo = {
  today: Date;
  endOfMonth: Date;
  remainingDays: number;
  remainingWeeks: number;
  remainingMonths: number;
};

export const getRemainingCurrentMonthInfo = (): RemainingCurrentMonthInfo => {
  const today = new Date();

  const endOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  const msPerDay = 1000 * 60 * 60 * 24;

  // On neutralise les heures pour éviter les bugs
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfMonthDate = new Date(
    endOfMonth.getFullYear(),
    endOfMonth.getMonth(),
    endOfMonth.getDate()
  );

  const remainingDays =
    Math.floor((endOfMonthDate.getTime() - startOfToday.getTime()) / msPerDay) + 1;

  const remainingWeeks = Math.ceil(remainingDays / 7);

  return {
    today: startOfToday,
    endOfMonth: endOfMonthDate,
    remainingDays,
    remainingWeeks,
    remainingMonths: 1,
  };
}