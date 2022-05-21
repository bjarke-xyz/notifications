/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router";
import { handleSendMessage } from "./handlers/message";
import { getSettings, updateSettings } from "./handlers/settings";
import { IttyRequest, WorkerEnv } from "./types";

const router = Router();

router.post(
  "/message",
  (req: IttyRequest, env: WorkerEnv, context: EventContext<any, any, any>) =>
    handleSendMessage(req, env, context)
);

router.get(
  "/settings",
  (req: IttyRequest, env: WorkerEnv, context: EventContext<any, any, any>) =>
    getSettings(req, env, context)
);

router.put(
  "/settings",
  (req: IttyRequest, env: WorkerEnv, context: EventContext<any, any, any>) =>
    updateSettings(req, env, context)
);

export default {
  fetch: router.handle,
};
