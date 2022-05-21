import { WorkerEnv } from "../types";
import { Settings } from "./model";

export class SettingsRepository {
  constructor(private readonly env: WorkerEnv) {}

  public async getSettings(userId: string): Promise<Settings | null> {
    return await this.env.KV_NOTIFICATIONS.get<Settings>(
      `settings:${userId}`,
      "json"
    );
  }

  public async updateSettings(settings: Settings): Promise<void> {
    await this.env.KV_NOTIFICATIONS.put(
      `settings:${settings.userId}`,
      JSON.stringify(settings)
    );
  }
}
