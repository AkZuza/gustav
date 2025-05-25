import neo4j from "neo4j-driver"
import type { User, Bank, Account, OpenedIn } from "./neo4j_entities"

const driver = neo4j.driver(
	"neo4j://localhost",
	neo4j.auth.basic("neo4j", "byteme@2023")
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
			const result = await tx.run("CREATE (p:User {name: $name, email: $email, age: $age, createdAt: datetime()}) RETURN p.name", {
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

const createAccount = async (name: string, balance: number, bank: string) => {
	const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
	const session = driver.session()
	try {
		await session.executeWrite(async tx => {
			let account_id = null, bankname = null, username = null
			let result

			// Find user and bank first
			result = await tx.run(
				`MATCH (u:User) WHERE u.name = $name RETURN u.name as user`,
				{
					name: name,
				}
			)

			if(result.records.length > 0) {
				username = result.records[0]?.get("user") ?? null
			}

			if (username == null) {
				console.log(`User ${name} does not exist`)
				//throw new Error("User does not exist")
			}

			// Find the bank
			result = await tx.run(
				`MATCH (u:Bank) WHERE u.name = $name RETURN u.name as bank `,
				{
					name: bank,
				}
			)

			if(result.records.length > 0) {
				bankname = result.records[0]?.get("bank") ?? null
			}

			if (bankname == null) {
				console.log(`Bank ${bank} does not exit`)
				//throw new Error("Bank does not exist")
			}

			result = await tx.run(
				`MATCH (u:User) WHERE u.name = $name
				 CREATE (a:Account {account_id: $account_id, balance: $balance, createdAt: datetime()})-[r:OPENED_BY]->(u)
				 RETURN a.account_id as acc_id`,
				{
					name: name,
					account_id: randomInt(0, 500),
					balance: balance
				}
			)

			if (result.records.length > 0) {
				account_id = result.records[0]?.get('acc_id') ?? -1
			}

			if (account_id === -1) {
				console.log(`Failed to open an account`)
				throw new Error("Failed to open account for user")
			} else console.log(`Created account ${account_id}`)

			result = await tx.run(
				`MATCH (b:Bank) WHERE b.name = $bank
				 MATCH (a:Account) WHERE a.account_id = $account_id
				 CREATE (a)-[r:OPENED_IN]->(b)
				 RETURN a.account_id as acc_id`,
				{
					bank: bank,
					account_id: account_id
				}
			)

			if (result.records.length == 0) {
				console.log(`Failed to open the account in the bank`)
				throw new Error("Failed to open account in bank")
			}
		})
	} catch(err) {
		console.log(`createAccount Exception: ${err}`)
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
				},
				"bank": {
					"type": "string",
					"description": "The bank to open the account in"
				}
			},
			"required": ["name", "balance", "bank"],
			"additionalProperties": false
		},
		"strict": true
	}
}

const createBank = async (name: string) => {
	const session = driver.session()

	try {
		const bankName = await session.executeWrite(async tx => {
			let bankName = ""
			let result = await tx.run(
				`CREATE (b:Bank {name: $name, createdAt: datetime()}) RETURN b.name as name`,
				{
					name: name
				}
			)

			if (result.records.length > 0) {
				bankName = result.records[0]?.get('name') ?? ""
			}

			return bankName
		})

		console.log(`Created bank: ${bankName}`)
	} finally {
		session.close()
	}
}

const createBankFunction = {
	"type": "function",
	"function": {
		"name": "createBank",
		"description": "Create a bank",
		"parameters": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"description": "The name of the bank"
				},
			},
			"required": ["name"],
			"additionalProperties": false
		},
		"strict": true
	}
}

const getTransactions = () => {
	
}

const getUsers = () => {

}

const handleFunction = (tool_name: string, args: any) => {
	switch(tool_name) {
		case "createUser": 
			createUser(args.name, args.email, args.age)
			break

		case "createAccount":
			createAccount(args.name, args.balance, args.bank)
			break

		case "createBank":
			createBank(args.name)
			break
	}
}

export {
	handleFunction,
	createUser, createUserFunction,
	createAccount, createAccountFunction,
	createBank, createBankFunction
}


