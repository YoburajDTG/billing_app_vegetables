from pydantic import BaseModel
from typing import Optional

class VegetableBase(BaseModel):
    name: str
    tamil_name: str
    image_url: Optional[str] = None
    price_per_kg: float = 0.0

class VegetableCreate(VegetableBase):
    pass

class VegetableResponse(VegetableBase):
    id: int

    class Config:
        from_attributes = True

class TopVegetableResponse(VegetableResponse):
    usage_count: int
