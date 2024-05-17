export type ResponseBag = {
    data: any,
    message: string,
    hasError: boolean
}

export default class ResponseService {
    public static sendSuccess(_data: any, _message: string = "Success"): ResponseBag{
        return {
            data: _data,
            message: _message,
            hasError: false
        }
    }

    public static sendError(_data: any, _message: string = "Error"): ResponseBag{
        return {
            data: _data,
            message: _message,
            hasError: true
        }
    }
}