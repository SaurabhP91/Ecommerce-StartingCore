const router = require('express').Router();
const Product = require('../models/Product');

//get all products
router.get('/', async (req,res) => {
    try{
        const products = await Product.find();
        if(!products) res.status(404).send('No products added');
        res.json(products);
    } catch(error) {
        res.status(500).send(error);
    }
});

//get product by id
router.get('/:id', async (req,res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).send('product not found');
        res.json(product);
    } catch (error){
        res.status(500).send(error);
    }
});

//add a new product to database
router.post('/', async (req,res) => {
   

    try{
        const { name, description, price, category} = req.body;

        const product = new Product ({
            name,
            description,
            price,
            category
        });

        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).send(error);

    }
});

//delete a product from database
router.delete('/:id', async (req,res) => {
    try{
        const products = await Product.find();
        let deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct) return res.status(404).send('product not found');

        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;
