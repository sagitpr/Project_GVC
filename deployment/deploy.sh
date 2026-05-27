#!/bin/bash

# ==============================================================================
# SMARTSORT AI - GOOGLE CLOUD RUN DEPLOYMENT AUTOMATION
# ==============================================================================
# This script builds and deploys both backend & frontend to GCP Cloud Run.
# Make sure you are authenticated: 'gcloud auth login' and 'gcloud config set project [PROJECT_ID]'

# Exit on error
set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
DB_INSTANCE_NAME="smartsort-db"
AR_REPO_NAME="smartsort-repo"

echo "=============================================================================="
echo "Initializing Cloud Run Deployment for Project: $PROJECT_ID in $REGION"
echo "=============================================================================="

# 1. Enable Required GCP APIs
echo "Enabling GCP API Services..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

# 2. Create Google Artifact Registry Repository if not exists
if ! gcloud artifacts repositories describe $AR_REPO_NAME --location=$REGION &>/dev/null; then
  echo "Creating Artifact Registry Repository: $AR_REPO_NAME..."
  gcloud artifacts repositories create $AR_REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="SmartSort AI Docker Repository"
fi

# 3. Create Secrets in Secret Manager if not exists
echo "Configuring environment secrets..."
create_secret_if_not_exists() {
  SECRET_NAME=$1
  SECRET_VAL=$2
  if ! gcloud secrets describe $SECRET_NAME &>/dev/null; then
    gcloud secrets create $SECRET_NAME --replication-policy="automatic"
    echo -n "$SECRET_VAL" | gcloud secrets versions add $SECRET_NAME --data-file=-
    echo "Secret $SECRET_NAME created and populated."
  else
    echo "Secret $SECRET_NAME already exists."
  fi
}

create_secret_if_not_exists "GEMINI_API_KEY" "AIzaSyDQ-OxVEOVmb9AY3BwFVbG3pYwEW25ZQK4"
create_secret_if_not_exists "JWT_SECRET" "supersecretkeyformvp"

# 4. Build and Push Backend Image to Artifact Registry
echo "Building Backend Docker Image using Cloud Build..."
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO_NAME/backend:latest" \
  --file docker/backend.Dockerfile ./backend

# 5. Deploy Backend to Google Cloud Run
echo "Deploying Backend Container to Google Cloud Run..."
gcloud run deploy smartsort-backend \
  --image "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO_NAME/backend:latest" \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="PORT=5000" \
  --update-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest" \
  --max-instances=5 \
  --min-instances=0 \
  --memory=512Mi

# 6. Retrieve Backend Service URL
BACKEND_URL=$(gcloud run services describe smartsort-backend --region $REGION --format='value(status.url)')
echo "Backend deployed successfully at: $BACKEND_URL"

# 7. Build and Push Frontend Image
echo "Building Frontend Docker Image using Cloud Build..."
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO_NAME/frontend:latest" \
  --file docker/frontend.Dockerfile ./frontend

# 8. Deploy Frontend to Google Cloud Run
echo "Deploying Frontend Container to Google Cloud Run..."
gcloud run deploy smartsort-frontend \
  --image "$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO_NAME/frontend:latest" \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api" \
  --max-instances=5 \
  --min-instances=0 \
  --memory=256Mi

FRONTEND_URL=$(gcloud run services describe smartsort-frontend --region $REGION --format='value(status.url)')

echo "=============================================================================="
echo "DEPLOYMENT COMPLETE SUCCESS!"
echo "Backend API: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "=============================================================================="
