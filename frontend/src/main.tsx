import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/router";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: 0,
            border: "2px solid #1b1a16",
            background: "#f1efe6",
            color: "#1b1a16",
            fontFamily: "Archivo, sans-serif",
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
