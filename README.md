# Outlook Contact Enrichment Add-in

An Outlook add-in that displays additional contact information for email senders.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [OpenSSL](https://www.openssl.org/)

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
```

4. Then to start the node server:
```bash
cd "Contact Enrichment"
npm install
npm dev-server
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
