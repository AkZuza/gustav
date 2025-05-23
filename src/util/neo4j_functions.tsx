import neo4j from "neo4j-driver"
import type { User, Bank, Account, OpenedIn } from "./neo4j_entities"

const driver = neo4j.driver(
	"neo4j://localhost",
	neo4j.auth.basic("neo4j", "password")
)

try {
	const serverInfo = await driver.getServerInfo()
	console.log("Established connection to the database")
	console.log(serverInfo)
} catch(err) {
	console.log(`Connection error:\n${err}`)
}


const createUser = async (name: string, email: string, age: number) => {
	const session = driver.session()

	try {
		const result = await session.executeWrite(async tx => {
			const result = await tx.run("CREATE (p:Person {name: $name, email: $email, age: $age}) RETURN p.name", {
				name: name, email: email, age: age
			})

			return result.records[0]
		})

		console.log(`Created user ${result}`)
	} finally {
		session.close()
	}
}

const createUserFunction = {
	"type": "function",
	"function": {
		"name": "createUser",
		"description": "Create user with name, email and age",
		"parameters": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"description": "Name of the User"
				},
				"email": {
					"type": "string",
					"description": "The email id of the user eg. user@gmail.com, user@hotmail.com, user@rvce.edu.in"
				},
				"age": {
					"type": "number",
					"description": "The age of the user"
				}
			},
			"required": ["name", "email", "age"],
			"additionalProperties": false
		},
		"strict": true
	}
}

const createAccount = async (name: string, balance: number) => {
	const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
	const session = driver.session()
	try {
		await session.executeWrite(async tx => {
			const result = await tx.run(`MATCH (u:User) WHERE u.name = $name 
			CREATE (a:Account {account_id: $account_id, balance: $balance})
			CREATE (a)-[r:OPENED_BY]->(u) RETURN a.account_id`, {
					name: name,
					balance: balance,
					account_id: randomInt(0, 10000)
				}
			)

			if(result.records.length > 0) {
				console.log(`Created Account ${result.records[0]}`)
			}
		})
	} finally {
		session.close()
	}
}

const createAccountFunction = {
	"type": "function",
	"function": {
		"name": "createAccount",
		"description": "Create Account for a user",
		"parameters": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"description": "The name of the user to open the account with"
				},
				"balance": {
					"type": "number",
					"description": "The initial account balance the user opens the account with"
				}
			},
			"required": ["name", "balance"],
			"additionalProperties": false
		},
		"strict": true
	}
}

export {
	createUser, createUserFunction,
	createAccount, createAccountFunction
}




