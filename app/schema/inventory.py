from pydantic import BaseModel
from typing import List, Optional

class InventorySetupItem(BaseModel):
    vegetable_id: int
    price_per_kg: float
    stock_kg: float

class InventorySetup(BaseModel):
    items: List[InventorySetupItem]

class InventoryUpdate(BaseModel):
    price_per_kg: Optional[float] = None
    stock_kg: Optional[float] = None

class InventoryResponse(BaseModel):
    id: int
    vegetable_id: int
    vegetable_name: str
    tamil_name: str
    price_per_kg: float
    stock_kg: float

    class Config:
        from_attributes = True
