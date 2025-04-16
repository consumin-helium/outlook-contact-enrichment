from app import app, db, ContactInfo, User
from werkzeug.security import generate_password_hash

def seed_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create test user
        test_user = User(
            email="test@example.com",
            password=generate_password_hash("password123")
        )
        
        # Create sample contact
        contact = ContactInfo(
            email="rednaxelanosbor@gmail.com",
            company="Diginal",
            title="Intermediate Developer",
            linkedin="linkedin.com/in/rednaxelanosbor"
        )
        
        # Add to database
        db.session.add(test_user)
        db.session.add(contact)
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()