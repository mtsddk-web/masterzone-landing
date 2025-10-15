#!/usr/bin/env python3
"""
Push all files to GitHub repository using GitHub API
This bypasses git push timeout issues
"""

import os
import base64
import json
import subprocess
from pathlib import Path

# Get GitHub token
token = subprocess.check_output(['gh', 'auth', 'token']).decode().strip()

# Repository details
REPO_OWNER = "mtsddk-web"
REPO_NAME = "masterzone-landing"
BRANCH = "main"

# Files to upload (excluding git, node_modules, etc.)
EXCLUDE_DIRS = {'.git', 'node_modules', '.next', '.vercel', 'out', 'build'}
EXCLUDE_FILES = {'.DS_Store', 'push_to_github.py'}

def get_files_to_upload():
    """Get list of all files to upload"""
    files = []
    for root, dirs, filenames in os.walk('.'):
        # Remove excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for filename in filenames:
            if filename in EXCLUDE_FILES:
                continue

            filepath = os.path.join(root, filename)
            # Convert to relative path without leading ./
            relpath = os.path.relpath(filepath, '.').replace('\\', '/')
            files.append(relpath)

    return files

def upload_file(filepath, token):
    """Upload a single file to GitHub using API"""
    import requests

    # Read file content
    with open(filepath, 'rb') as f:
        content = base64.b64encode(f.read()).decode()

    # Prepare API request
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{filepath}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    data = {
        "message": f"Add {filepath}",
        "content": content,
        "branch": BRANCH
    }

    # Upload file
    response = requests.put(url, headers=headers, json=data)

    if response.status_code in [200, 201]:
        print(f"✅ Uploaded: {filepath}")
        return True
    else:
        print(f"❌ Failed: {filepath} - {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        return False

def main():
    print("🚀 Starting upload to GitHub...")
    print(f"📦 Repository: {REPO_OWNER}/{REPO_NAME}")
    print()

    files = get_files_to_upload()
    print(f"📁 Found {len(files)} files to upload")
    print()

    success_count = 0
    failed_count = 0

    for filepath in files:
        try:
            if upload_file(filepath, token):
                success_count += 1
            else:
                failed_count += 1
        except Exception as e:
            print(f"❌ Error uploading {filepath}: {e}")
            failed_count += 1

    print()
    print(f"✅ Uploaded: {success_count}")
    print(f"❌ Failed: {failed_count}")
    print()

    if failed_count == 0:
        print("🎉 All files uploaded successfully!")
    else:
        print(f"⚠️  {failed_count} files failed to upload")

if __name__ == "__main__":
    main()
