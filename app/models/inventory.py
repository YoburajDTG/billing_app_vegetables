from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vegetable_id = Column(Integer, ForeignKey("vegetables.id"))
    price_per_kg = Column(Float, nullable=False)
    stock_kg = Column(Float, nullable=False, default=0.0)

    user = relationship("User")
    vegetable = relationship("Vegetable")
