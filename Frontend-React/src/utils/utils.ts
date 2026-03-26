export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const matchRegex = (str: string, regex: RegExp): boolean => {
  return regex.test(str);
}

export const formatDateToMMDDYYYY = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Date invalide");
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export const buildQuery = (obj: Object) => {
    const query = new URLSearchParams(
        Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {})
    ).toString();

    return query
}