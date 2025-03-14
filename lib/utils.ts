import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CONVERT PRISMA OBJECT INTO REGULAR JS OBJECT
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// FORMAT NUMBERS WITH DECIMAL PLACES
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// FORMAT ERRORS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // handle zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    // handle other error
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

// ROUND NUMBERS TO 2 DECIMAL PLACES
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is not a number or a string");
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

// FORMAT NUMBER
const NUMBER_FORMATTER = new Intl.NumberFormat("it-IT");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

// SHORTEN UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// FORMAT DATE ANDA TIMES
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // mese abbreviato (es. 'ott')
    year: "numeric", // anno numerico (es. '2023')
    day: "numeric", // giorno numerico (es. '25')
    hour: "numeric", // ora numerica (es. '8')
    minute: "numeric", // minuto numerico (es. '30')
    hour12: false, // usa l'orologio a 24 ore (false) o a 12 ore (true)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // giorno della settimana abbreviato (es. 'lun')
    month: "short", // mese abbreviato (es. 'ott')
    year: "numeric", // anno numerico (es. '2023')
    day: "numeric", // giorno numerico (es. '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // ora numerica (es. '8')
    minute: "numeric", // minuto numerico (es. '30')
    hour12: false, // usa l'orologio a 24 ore (false) o a 12 ore (true)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "it-IT",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "it-IT",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "it-IT",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// make the pagination links
export function makeUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: query,
    },
    {
      skipNull: true,
    }
  );
}
