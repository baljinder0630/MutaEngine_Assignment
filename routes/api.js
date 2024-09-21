import express from "express"
import auth from "./auth.js"
import { addNewProduct, getAllProducts } from "../controller/products.js";
import proceedToCheckout from "../controller/proceedToCheckout.js";
import webhooks from "../controller/webhooks.js";

const router = express.Router()

router.use('/', auth);
router.get('/products', getAllProducts);
router.post('/product/add', addNewProduct);
router.post('/proceedToCheckout', proceedToCheckout);
router.post('/webhook', webhooks);

export default router