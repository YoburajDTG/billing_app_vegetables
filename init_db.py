import sys
import os
from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine, Base
from app.utils.seed_vegetables import seed_vegetables
from app.models.user import User, UserRole
from app.core.auth import get_password_hash

# Ensure we are in the root directory for imports
sys.path.append(os.getcwd())

def setup_dev_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed Vegetables
        print("Seeding vegetables...")
        seed_vegetables(db)
        
        # 2. Create Admin User
        print("Creating admin user...")
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN
            )
            db.add(admin)
            db.commit()
            print("Admin user 'admin' created with password 'admin123'")
        else:
            print("Admin user already exists")
            
    finally:
        db.close()

if __name__ == "__main__":
    setup_dev_db()
