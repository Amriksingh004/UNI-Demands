import express from "express";
import {
  CreateUniversity,
  DeleteUniversity,
  GetUniversities,
  UpdateUniversity,
} from "../controllers/UniversityController.js";
import multer from "multer";
import { DeleteDepartment, GetDepartments, SaveDepartment, UpdateDepartment } from "../controllers/DepartmentController.js";
import { CreateProduct, DeleteProduct, GetProductDetails, GetProducts, UpdateProduct, UpdateProductQty } from "../controllers/ProductController.js";
import { Login, Register } from "../controllers/UserController.js";
import { AddToCart, GetCartItems, incProdCount, decProdCount, deleteProd, OrderSummary, OrderSubmission, GetCheckout, OrderConfirmation } from "../controllers/CartController.js";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import OrderHeaderModel from "../models/OrderHeader.js";
// server/routes/staticRoutes.js
// ... existing imports
import { getOrderWithItems, requestReplacement } from "../controllers/ReplacementController.js";



const router = express.Router();

// GET order details + replacements (user)

// Replacement flow (user)
router.post("/orders/replacement/request", requestReplacement);

// Admin replacement endpoints
router.get("/orders/:orderId", getOrderWithItems); // GET order header + items
router.post("/orders/replacement/request", requestReplacement); // create replacement


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

}

function adminAuthMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Admin role required' });
    }
  });
}
function anyAuthMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Admin role required' });
    }
  });
}

const storageUniv = multer.diskStorage({
  destination: "public/universityImg",
  filename: (req,file, cb)=>{
    cb(null,`image-${Date.now()}.${file.originalname}`);
  },
});



const uploadUniv = multer({ storage: storageUniv });

router.get("/university", GetUniversities);
router.post("/university", adminAuthMiddleware, uploadUniv.single("image"), CreateUniversity);
router.put("/university", adminAuthMiddleware, uploadUniv.single("image"), UpdateUniversity);
router.delete("/university/:id", adminAuthMiddleware, DeleteUniversity);


const storageDep = multer.diskStorage({
  destination: "public/departmentImg",
  filename:(req,file, cb)=>{
    cb(null,`image-${Date.now()}.${file.originalname}`)
  }
});
const uploadDept = multer({storage:storageDep});

router.get("/department/:id", GetDepartments);
router.post("/department", adminAuthMiddleware, uploadDept.single("image"), SaveDepartment);
router.put("/department", adminAuthMiddleware, uploadDept.single("image"), UpdateDepartment);
router.delete("/department/:id", adminAuthMiddleware, DeleteDepartment);

const storageProduct = multer.diskStorage({
  destination: "public/productImg",
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const uploadProduct = multer({ storage: storageProduct });

router.get("/products/:departmentId",GetProducts);
router.post("/product", adminAuthMiddleware, uploadProduct.array("images"), CreateProduct); // Assuming max 10 images
router.put("/product", adminAuthMiddleware, uploadProduct.array("images", 10), UpdateProduct); // Add multer for update as well
router.delete("/product/:id", adminAuthMiddleware, DeleteProduct);
router.get("/product/:id", GetProductDetails);
router.put("/product/qty", adminAuthMiddleware, UpdateProductQty);

const storageUser = multer.diskStorage({
  destination: "public/userImg",
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const uploadUser = multer({ storage: storageUser });

router.post("/user/register", uploadUser.single("profilePic"), Register);
router.post("/user/login", Login)

router.get("/cart", anyAuthMiddleware, GetCartItems);
router.post("/addToCart", anyAuthMiddleware, AddToCart);
router.put("/incProdCount", anyAuthMiddleware, incProdCount);
router.put("/decProdCount", anyAuthMiddleware, decProdCount);
router.delete("/deleteProd", anyAuthMiddleware, deleteProd);
router.get("/ordersummary", anyAuthMiddleware, OrderSummary);
router.post("/ordersubmission", anyAuthMiddleware, OrderSubmission);
router.get("/orderconfirmation", anyAuthMiddleware, OrderConfirmation);


router.get("/getrders",adminAuthMiddleware,async(req,res)=>{
  try {
    const orders = await OrderHeaderModel.find()
    res.status(200).send(orders);
  } catch (error) {
    console.log(error?.message)
  }
})


export default router;
