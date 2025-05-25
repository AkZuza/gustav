import { Html } from "@elysiajs/html";
import type { ChatMessage } from "../types/ChatMessage";
import SystemMessage from "../views/SystemMessage";
import UserMessage from "../views/UserMessage";


const Chat = ({ messages }: { messages?: ChatMessage[] }) => {
	return (
		<div class="bg-[#090912] overflow-y-scroll h-[90vh] px-8" hx-get="/component/chat/latest" hx-target="#chat-messages" hx-trigger="update-chat from:body" hx-swap="beforeend">
			<div id="chat-messages">
			</div>
		</div>
	)
}

export default Chat

