FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Make sure app.py is executable and fix line endings
RUN chmod +x app.py && \
    sed -i 's/\r$//' app.py

# Run Flask with proper host binding
CMD ["flask", "run", "--host=0.0.0.0"]