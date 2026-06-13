import * as yup from "yup";

const parseDateTime = (value, originalValue) => {
  if (originalValue === undefined || originalValue === null || originalValue === "") {
    return originalValue;
  }

  if (originalValue instanceof Date) {
    return originalValue;
  }

  if (typeof originalValue === "string") {
    const normalized = originalValue.trim().replace(" ", "T");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? new Date("") : parsed;
  }

  return originalValue;
};

export const createMatchSchema = yup.object({
  sport: yup.string().trim().required("sport is required"),
  homeTeam: yup.string().trim().required("homeTeam is required"),
  awayTeam: yup.string().trim().required("awayTeam is required"),
  startTime: yup.date().transform(parseDateTime).typeError("startTime must be a valid datetime").required("startTime is required"),
  endTime: yup.date().transform(parseDateTime).typeError("endTime must be a valid datetime").required("endTime is required"),
});
