from app.database.database import engine
from sqlalchemy import text
import sys
import os

# Add current directory to path so we can import app
sys.path.append(os.getcwd())

def add_column():
    print("Attempting to add 'discount_amount' column to 'bills' table...")
    try:
        with engine.connect() as conn:
            # Check if column exists first to avoid errors if logic below is slighty off, 
            # though IF NOT EXISTS handles it in newer Postgres/SQL dialects.
            # But standard SQL often supports ADD COLUMN IF NOT EXISTS.
            # Postgres supports it.
            conn.execute(text("ALTER TABLE bills ADD COLUMN IF NOT EXISTS discount_amount DOUBLE PRECISION DEFAULT 0.0;"))
            conn.commit()
            print("Migration successful: Added discount_amount column.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    add_column()
