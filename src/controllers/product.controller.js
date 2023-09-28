import CustomError from '../errors/customError.js'
import EErrors from '../errors/enumError.js'
import { transporter } from '../utils/nodemailer.js'
import { generateErrorAddProduct } from '../errors/infoError.js'

import {
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,
    productDelete,
} from '../persistencia/DAOs/mongoDAO/productMongo.js'


export const getAllProducts = async (req, res) => {
    try {
        const product = await getProducts(req.query)
        res.render('home', {
            products: product.docs,
            user: req.session.user
        })
        //{docs: products} prods sin meta data
    } catch (error) {
        res.status(500).send('Error al obtener productos')
        console.error(error)
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const product = await getProductsById(id)

        res.render('products', {
            title: product.title,
            price: product.price,
            stock: product.stock,
            pid: product._id,
            thumbnail: product.thumbnail,
            user: req.session.user
        })
    } catch (error) {
        return res.status(500).send('Error al obtener productos')
    }
}


export const postNewProduct = async (req, res, next) => {
    const {
        title,
        description,
        price,
        thumbnail,
        status,
        category,
        code,
        stock,
    } = req.body

    try {
        if (!title || !description || !price || !category || !code || !stock) {
            CustomError.createError({
                name: 'Error al crear producto',
                cause: generateErrorAddProduct({
                    title,
                    description,
                    price,
                    category,
                    code,
                    stock,
                }),
                message: 'Error al crear el producto',
                code: EErrors.INVALID_TYPES_ERROR,
            })
        }


        await createProduct(req.body)

        res.status(200).send('Producto agregado exitosamente')
    } catch (error) {
        next(error)
    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params

    const { title, description, price, thumbnail, status, category, stock } =
        req.body

    const obj = {
        title,
        description,
        price,
        status,
        stock,
        category,
        thumbnail,
    }

    try {
        const productUpdate = await updateProduct(id, obj)
        res.status(200).send(productUpdate)
    } catch (error) {
        res.status(500).send('Error al actualizar producto')
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    const product = await getProductsById(id)
    // console.log(product)
    // console.log(req.user)

    try {
        if (req.user.email !== product.owner || product.owner !== 'admin') {
            throw new Error('No autorizado para eliminar producto')
        }

        if (req.user.password === product.owner && req.user.role === 'premium') {
            await transporter.sendMail({
                to: req.user.email,
                subject: `Bienvenido  ${req.user.first_name}`,
                text: `El producto ${product._id} ha sido eliminado por el administrador`,
            })
        }
        await productDelete(id)

        res.status(200).send('Producto eliminado exitosamente')
    } catch (error) {
        res.status(500).send('Error al eliminar el producto')
    }
}