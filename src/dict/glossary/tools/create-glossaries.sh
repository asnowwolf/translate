#!/usr/bin/env sh

cd $(dirname $0)/../requests

curl -X DELETE \
  -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
  -H "x-goog-user-project: ralph-gde" \
  "https://translation.googleapis.com/v3/projects/ralph-gde/locations/us-central1/glossaries/angular"

curl -X POST \
  -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "x-goog-user-project: ralph-gde" \
  -d @angular.json \
  "https://translation.googleapis.com/v3/projects/ralph-gde/locations/us-central1/glossaries"

curl -X DELETE \
  -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
  -H "x-goog-user-project: ralph-gde" \
  "https://translation.googleapis.com/v3/projects/ralph-gde/locations/us-central1/glossaries/material"

curl -X POST \
  -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "x-goog-user-project: ralph-gde" \
  -d @material.json \
  "https://translation.googleapis.com/v3/projects/ralph-gde/locations/us-central1/glossaries"

curl -X DELETE \
  -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
  -H "x-goog-user-project: ralph-gde" \
  "https://translation.googleapis.com/v3/projects/ralph-gde/locations/us-central1/glossaries/spring"

curl -X POST \
  -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "x-goog-user-project: ralph-gde" \
  -d @spring.json \
  "https://translation.googleapis.com/v3/projects/ralph-gde/locations/us-central1/glossaries"
