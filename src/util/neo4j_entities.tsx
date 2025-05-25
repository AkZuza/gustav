import { Node, Relationship, Integer } from "neo4j-driver"

// The entities and relationships in the database
interface UserProperties {
	name: string,
	email: string,
	age: number,
}

type User = Node<Integer, UserProperties>

interface AccountProperties {
	account_id: number,
	balance: number
}

type Account = Node<Integer, AccountProperties>

interface BankProperties {
	name: string 
}

type Bank = Node<Integer, BankProperties>

type OpenedBy = Relationship<Integer, {}>

type OpenedIn = Relationship<Integer, {}>

type Transaction = Relationship<Integer, { amount: number }>

export type {
	User, 
	Bank,
	Account,

	OpenedBy,
	OpenedIn,
	Transaction
}
