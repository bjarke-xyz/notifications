import { validateAuth } from "../lib/auth";
import { Settings } from "../lib/model";
import { SettingsRepository } from "../lib/settings-repository";
import { IttyRequest, WorkerEnv } from "../types";

export async function getSettings(
  req: IttyRequest,
  env: WorkerEnv,
  context: EventContext<any, any, any>
): Promise<Response> {
  const userId = await validateAuth(req, env);
  console.log(userId);
  if (!userId) {
    return new Response("Could not authenticate", { status: 401 });
  }

  const settingsRepository = new SettingsRepository(env);
  const settings = await settingsRepository.getSettings(userId);
  if (settings) {
    return new Response(JSON.stringify(settings), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response(null, { status: 404 });
  }
}

export async function updateSettings(
  req: IttyRequest,
  env: WorkerEnv,
  context: EventContext<any, any, any>
): Promise<Response> {
  const userId = await validateAuth(req, env);
  if (!userId) {
    return new Response("Could not authenticate", { status: 401 });
  }

  const settingsRepository = new SettingsRepository(env);
  const settings = await req.json<Settings>();
  settings.userId = userId;
  await settingsRepository.updateSettings(settings);
  return new Response(null, { status: 200 });
}
