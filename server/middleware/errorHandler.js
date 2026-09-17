// Central error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log in dev
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = { statusCode: 404, message: 'Resource not found.' };
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = { statusCode: 400, message: `${field || 'Field'} already exists.` };
  }
  // Mongoose validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = { statusCode: 400, message: messages.join('. ') };
  }
  // JWT errors handled in middleware
  if (err.name === 'JsonWebTokenError') {
    error = { statusCode: 401, message: 'Invalid token.' };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
