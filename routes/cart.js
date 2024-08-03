const router = require('express').Router();
const Cart = require('../models/Cart');


//get cart items for user
router.get('/:userId', async (req,res) => {
    try{
        const cartItems = await Cart.findOne({userId: req.params.userId}).populate('products.productId');
        if(!cartItems) return res.status(404).send('Cart not found');
        res.json(cartItems);
    } catch (error){
        res.status(500).send(error);
    }
});

//add product to cart
router.post('/:userId', async (req,res) => {
    try{
        const { userId } = req.params;
        const {productId, quantity} = req.body;

        let cartItems = await Cart.findOne({userId});

        if(!cartItems) {
            cartItems = new Cart({userId, products: [{productId, quantity}] });
        } else {
            const productIndex = cartItems.products.findIndex(p => p.productId.toString() === productId);
            if(productIndex >= 0) {
                cartItems.products[productIndex].quantity += quantity;
            } else {
                cartItems.products.push({ productId, quantity});
            }
        }
        await cartItems.save();
        res.json(cartItems);
    } catch (error) {
        res.status(500).send(error);
    }
});

//remove product from cart
router.delete('/:userId/:productId', async (req,res) =>{
    try{
        const {userId, productId} = req.params;

        let cartItems = await Cart.findOne({userId});
        if(!cartItems) return res.status(404).send('Cart not found');

        const productInCart = cartItems.products.filter(p => p.productId.toString() === productId);
        if(productInCart.length === 0){
            return res.status(404).send("product not present in user's cart");
        }

        cartItems.products = cartItems.products.filter(p => p.productId.toString() !== productId);
        await cartItems.save();
        res.json(cartItems);
    }catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;