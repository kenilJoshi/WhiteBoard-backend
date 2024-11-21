
class ApiError extends Error {
    statusCode: number;
    errorType: string;

    constructor(message: string, statusCode: number, errorType: string){
        super(message)
        this.statusCode = statusCode
        this.errorType = errorType
        console.log(ApiError.prototype);
        
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export default ApiError