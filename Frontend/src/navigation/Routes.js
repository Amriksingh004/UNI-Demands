import Department from "../container/admin/Department.js";
import Product from "../container/admin/Product.js";
import University from "../container/admin/University.js";
import About from "../container/about/About.js";
import OrderConfirmation from "../container/cart/OrderConfirmation.js";
import OrderSummary from "../container/cart/OrderSummary.js";
import ShoppingCart from "../container/cart/ShoppingCart.js";
import Contact from "../container/contact/Contact.js";
import UserDepartment from "../container/user/department/UserDepartment.js";
import Home from "../container/home/Home.js";
import Login from "../container/login/Login.js";
import UserProduct from "../container/user/product/UserProduct.js";
import UserProductDetail from "../container/user/productDetail/UserProductDetail.js";
import Register from "../container/register/Register.js";
import Support from "../container/support/Support.js";
import OrderManagement from "../container/admin/OrderManagement.js";
import OrderDetails from "../container/cart/OrderDetails.js";
import ManageOrder from "../container/userorder/ManageOrder.js";

const ROUTES = {
  about: {
    name: "/about",
    component: <About />,
  },
  contact: {
    name: "/contact",
    component: <Contact />,
  },
  support:{
    name: "/support",
    component: <Support />,
  },
  register: {
    name: "/register",
    component: <Register />,
  },
  login: {
    name: "/login",
    component: <Login />,
  },
  home: {
    name: "/",
    component: <Home />,
  },
  cart: {
    name: "/cart",
    component: <ShoppingCart />,
  },
  orderConfirmation: {
    name: "/orderConfirmation",
    component: <OrderConfirmation />,
  },
  orderSummary: {
    name: "/orderSummary",
    component: <OrderSummary />,
  },
  universityAdmin: {
    name: "/universityAdmin",
    component: <University/>,
  },
  departmentAdmin: {
    name: "/departmentAdmin",
    component:<Department />,
  },
  productAdmin: {
    name: "/productAdmin",
    component:<Product/>
  },
departmentUser: {
    name: "/departmentUser",
    component: <UserDepartment />,
  },
  productUser: {
    name: "/productUser",
    component: <UserProduct />,
  },
  productDetail: {
    name: "/productDetail",
    component: <UserProductDetail />,
  },
  orderManagement:{
    name: "/orderManagement",
    component: <OrderManagement />,
  },
  userOrder: {
    name: "/userorder",
    component: <ManageOrder />,
  },
  orderDetails: {
  name: "/orders/:orderId",
  component: <OrderDetails />,
}
};

export default ROUTES;
