from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import uuid
from datetime import datetime
from app.database.database import get_db
from app.models.bill import Bill, BillItem
from app.models.inventory import Inventory
from app.models.vegetable import Vegetable
from app.models.usage import VegetableUsage
from app.models.user import User
from app.schema.bill import BillCreate, BillResponse
from app.core.auth import get_current_user
from app.services.pdf_service import generate_bill_pdf
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/billing")

@router.post("/create", response_model=BillResponse)
async def create_bill(
    bill_in: BillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Start transaction (implicit in FastAPI/SQLAlchemy if we use the same db session)
    try:
        total_amount = 0
        bill_items = []
        
        # Initialize bill
        bill_number = f"BILL-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:4].upper()}"
        db_bill = Bill(
            bill_number=bill_number,
            user_id=current_user.id,
            shop_name=current_user.shop_name or "My Vegetable Shop",
            customer_name=bill_in.customer_name,
            total_amount=0
        )
        db.add(db_bill)
        db.flush() # Get bill ID
        
        for item in bill_in.items:
            # Check inventory
            inv = db.query(Inventory).filter(
                Inventory.user_id == current_user.id,
                Inventory.vegetable_id == item.vegetable_id
            ).with_for_update().first() # Lock for update
            
            if not inv:
                raise HTTPException(status_code=400, detail=f"Vegetable ID {item.vegetable_id} not in inventory")
            
            if inv.stock_kg < item.qty_kg:
                raise HTTPException(
                    status_code=400, 
                    detail=f"குறைந்த இருப்பு: {inv.vegetable.tamil_name if inv.vegetable else 'Item'}. இருப்பில் உள்ளது: {inv.stock_kg}kg"
                )
            
            # Deduct stock
            inv.stock_kg -= item.qty_kg
            
            # Price logic
            price = item.price_override if item.price_override is not None else inv.price_per_kg
            subtotal = price * item.qty_kg
            total_amount += subtotal
            
            # Create bill item
            db_bill_item = BillItem(
                bill_id=db_bill.id,
                vegetable_id=item.vegetable_id,
                vegetable_name=inv.vegetable.name if inv.vegetable else "Unknown",
                qty_kg=item.qty_kg,
                price=price,
                subtotal=subtotal
            )
            db.add(db_bill_item)
            bill_items.append(db_bill_item)
            
            # Update usage
            usage = db.query(VegetableUsage).filter(
                VegetableUsage.user_id == current_user.id,
                VegetableUsage.vegetable_id == item.vegetable_id
            ).first()
            if usage:
                usage.usage_count += 1
            else:
                new_usage = VegetableUsage(
                    user_id=current_user.id,
                    vegetable_id=item.vegetable_id,
                    usage_count=1
                )
                db.add(new_usage)
        
        db_bill.total_amount = total_amount
        db.commit()
        db.refresh(db_bill)
        
        return db_bill
        
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/history", response_model=List[BillResponse])
async def get_billing_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Bill).filter(Bill.user_id == current_user.id).order_by(Bill.created_at.desc()).all()

@router.get("/{bill_id}/pdf")
async def get_bill_pdf_endpoint(
    bill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == current_user.id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    pdf_buffer = generate_bill_pdf(bill)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=bill_{bill.bill_number}.pdf"}
    )
