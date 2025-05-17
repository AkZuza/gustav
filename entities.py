from pydantic import BaseModel, Field

class User(BaseModel):
    """User of the model"""
    name: str | None = Field(..., description="The name of the user")
    email: str | None = Field(..., description="The email ")
    age: Int | None = Field(..., description="The age of the user")



class Account(BaseModel):


