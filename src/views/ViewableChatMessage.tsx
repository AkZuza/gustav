import { Html } from "@elysiajs/html";
import type { ChatMessage } from "../types/ChatMessage";
import UserMessage from "./UserMessage";
import SystemMessage from "./SystemMessage";

const ViewableChatMessage = ( {message}: {message: ChatMessage}) => message.role === "user" ? <UserMessage message={message?.message}/>
	: <SystemMessage message={message?.message}/>


export default ViewableChatMessage
