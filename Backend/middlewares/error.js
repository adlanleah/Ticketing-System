   import ErrorResponse from '../utils/ErrorResponse.js';

   const errorHandler = (err, req, res, next) => {
     let error = { ...err };
     error.message = err.message;

     // Handle specific error types
     if (err instanceof ErrorResponse) {
       return res.status(err.statusCode).json({
         success: false,
         message: error.message || 'Server Error',
       });
     }

     // Handle other errors
     return res.status(500).json({
       success: false,
       message: 'Server Error',
     });
   };

   export default errorHandler;
   