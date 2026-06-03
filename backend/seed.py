"""
Run once to seed demo walkers:
  python seed.py
"""
import asyncio
from app.db.session import AsyncSessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.walker import WalkerProfile
from app.core.security import hash_password

WALKERS = [
    dict(email="yonatan@dogivo.co.il", full_name="יונתן כהן", password="demo1234",
         bio="מטייל כלבים מוסמך עם ניסיון של 4 שנים. אוהב כלבים מכל הגזעים.",
         price=45, city="תל אביב", lat=32.0853, lon=34.7818, rating=4.9, reviews=38, exp=4),
    dict(email="michal@dogivo.co.il", full_name="מיכל לוי", password="demo1234",
         bio="סטודנטית לוטרינריה, מטיילת כלבים 3 שנים. מדווחת עם תמונות.",
         price=40, city="רמת גן", lat=32.0824, lon=34.8113, rating=4.8, reviews=21, exp=3),
    dict(email="uri@dogivo.co.il", full_name="אורי גולדברג", password="demo1234",
         bio="מאלף כלבים מקצועי. מתמחה בכלבים עם צרכים מיוחדים.",
         price=50, city="הרצליה", lat=32.1663, lon=34.8438, rating=5.0, reviews=14, exp=6),
    dict(email="noa@dogivo.co.il", full_name="נועה שפירא", password="demo1234",
         bio="אוהבת כלבים מילדות. מטיילת בפארק הירקון כל יום.",
         price=35, city="תל אביב", lat=32.1010, lon=34.7990, rating=4.7, reviews=9, exp=2),
]


async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        for w in WALKERS:
            from sqlalchemy import select
            existing = await db.execute(select(User).where(User.email == w["email"]))
            if existing.scalar_one_or_none():
                print(f"Skip {w['email']} — already exists")
                continue

            user = User(
                email=w["email"],
                full_name=w["full_name"],
                hashed_password=hash_password(w["password"]),
                role=UserRole.WALKER,
                is_verified=True,
                is_active=True,
            )
            db.add(user)
            await db.flush()

            profile = WalkerProfile(
                user_id=user.id,
                bio=w["bio"],
                price_per_hour=w["price"],
                city=w["city"],
                latitude=w["lat"],
                longitude=w["lon"],
                rating=w["rating"],
                total_reviews=w["reviews"],
                years_experience=w["exp"],
                is_available=True,
            )
            db.add(profile)
            print(f"Created walker: {w['full_name']}")

        await db.commit()
    print("Done!")


if __name__ == "__main__":
    asyncio.run(main())
