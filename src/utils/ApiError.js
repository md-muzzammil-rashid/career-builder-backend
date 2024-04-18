class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        error = [],
        stack='',
        ){
        super(message)
        this.message = message
        this.error = error
        if (stack) {
            this.stack = stack
        }


    }
}
export default ApiError