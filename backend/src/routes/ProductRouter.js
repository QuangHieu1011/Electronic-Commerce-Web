const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Quản lý kho hàng (admin)
router.get('/inventory', authMiddleware, ProductController.getInventory);
router.put('/inventory', authMiddleware, ProductController.updateInventory);

router.post('/create', ProductController.createProduct);
router.put('/update/:id', authMiddleware, ProductController.updateProduct);
router.get('/details/:id', ProductController.getDetailsProduct);
router.delete('/delete/:id', authMiddleware, ProductController.deleteProduct);
router.get('/getAll', ProductController.getAllProduct);
router.post('/delete-many', authMiddleware, ProductController.deleteMany);
router.get('/get-all-type', ProductController.getAllType);
router.get('/frequently-bought-together/:id', ProductController.getFrequentlyBoughtTogether);

module.exports = router;