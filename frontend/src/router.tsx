import { createBrowserRouter } from "react-router-dom";
import { AuthRoot } from "@/auth/AuthRoot";
import { RequireAuth } from "@/auth/RequireAuth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { CatalogPage } from "@/pages/CatalogPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AuthRoot />,
    children: [
      // Public — the only doors into the shop.
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      // Everything else needs a member.
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <CatalogPage /> },
              { path: "products/:id", element: <ProductDetailPage /> },
              { path: "cart", element: <CartPage /> },
              { path: "checkout", element: <CheckoutPage /> },
              { path: "orders", element: <OrdersPage /> },
              { path: "orders/:id", element: <OrderDetailPage /> },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
