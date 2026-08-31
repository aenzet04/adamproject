#!/bin/bash
# 🔄 Auto Git Sync Daemon
# Automatically detects file modifications, commits with timestamp, and pushes to origin main.

INTERVAL=15 # Check every 15 seconds

echo "🚀 [Auto-Git-Sync] Watching repository for changes..."
echo "📍 Target Remote: $(git remote get-url origin)"

while true; do
  # Check if there are modified, added, or deleted files
  if [[ -n $(git status --porcelain) ]]; then
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "⚡ [Auto-Git-Sync] Changes detected at ${TIMESTAMP}. Committing..."
    git add .
    git commit -m "chore(auto-sync): update ${TIMESTAMP}"
    
    echo "📤 [Auto-Git-Sync] Pushing to GitHub (origin main)..."
    git push origin main
    
    if [ $? -eq 0 ]; then
      echo "✅ [Auto-Git-Sync] Successfully synced with GitHub!"
    else
      echo "⚠️ [Auto-Git-Sync] Push failed, retrying on next cycle."
    fi
  fi
  sleep $INTERVAL
done
