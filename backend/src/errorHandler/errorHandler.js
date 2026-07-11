// middlewares/errorHandler.js
export  const  errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    error: err.error  || "INTERNAL_SERVER_ERROR",
    message: err.message || "Something went wrong  , please try again"
  });
};
export default errorHandler;
