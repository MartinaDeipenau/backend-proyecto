import EErrors from '../errors/enumError.js'

export default (error, req, res, next) => {
    console.error(error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.send({ status: 'Error', error: error.name, message: error.message })
            break
            
        case EErrors.INVALID_ARGUMENT:
            res.send({ status: 'Error', error: error.name, message: error.message })
            break

        default:
            res.send({ status: 'Error', error: 'Error indeterminado' })
    }
}