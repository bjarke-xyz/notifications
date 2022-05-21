import {
  DiscordMessage,
  DiscordSettings,
  EmailMessage,
  EmailSettings,
  Message,
  SendMessageRequest,
  Settings,
} from "./model";

export interface IChannelManager<T extends Message> {
  send: (message: T) => Promise<void>;
}

export class DiscordChannelManager implements IChannelManager<DiscordMessage> {
  constructor(private readonly settings: DiscordSettings) {}
  public async send(message: DiscordMessage): Promise<void> {
    const username = message.username ?? this.settings.defaultUsername;
    const request = new Request(this.settings.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        content: message.message,
      }),
    });
    const resp = await fetch(request);
    if (!resp.ok) {
      throw new Error(
        `Failed to send discord message. resp.status=${resp.status}`
      );
    }
  }
}

export class EmailChannelManager implements IChannelManager<EmailMessage> {
  constructor(private readonly settings: EmailSettings) {}
  public async send(message: EmailMessage): Promise<void> {
    const fromEmail = message.fromAddress ?? this.settings.defaultFromAddress;
    const fromName =
      this.settings.defaultFromName ?? this.settings.defaultFromAddress;
    if (!fromEmail) {
      throw new Error("email missing fromAddress");
    }
    const toEmail = message.toAddress ?? this.settings.defaultToAddress;
    if (!toEmail) {
      throw new Error("email missing toAddress");
    }
    const subject = message.subject ?? message.message.substring(0, 10);
    const request = new Request("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: toEmail,
              },
            ],
          },
        ],
        from: {
          email: fromEmail,
          name: fromName,
        },
        subject,
        content: [
          {
            type: "text/plain",
            value: message.message,
          },
        ],
      }),
    });
    const resp = await fetch(request);
    if (!resp.ok) {
      throw new Error(`Failed to send email. resp.status=${resp.status}`);
    }
  }
}

export async function sendMessage(
  request: SendMessageRequest,
  settings: Settings
): Promise<boolean> {
  let success = false;
  if (request.channels.length === 0) {
    return success;
  }

  for (const channel of request.channels) {
    if (success) {
      break;
    }
    try {
      switch (channel) {
        case "discord":
          {
            const discordChannelManager = new DiscordChannelManager(
              settings.channels.discord
            );
            await discordChannelManager.send(request.message as DiscordMessage);
            success = true;
          }
          break;
        case "email":
          {
            const emailChannelManager = new EmailChannelManager(
              settings.channels.email
            );
            await emailChannelManager.send(request.message as EmailMessage);
            success = true;
          }
          break;
      }
    } catch (error) {
      console.error(`error sending message via ${channel}, trying next`, error);
      success = false;
    }
  }

  if (!success) {
    console.error("All channels failed to send");
  }
  return success;
}
