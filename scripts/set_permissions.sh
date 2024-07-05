#!/bin/sh

# Set execute permissions for node_modules binaries
chmod +x ./node_modules/.bin/*

# Set execute permissions for any other scripts if needed
chmod +x ./.github/scripts/backend_decrypt.sh

chmod +x set_permissions.sh
git add set_permissions.sh
git commit -m "Add script to set execute permissions"
git push
