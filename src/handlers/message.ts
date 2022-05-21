import { validateAuth } from "../lib/auth";
import { sendMessage } from "../lib/channel-manager";
import { SendMessageRequest } from "../lib/model";
import { SettingsRepository } from "../lib/settings-repository";
import { IttyRequest, WorkerEnv } from "../types";

export async function handleSendMessage(
  req: IttyRequest,
  env: WorkerEnv,
  context: EventContext<any, any, any>
): Promise<Response> {
  const userId = await validateAuth(req, env);
  if (!userId) {
    return new Response("Could not authenticate", { status: 401 });
  }
  const sendMessageRequest = await req.json<SendMessageRequest>();
  if (!sendMessageRequest.channels) {
    return new Response("No channels specified", { status: 400 });
  }

  if (!sendMessageRequest.message) {
    return new Response("No message specified", { status: 400 });
  }

  const settingsRepository = new SettingsRepository(env);
  const settings = await settingsRepository.getSettings(userId);
  if (!settings) {
    return new Response("Settings not found", { status: 404 });
  }

  context.waitUntil(sendMessage(sendMessageRequest, settings));
  return new Response("Message queued for sending");
}
