import { Product } from "./Product"

export interface OrderVM {
    orderLineID: Number
    orderID: Number 
    date: Date
    productID:Number,
    userID:Number,
    Quantity: Number,
    products: Product[],
    description: String 
}