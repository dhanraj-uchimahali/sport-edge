import matchService from "../services/match.service.js";

export const create = async (req, res, next) => {
  try {
    const createdMatch = await matchService.create(req);
    return res.success(createdMatch, "Match created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const fetchAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const matches = await matchService.fetchAll(page, limit);
    return res.success(matches, "Matches fetched successfully", 200);
  } catch (error) {
    next(error);
  }
};