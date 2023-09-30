import { Schema, model } from 'mongoose'
import { cartModel } from './carts.js'

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: 'user',
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ]
    },
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true,
    },
    last_connections: {
        type: Date,
        default: Date.now
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'cart',
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next()
    }

    try {
        const newcart = new cartModel()
        await newcart.save()
        this.cart = newcart._id

        return next()
    } catch (error) {
        return next(error)
    }
})

export const userModel = model('user', userSchema)