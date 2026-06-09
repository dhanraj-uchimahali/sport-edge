import db from "../models/index.js";

export const responseMiddleware = (req, res, next) => {
  let parsedResponse = {};

  // Success response handler
  res.success = async (data, message = "Success", statusCode = 200) => {
    parsedResponse = {
      status: statusCode,
      message: message,
      result: res.data ? JSON.stringify(res.data).replaceAll("'", "") : "",
    };

    return res.status(statusCode).json({
      success: true,
      message: message,
      result: data,
    });
  };

  // Error response handler
  res.error = async (message = 'Error', statusCode = 500, errors = null) => {
    parsedResponse = {
      status: statusCode,
      message: message,
      result: res.data ? JSON.stringify(res.data).replaceAll("'", "") : "",
    };
    
    return res.status(statusCode).json({
      success: false,
      message: message
    });
  };

  next();
};
