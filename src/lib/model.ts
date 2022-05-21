export interface SendMessageRequest {
  channels: ChannelType[];
  message: MessageTypes;
}

export interface Message {
  message: string;
}

export interface DiscordMessage extends Message {
  username: string | null;
}

export interface EmailMessage extends Message {
  subject: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

export type MessageTypes = DiscordMessage | EmailMessage;

export interface Settings {
  userId: string;
  channels: {
    discord: DiscordSettings;
    email: EmailSettings;
  };
}

export type ChannelType = "email" | "discord";

export interface DiscordSettings {
  type: ChannelType;
  webhookUrl: string;
  defaultUsername: string | null;
}

export interface EmailSettings {
  type: ChannelType;
  defaultFromAddress: string | null;
  defaultFromName: string | null;
  defaultToAddress: string | null;
}
