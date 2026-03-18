export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const matchRegex = (str: string, regex: RegExp): boolean => {
  return regex.test(str);
}