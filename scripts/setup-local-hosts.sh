#!/bin/sh
# Maps NovexaHub domains to localhost for testing before Cloudflare DNS goes live.
# Run once: sudo sh scripts/setup-local-hosts.sh

MARKER="# NovexaHub local testing"

if grep -q "$MARKER" /etc/hosts 2>/dev/null; then
  echo "NovexaHub hosts entries already present."
  exit 0
fi

cat >> /etc/hosts <<'EOF'

# NovexaHub local testing
127.0.0.1 novexahub.net
127.0.0.1 www.novexahub.net
127.0.0.1 admin.novexahub.net
127.0.0.1 admin.localhost
EOF

echo "Added NovexaHub entries to /etc/hosts"
tail -6 /etc/hosts
