FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port
EXPOSE 8000

# Run FastAPI app with dynamic port fallback to 8000
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

