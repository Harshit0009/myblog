// we are handling our custom error message
class ErrorResponse extends Error {
    constructor(message, codeStatus) {
        super(message);
        this.codeStatus = codeStatus;
    }
}

module.exports = ErrorResponse;