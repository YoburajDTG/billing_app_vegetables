from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.bill import Bill
from app.models.user import User
from app.schema.bill import BillResponse
from app.core.auth import get_current_user

router = APIRouter(prefix="/billing")

@router.get("/history", response_model=List[BillResponse])
async def get_billing_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Bill).filter(Bill.user_id == current_user.id).order_by(Bill.created_at.desc()).all()

@router.get("/{bill_id}", response_model=BillResponse)
async def get_bill_detail(
    bill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch details for the Bill Summary page.
    """
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == current_user.id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill
