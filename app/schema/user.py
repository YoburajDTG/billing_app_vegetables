from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    shop_name: Optional[str] = None
    role: UserRole = UserRole.SHOP_USER

class UserResponse(UserBase):
    id: int
    role: UserRole
    shop_name: Optional[str] = None

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str
