# Outlook Contact Enrichment Add-in

An Outlook add-in that displays additional contact information for email senders.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd outlook-contact-enrichment
```

2. Start the containers
```bash
docker-compose up -d
```

3. Initialize the database:
```bash
docker-compose exec backend python seed_db.py
```

4. Install the add-in in Outlook:
- Go to Outlook settings (⚙️) > View all Outlook settings
- Navigate to Mail > Customize actions > Add-ins
- Click "Add a custom add-in" > "Add from URL"
- Enter: https://localhost:3000/manifest.xml
- Accept any certificate warnings


## Usage

1. Open an email in Outlook
2. Click the "Show Task Pane" button in the ribbon
3. Login with test credentials:
   - Email: test@example.com
  - Password: password123
4. The add-in will display contact information for the email sender