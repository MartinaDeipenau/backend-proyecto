export const generateErrorAddProduct = (product) => {
    return `Uno o mas parametros incompletos.
    Lista de parametros requeridos:
    * title: debe ser string, se recibió ${product.title}
    * description: debe ser string, se recibió ${product.description}
    * code: debe ser string, se recibió ${product.code}
    * price: debe ser number, se recibió ${product.price}
    * stock: debe ser number, se recibió ${product.stock}
    * category: debe ser string, se recibió ${product.category}`
}

export const generateErrorAddProductToCart = (product) => {
    return `Uno o mas parametros incompletos.
    Lista de parametros requeridos: 
    * product: necesita identificacion de mongoDB, se recibió ${product._id}, producto no encontrado`
}