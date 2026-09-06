import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import { router } from "@/router";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: 0,
                border: "2px solid var(--color-ink)",
                background: "var(--color-card)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-sans)",
              },
            }}
          />
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
