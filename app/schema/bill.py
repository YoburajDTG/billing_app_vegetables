from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BillItemCreate(BaseModel):
    vegetable_id: int
    qty_kg: float
    price_override: Optional[float] = None

class BillCreate(BaseModel):
    customer_name: Optional[str] = None
    items: List[BillItemCreate]

class BillItemResponse(BaseModel):
    vegetable_id: int
    vegetable_name: str
    qty_kg: float
    price: float
    subtotal: float

class BillResponse(BaseModel):
    id: int
    bill_number: str
    shop_name: str
    customer_name: Optional[str]
    total_amount: float
    created_at: datetime
    items: List[BillItemResponse]

    class Config:
        from_attributes = True
