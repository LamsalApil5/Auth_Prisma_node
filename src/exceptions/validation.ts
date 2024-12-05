import { HttpException } from "./root";

export class UnprocessableEntity extends HttpException{
    constructor(error: any, massage: string, errorCode:number){
        super(massage,errorCode,422,error)
    }
}