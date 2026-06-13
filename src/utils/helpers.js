import { MATCH_STATUS } from "../constants/matchStatus.js";
export const getMatchStatus = (startTime, endTime, now = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime() || end.getTime())) {
    return null;
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }

  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }
  
  return MATCH_STATUS.LIVE;
};
