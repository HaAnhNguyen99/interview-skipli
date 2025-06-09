export interface Message {
  from: string;
  to: string;
}

export interface SendMessage extends Message {
  content: string;
}

export interface MessageResponse extends Message {
  id: string;
}
