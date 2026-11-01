// The MSW server for Node (Vitest, and later the Next.js server for E2E).
// In the browser you would use setupWorker from "msw/browser" instead.
import { setupServer } from "msw/node";
import { handlers } from "@/test/msw/handlers";

export const server = setupServer(...handlers);
