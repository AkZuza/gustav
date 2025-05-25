from pydantic import BaseModel, Field

class User(BaseModel):
    """User Model"""
    name: str | None = Field(..., description="The name of the user")
    email: str | None = Field(..., description="The email ")
    age: int | None = Field(..., description="The age of the user")

class Account(BaseModel):
    """Account Model"""
    owner: str | None = Field(..., description="The name of the user the account is for")
    bank: str | None = Field(..., description="Name of the bank the account is opened in")
    uuid: str | None = Field(..., description="UUID of the Account")
    balance: float | None = Field(..., description="Balance in the account")
    createdOn: str | None = Field(..., description="The date it was created on")

class Transaction(BaseModel):
    """Transaction Model"""
    fro: str | None = Field(..., description="UUID of the account amount is being transferred from")
    to: str | None = Field(..., description="UUID of the account amount is being transaferred to")
    amount: float | None = Field(..., description="Amount transferred")


class Bank(BaseModel):
    """Bank Model"""
    name: str | None = Field(..., description="Bank name")

entities = { "User": User, "Account": Account, "Transaction": Transaction, "Bank": Bank}
