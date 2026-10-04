import { useEffect } from "react";
import { toast } from "sonner";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "https://minilnk.onrender.com";

export function BackendWakeup() {
  useEffect(() => {
    const wakeBackend = async () => {
      const start = Date.now();

      const toastId = toast.loading("Waking up server...", {
        description: "This may take up to a minute.",
      });

      const timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - start) / 1000);

        toast.loading(`Waking up server... ${seconds}s`, {
          id: toastId,
          description: "Please wait while the server starts.",
        });
      }, 1000);

      try {
        const response = await fetch(`${BACKEND_URL}/health`);

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        clearInterval(timer);

        toast.success("Server is ready", {
          id: toastId,
        });
      } catch {
        clearInterval(timer);

        toast.error("Could not wake the server", {
          id: toastId,
          description: "Please try again.",
        });
      }
    };

    wakeBackend();
  }, []);

  return null;
}
