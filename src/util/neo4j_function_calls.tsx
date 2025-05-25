import { OpenAI } from "openai"

const tools = [
	{
		"type": "function",
		"function": {
			"name": "createUser",
			"description": "Create a user in the database",
			"parameters": {
				"type": "object",
				"properties": {
					"name": {
						"type": "string",
						"description": "The name the user"
					},
					"email": {
						"type": "string",
						"description": "the email id of the user eg. user@gmail.com, user@hotmail.com, user@rvce.edu.in"
					}
				}
			}
		}
	}
]
