class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error,
        statck = []
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.errors = errors
        this.success = false
        if (statck) {
            this.stack = statck
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError