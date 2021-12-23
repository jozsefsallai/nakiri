#!/usr/bin/env bash

function debug_print() {
  if [[ "$DEBUG" == "1" ]]; then
    echo "$1"
  fi
}

if ! which aws > /dev/null 2>&1; then
  debug_print "AWS CLI is not installed. The backup script requires you to install it."
  exit 1
fi

if ! aws sts get-caller-identity > /dev/null 2>&1; then
  debug_print "Please run `aws configure` first to log into AWS."
  exit 1
fi

BUCKET_NAME="${1:-nakiribackup}"

debug_print "Backing up database and environment to S3 bucket: ${BUCKET_NAME}"

SCRIPT_LOCATION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOTENV_LOCATION="${SCRIPT_LOCATION}/../.env"

if [ ! -f "${DOTENV_LOCATION}" ]; then
  debug_print "No .env file found. Please run `cp .env.example .env` and fill in the values."
  exit 1
fi

export $(cat "${DOTENV_LOCATION}" | sed 's/#.*//g' | xargs)

TEMP_DIR="$(mktemp -d)"

debug_print "Creating MySQL database dump..."

mysqldump \
  --host="${DATABASE_HOST}" \
  --port="${DATABASE_PORT}" \
  --user="${DATABASE_USERNAME}" \
  --password="${DATABASE_PASSWORD}" \
  --single-transaction \
  --databases "${DATABASE_NAME}" \
  > "${TEMP_DIR}/nakiri_database.sql"

debug_print "Copying environment file..."

cp "${DOTENV_LOCATION}" "${TEMP_DIR}/.env"

debug_print "Creating archive from ${TEMP_DIR}..."

tar -czf "${TEMP_DIR}/nakiri_backup.tar.gz" -C "${TEMP_DIR}" .

debug_print "Archive created. Uploading to S3..."

CURRENT_TIMESTAMP="$(date +%s)"
aws s3 cp "${TEMP_DIR}/nakiri_backup.tar.gz" \
  "s3://${BUCKET_NAME}/nakiri_backup_${CURRENT_TIMESTAMP}.tar.gz" \
  > /dev/null 2>&1

debug_print "Cleaning up temporary directory..."

rm -rf "${TEMP_DIR}"

debug_print "Done."
