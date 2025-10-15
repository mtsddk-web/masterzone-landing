#!/bin/bash

# Upload all project files to GitHub using API
# This bypasses git push timeout issues

REPO_OWNER="mtsddk-web"
REPO_NAME="masterzone-landing"
BRANCH="main"
TOKEN=$(gh auth token)

echo "🚀 Uploading files to GitHub..."
echo "📦 Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Get list of all files (excluding certain directories)
find . -type f \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.vercel/*" \
  -not -path "./out/*" \
  -not -name ".DS_Store" \
  -not -name "upload_to_github.sh" \
  -not -name "push_to_github.py" \
  -not -name "TEST.md" |
while read filepath; do
  # Remove leading ./
  clean_path="${filepath#./}"

  echo "📤 Uploading: $clean_path"

  # Read file and encode to base64
  content=$(base64 -i "$filepath")

  # Check if file already exists
  existing=$(curl -s \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/contents/$clean_path")

  sha=$(echo "$existing" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('sha', ''))" 2>/dev/null)

  # Prepare JSON payload
  if [ -n "$sha" ]; then
    # File exists, update it
    json_payload=$(jq -n \
      --arg msg "Update $clean_path" \
      --arg content "$content" \
      --arg sha "$sha" \
      '{message: $msg, content: $content, sha: $sha}')
  else
    # File doesn't exist, create it
    json_payload=$(jq -n \
      --arg msg "Add $clean_path" \
      --arg content "$content" \
      '{message: $msg, content: $content}')
  fi

  # Upload file
  response=$(curl -s -X PUT \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/contents/$clean_path" \
    -d "$json_payload")

  # Check if successful
  if echo "$response" | grep -q '"sha"'; then
    echo "✅ Success: $clean_path"
  else
    echo "❌ Failed: $clean_path"
    echo "$response" | head -n 3
  fi

  # Rate limiting - wait a bit between uploads
  sleep 0.5
done

echo ""
echo "🎉 Upload complete!"
