# Outlook Contact Enrichment Add-in

An Outlook add-in that displays additional contact information for email senders.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [OpenSSL](https://www.openssl.org/)

## Resources / Thoughts
- I used the official outlook addon quickstart guide - 'https://learn.microsoft.com/en-us/office/dev/add-ins/quickstarts/outlook-quickstart-yo'
- I followed a few youtube videos to figure out how to access the add-ins page since it was different for me as I am on Linux and don't have the desktop application
- I used Claude 3.5 Sonnet via Copilot to assist me in quickly building the backend structure and the API endpoints. It was also used to assist in debugging the errors that were thrown when working on the certs.
- I wanted to have the entire thing run from a docker file but it wasnt working for me and I'd rather get a working solution out first and work on that later. Even so the node part is easy to setup (if the user has node installed)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/consumin-helium/outlook-contact-enrichment.git
cd outlook-contact-enrichment
```

2. Generate SSL certificates:
```bash
# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate self-signed certificate and key
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/nginx.key \
  -out ssl/nginx.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

3. Build and run the application:
```bash
docker-compose up --build
# then to populate the db run the following command
docker-compose exec backend python seed_db.py
```

4. Then to start the node server:
```bash
cd "Contact Enrichment"
npm install
npm run dev-server
```

5. Then to accept the certs:
```bash
# Open the browser and navigate to https://localhost:3000 and https://localhost:5000
# You may see a warning about the certificate not being trusted.
# Click on "Advanced" and then "Proceed to localhost (unsafe)".
```

6. Open Outlook and load the add-in:
   - In Outlook, go to **New Mail** > **Insert** > **Apps** > **Get Add-ins** > **My add-ins**.
   - Scoll down and click on **Add a custom add-in** and then
   - Click on **Add from file...** and select the manifest file located in the `Contact Enrichment` directory.

7. Then the outlook add-in should work. Login using the following credentials:
```bash
user:test@example.com
pass:password123
```

8. The add-in will display additional information about the sender of the email, including their name, email address, and any other relevant details. 


## Adding new contacts
1. You can add new contacts by running the following curl commands:
```bash
# First get the JWT token
TOKEN=$(curl -k -X POST https://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r .token)

# Then add a new contact
curl -k -X POST https://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "newcontact@example.com",
    "company": "Example Corp",
    "title": "Software Engineer",
    "linkedin": "linkedin.com/in/newcontact"
  }'
  ```