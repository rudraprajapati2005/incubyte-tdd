export default class ErrorResponse extends Error{
    constructor(error, message, statusCode)
    {
        
        super(message);
        this.error = error;
        this.statusCode = statusCode;
    }
}