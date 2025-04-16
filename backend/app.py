from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class ContactInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    company = db.Column(db.String(120))
    title = db.Column(db.String(120))
    linkedin = db.Column(db.String(255))

# Create database tables
with app.app_context():
    db.create_all()


@app.route('/api/contact', methods=['POST'])
@jwt_required()
def add_contact():
    data = request.get_json()
    contact = ContactInfo(
        email=data.get('email'),
        company=data.get('company'),
        title=data.get('title'),
        linkedin=data.get('linkedin')
    )
    db.session.add(contact)
    db.session.commit()
    return jsonify({"message": "Contact added successfully"}), 201


@app.route('/api/contacts', methods=['GET'])
@jwt_required()
def list_contacts():
    contacts = ContactInfo.query.all()
    return jsonify([{
        "email": c.email,
        "company": c.company,
        "title": c.title,
        "linkedin": c.linkedin
    } for c in contacts])

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400
    
    new_user = User(
        email=email,
        password=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify({"token": access_token}), 200

@app.route('/api/contact/<email>', methods=['GET'])
@jwt_required()
def get_contact_info(email):
    contact = ContactInfo.query.filter_by(email=email).first()
    if contact:
        return jsonify({
            "company": contact.company,
            "title": contact.title,
            "linkedin": contact.linkedin
        })
    return jsonify({"error": "Contact not found"}), 404


if __name__ == '__main__':
    cert_file = '/app/ssl/nginx.crt'
    key_file = '/app/ssl/nginx.key'
    
    if not os.path.exists(cert_file) or not os.path.exists(key_file):
        print(f"Error: SSL certificates not found at {cert_file} and {key_file}")
        print("Please ensure certificates are mounted correctly")
        exit(1)
        
    app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context=(cert_file, key_file),
        debug=True
    )