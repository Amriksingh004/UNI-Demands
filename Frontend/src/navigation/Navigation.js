import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ROUTES from './Routes.js'
import ProtectedRoute from '../navigation/ProtectedRoute.js'
import UserProduct from '../container/user/product/UserProduct.js' // <-- Import UserProduct

function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.home.name} element={ROUTES.home.component} />
        <Route path={ROUTES.about.name} element={ROUTES.about.component} />
        <Route path={ROUTES.contact.name} element={ROUTES.contact.component} />
        <Route path={ROUTES.support.name} element={ROUTES.support.component} />
        <Route path={ROUTES.register.name} element={ROUTES.register.component} />
        <Route path={ROUTES.login.name} element={ROUTES.login.component} />
        <Route path={ROUTES.departmentUser.name} element={ROUTES.departmentUser.component} />
        <Route path={ROUTES.productUser.name} element={ROUTES.productUser.component} />
        <Route path={ROUTES.productDetail.name} element={ROUTES.productDetail.component} />

        {/* User Product Page for replacement selection */}
        <Route path="/user-product" element={<UserProduct />} />

        {/* Protected Routes for logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.cart.name} element={ROUTES.cart.component} />
          <Route path={ROUTES.userOrder.name} element={ROUTES.userOrder.component} />
          <Route path={ROUTES.orderConfirmation.name} element={ROUTES.orderConfirmation.component} />
          <Route path={ROUTES.orderSummary.name} element={ROUTES.orderSummary.component} />
          <Route path={ROUTES.orderDetails.name} element={ROUTES.orderDetails.component} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path={ROUTES.universityAdmin.name} element={ROUTES.universityAdmin.component} />
          <Route path={ROUTES.departmentAdmin.name} element={ROUTES.departmentAdmin.component} />
          <Route path={ROUTES.productAdmin.name} element={ROUTES.productAdmin.component} />
          <Route path={ROUTES.orderManagement.name} element={ROUTES.orderManagement.component} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Navigation
