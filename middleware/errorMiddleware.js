// 404 for unmatched routes
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

// Centralized error formatter
export function errorHandler(err, req, res, next) { // eslint-disable-line
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Server error',
    // In production you might hide stack:
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
