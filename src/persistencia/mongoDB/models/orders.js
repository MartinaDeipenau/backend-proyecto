import { Schema, model } from 'mongoose'

const orderSchema = new Schema({
    code: {
        type: String,
        unique: true,
        require: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        require: true
    },
    purchaser: {
        type: String,
        require: true
    },
    products: {
        type: [
            {
                _id: false,
                id_prod: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: Number,
            }
        ]
    }
})

export const orderModel = model('orders', orderSchema)