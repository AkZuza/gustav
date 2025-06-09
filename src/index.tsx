import { Elysia, t } from "elysia"
import { html, Html } from "@elysiajs/html"
import { staticPlugin } from "@elysiajs/static"
import Home from "./pages/Home"
import Chat from "./components/Chat"
import Textbox from "./components/Textbox"
import type { ChatMessage } from "./types/ChatMessage"
import UserMessage from "./views/UserMessage"
import SystemMessage from "./views/SystemMessage"
import OpenAI from "openai"
import "./util/neo4j_functions"
import {createAccountFunction, createUserFunction, handleFunction} from "./util/neo4j_functions"
import type { ChatCompletionTool } from "openai/resources.mjs"

// Structure for chat texts
var messages: ChatMessage[] = []
var responses: string[] = []

// Initialize OpenAI stuff here
const client = new OpenAI({
	baseURL: "http://192.168.138.76:2345/v1",
	apiKey: "lm-studio"
})

const tools: ChatCompletionTool[] = [
	createUserFunction as ChatCompletionTool, 
	createAccountFunction as ChatCompletionTool
]

const generateReponse = async (prompt: string) => {
	const completion = await client.chat.completions.create({
		model: "llama-3.2-3b-instruct",
		messages: [
			{
				"role": "user",
				"content": prompt,
			}
		],
		tools: tools
	})

	let response = completion.choices[0]?.message.content ?? ""
	console.log('Response from LLM\n' + response + '\n')
	const tool_calls: any = completion.choices[0]!.message.tool_calls
	console.log(`Tools called:\n`)
	console.log(tool_calls)

	for (let i = 0; i < tool_calls.length; ++i) {
		const tool_call = tool_calls[i]
		const args = JSON.parse(tool_call.function.arguments)
		const functionName = tool_call.function.name
		
		console.log(`Function call: ${functionName}`)
		console.log(args)
		handleFunction(functionName, args)
		response += `\ntool: ${functionName} args: (${args})`
	}
	responses.push(response)
}

// Type Definition for Prompt Form payload
const promptPayload = {
	body: t.Object({
		prompt: t.String()
	})
}


new Elysia()
	.use(html())
	.use(staticPlugin({ assets: 'src/static', prefix: '', headers: { 'Cache-Control': 'public, max-age=0' } } ))
	.get("/", () => <Home>This is some content</Home>)
	.get("/component/chat", () => <Chat messages={messages}/>)
	.get("/component/textbox", () => <Textbox/>)
	.get("/responses/:id", async ({ params: { id }}) => {
		const index = parseInt(id)
		const response = responses.at(index)

		if(index > responses.length) return " "
		
		// Response has not generated yet
		if(response == undefined) {
			return (
				<div hx-get={`/responses/${id}`} hx-trigger="load delay:1s" hx-swap="outerHTML" id={`response-${index}`} hx-target={`#response-${index}`}>
					Waiting for Response
				</div>
			)
		}

		console.log(`Generated Response ${id}:\n${response}\n`)
		return response
	} )
	.get("/component/chat/latest", () => <> <UserMessage message={messages.at(-1)!.message}/> <SystemMessage id={messages.length-1}/> </>)
	.post("/prompt",  ({ body, set }) => {
		const prompt: string = body.prompt
		messages.push({ role: "user", message: prompt })
		generateReponse(prompt)
		set.headers = { 'HX-Trigger': 'update-chat' }
	}, promptPayload)
	.listen(3000)



