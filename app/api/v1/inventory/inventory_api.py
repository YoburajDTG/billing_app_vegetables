from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.inventory import Inventory
from app.models.vegetable import Vegetable
from app.models.user import User
from app.schema.inventory import InventorySetup, InventoryResponse, InventoryUpdate
from app.core.auth import get_current_user

router = APIRouter(prefix="/inventory")

@router.post("/setup")
async def setup_inventory(
    setup_in: InventorySetup,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for item in setup_in.items:
        # Check if vegetable exists
        veg = db.query(Vegetable).filter(Vegetable.id == item.vegetable_id).first()
        if not veg:
            continue
        
        # Check if already in inventory
        existing = db.query(Inventory).filter(
            Inventory.user_id == current_user.id,
            Inventory.vegetable_id == item.vegetable_id
        ).first()
        
        if existing:
            existing.price_per_kg = item.price_per_kg
            existing.stock_kg = item.stock_kg
        else:
            new_inv = Inventory(
                user_id=current_user.id,
                vegetable_id=item.vegetable_id,
                price_per_kg=item.price_per_kg,
                stock_kg=item.stock_kg
            )
            db.add(new_inv)
    
    db.commit()
    return {"message": "Inventory setup successfully"}

@router.get("/", response_model=List[InventoryResponse])
async def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_items = db.query(Inventory).filter(Inventory.user_id == current_user.id).all()
    
    result = []
    for item in inventory_items:
        veg = db.query(Vegetable).filter(Vegetable.id == item.vegetable_id).first()
        result.append({
            "id": item.id,
            "vegetable_id": item.vegetable_id,
            "vegetable_name": veg.name if veg else "Unknown",
            "tamil_name": veg.tamil_name if veg else "Unknown",
            "price_per_kg": item.price_per_kg,
            "stock_kg": item.stock_kg
        })
    return result

@router.post("/update/{veg_id}")
async def update_inventory(
    veg_id: int,
    update_in: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Inventory).filter(
        Inventory.user_id == current_user.id,
        Inventory.vegetable_id == veg_id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in inventory")
    
    if update_in.price_per_kg is not None:
        item.price_per_kg = update_in.price_per_kg
    if update_in.stock_kg is not None:
        item.stock_kg = update_in.stock_kg
        
    db.commit()
    return {"message": "Inventory updated successfully"}
