import { Request as IttyRouterRequest } from "itty-router";

export type WorkerEnv = {
  KV_NOTIFICATIONS: KVNamespace;
  SERVICE_AUTH: Fetcher;
};

export type IttyRequest = Request & IttyRouterRequest;
