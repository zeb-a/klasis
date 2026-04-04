#!/bin/bash
set -euo pipefail

# # Load nvm to access Node.js
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Secrets and overrides: create .deploy.env in this folder (gitignored), e.g.
#   DEPLOY_SSH_PASSWORD='your-ssh-password'
# Optional overrides:
#   DEPLOY_USER=root
#   DEPLOY_HOST=47.239.40.131
#   DEPLOY_PATH=/root/pb_public
#
# Requires `sshpass` when using DEPLOY_SSH_PASSWORD:
#   macOS: brew install sshpass
#   Debian/Ubuntu: sudo apt-get install -y sshpass
#
# Prefer SSH keys (ssh-copy-id) so you do not store a password at all:
#   ssh-keygen -t ed25519 -f ~/.ssh/klasiz_deploy
#   ssh-copy-id -i ~/.ssh/klasiz_deploy.pub root@47.239.40.131
#   export RSYNC_RSH='ssh -i ~/.ssh/klasiz_deploy'   # optional explicit key
if [[ -f .deploy.env ]]; then
  # shellcheck disable=SC1091
  source .deploy.env
fi

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_HOST="${DEPLOY_HOST:-47.239.40.131}"
DEPLOY_PATH="${DEPLOY_PATH:-/root/pb_public}"

if [[ -n "${DEPLOY_SSH_PASSWORD:-}" ]]; then
  if ! command -v sshpass &>/dev/null; then
    echo "DEPLOY_SSH_PASSWORD is set but sshpass is not installed."
    echo "  macOS: brew install sshpass"
    echo "  Debian/Ubuntu: sudo apt-get install -y sshpass"
    exit 1
  fi
  export SSHPASS="$DEPLOY_SSH_PASSWORD"
  RSYNC_RSH='sshpass -e ssh -o StrictHostKeyChecking=accept-new'
else
  RSYNC_RSH="${RSYNC_RSH:-ssh -o StrictHostKeyChecking=accept-new}"
fi

echo "Building project..."
npm run build

echo "Syncing to production server..."
rsync -avz --delete -e "$RSYNC_RSH" ./dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "Deployment complete!"
