import db from "../models/index.js";
import CustomError from "../utils/customError.js";
import { getMatchStatus } from "../utils/helpers.js";
import { eventBus } from '../events/eventBus.js';

const matchService = {};

matchService.create = async (req) => {
  const { sport, homeTeam, awayTeam, startTime, endTime } = req.body;
  const newMatch = await db.Match.create({
    sport,
    home_team: homeTeam,
    away_team: awayTeam,
    start_time: startTime,
    end_time: endTime,
    status: getMatchStatus(startTime, endTime),
  });

  eventBus.emit('match:created', newMatch)
};

matchService.fetchAll = async (page = 1, limit = 10) => {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 10;
  const offset = (safePage - 1) * safeLimit;
  const matches = await db.Match.findAll({
    attributes: [
      "id",
      "sport",
      ["home_team", "homeTeam"],
      ["away_team", "awayTeam"],
      "status",
      ["start_time", "startTime"],
      ["end_time", "endTime"],
      ["home_score", "homeScore"],
      ["away_score", "awayScore"],
    ],
    limit: safeLimit,
    offset,
    raw: true,
    order: [["id", "DESC"]],
  });

  return { page, limit, data: matches };
};

export default matchService;
