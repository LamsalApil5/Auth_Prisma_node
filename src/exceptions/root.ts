//Message, status code, error codes, error

export class HttpException extends Error{
    massage: string;
    errorCode: any;
    statusCode: number;
    errors:ErrorCodes;

    constructor(massage:string, errorCode:any, statusCode:number, error:any){
        super(massage)
        this.massage = massage
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = error

    }
}

export enum ErrorCodes{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCURRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 20001,
}