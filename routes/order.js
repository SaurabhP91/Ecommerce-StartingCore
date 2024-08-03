const Order = require('../models/Order');
const Cart = require('../models/Cart');
const router = require('express').Router();


//create new order
router.post("/", async (req,res) => {
    try{
        const {userId} = req.body;

        let cartItems = await Cart.findOne({userId}).populate('products.productId');
        if(!cartItems) return res.status(404).send("Cart not found");

        //calculate total amount 
        let totalAmount = 0;
        cartItems.products.forEach(p => {
            totalAmount += p.quantity * p.productId.price;
        })

        //create a new order
        const order = new Order({
            userId,
            products: cartItems.products,
            totalAmount

        });

        //save order
        const savedOrder = await order.save();

        //clear the user's cart
        cartItems.products = [];
        await cartItems.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).send(error);

    }
});


// get all orders for a user
router.get('/:userId', async (req,res) => {
    try{
        const { userId } = req.params;

        const orders = await Order.find({userId});
        res.json(orders);
    } catch (error) {
        res.status(500).send(error);

    }
});


//update an order's status
router.put('/:orderId', async (req,res) => {
    try{
        const {orderId} = req.params;
        const {status} = req.body;

        const order = await Order.findById(orderId);

        if (!order) return res.status(404).send('Order not found');

        order.status = status;
        await order.save();

        res.json(order);
    } catch(error) {
        res.status(500).send(error);

    }
});


//delete an order
router.delete('/:orderId', async (req,res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) return res.status(404).send('Order not found');

        res.send('Order deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

