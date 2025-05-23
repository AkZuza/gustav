
// Message that can be displayed on chat 
type ChatRole = "system" | "user";
export interface ChatMessage {
	role: ChatRole;
	message: string;
}



