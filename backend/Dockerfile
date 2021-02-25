FROM python:3.9.2-slim

WORKDIR /app
COPY ./ ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000