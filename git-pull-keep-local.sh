#!/bin/bash

# Git Pull and Merge Script - Always Keep Local Changes
# This script pulls from remote and ensures local changes take priority

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install git first."
        exit 1
    fi
}

# Function to initialize git repository if needed
init_git_if_needed() {
    if [ ! -d ".git" ]; then
        print_warning "No git repository found. Initializing..."
        git init
        print_success "Git repository initialized"

        # Set up basic git config if not set
        if [ -z "$(git config user.name)" ]; then
            print_status "Setting up git user configuration..."
            read -p "Enter your name: " user_name
            read -p "Enter your email: " user_email
            git config user.name "$user_name"
            git config user.email "$user_email"
            print_success "Git user configuration set"
        fi

        return 0
    fi
    return 1
}

# Function to add remote if not exists
setup_remote() {
    local remote_url="$1"

    if [ -z "$remote_url" ]; then
        print_status "No remote URL provided. Checking for existing remotes..."

        # Check if origin remote exists
        if git remote get-url origin &> /dev/null; then
            remote_url=$(git remote get-url origin)
            print_status "Found existing remote: $remote_url"
        else
            print_warning "No remote repository configured."
            read -p "Enter the remote repository URL (or press Enter to skip): " remote_url

            if [ -z "$remote_url" ]; then
                print_warning "No remote URL provided. Skipping remote setup."
                return 1
            fi
        fi
    fi

    # Add or update remote
    if git remote get-url origin &> /dev/null; then
        git remote set-url origin "$remote_url"
        print_status "Updated remote origin URL"
    else
        git remote add origin "$remote_url"
        print_status "Added remote origin"
    fi

    return 0
}

# Function to stage and commit local changes
commit_local_changes() {
    # Check if there are any changes to commit
    if [ -n "$(git status --porcelain)" ]; then
        print_status "Found local changes. Committing them..."

        # Add all changes
        git add .

        # Create commit with timestamp
        local commit_message="Local changes - $(date '+%Y-%m-%d %H:%M:%S')"
        git commit -m "$commit_message"

        print_success "Local changes committed: $commit_message"
        return 0
    else
        print_status "No local changes to commit"
        return 1
    fi
}

# Function to pull and merge with local priority
pull_and_merge() {
    print_status "Fetching from remote repository..."

    # Fetch the latest changes
    if ! git fetch origin; then
        print_error "Failed to fetch from remote repository"
        return 1
    fi

    # Get current branch name
    local current_branch=$(git branch --show-current)
    if [ -z "$current_branch" ]; then
        current_branch="main"
        print_status "No current branch found, using 'main'"
    fi

    # Check if remote branch exists
    if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
        print_warning "Remote branch '$current_branch' not found. Trying 'main'..."
        current_branch="main"

        if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
            print_warning "Remote branch 'main' not found. Trying 'master'..."
            current_branch="master"

            if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
                print_error "No suitable remote branch found (tried: main, master)"
                return 1
            fi
        fi
    fi

    print_status "Using remote branch: origin/$current_branch"

    # Check if we're on the correct branch
    local local_branch=$(git branch --show-current)
    if [ "$local_branch" != "$current_branch" ]; then
        print_status "Switching to branch: $current_branch"
        git checkout -b "$current_branch" 2>/dev/null || git checkout "$current_branch"
    fi

    # Check if there are differences between local and remote
    if git diff --quiet HEAD "origin/$current_branch"; then
        print_success "Local and remote are already in sync"
        return 0
    fi

    print_status "Differences found between local and remote"
    print_status "Merging with local changes taking priority..."

    # Merge with strategy to prefer local changes
    if git merge "origin/$current_branch" -X ours --no-edit; then
        print_success "Successfully merged with local changes preserved"
    else
        print_warning "Merge conflicts detected. Resolving in favor of local changes..."

        # Resolve all conflicts in favor of local changes
        git status --porcelain | grep "^UU" | cut -c4- | while read file; do
            print_status "Resolving conflict in: $file"
            git checkout --ours "$file"
            git add "$file"
        done

        # Complete the merge
        git commit --no-edit
        print_success "Conflicts resolved in favor of local changes"
    fi

    return 0
}

# Function to push changes back to remote
push_changes() {
    local current_branch=$(git branch --show-current)

    print_status "Pushing changes to remote repository..."

    if git push origin "$current_branch"; then
        print_success "Changes pushed successfully"
    else
        print_warning "Failed to push changes. You may need to resolve this manually."
        print_status "Try: git push --force-with-lease origin $current_branch"
    fi
}

# Function to show current status
show_status() {
    print_status "📊 Current Git Status:"
    echo "----------------------------------------"

    # Show current branch
    local current_branch=$(git branch --show-current 2>/dev/null || echo "No branch")
    echo "Current branch: $current_branch"

    # Show remote info
    if git remote get-url origin &> /dev/null; then
        local remote_url=$(git remote get-url origin)
        echo "Remote origin: $remote_url"
    else
        echo "Remote origin: Not configured"
    fi

    # Show commit count
    local commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    echo "Total commits: $commit_count"

    # Show working directory status
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        echo "Working directory: Has uncommitted changes"
    else
        echo "Working directory: Clean"
    fi

    echo "----------------------------------------"
}

# Main execution
main() {
    print_status "🔄 Git Pull and Merge - Keep Local Changes"
    print_status "========================================"

    # Check prerequisites
    check_git

    # Initialize git if needed
    local was_initialized=false
    if init_git_if_needed; then
        was_initialized=true
    fi

    # Show current status
    show_status

    # Setup remote repository
    local remote_url="$1"
    if ! setup_remote "$remote_url"; then
        if [ "$was_initialized" = true ]; then
            print_warning "Git repository initialized but no remote configured"
            print_status "You can add a remote later with: git remote add origin <URL>"
            print_status "Or run this script again with: ./git-pull-keep-local.sh <REMOTE_URL>"
        fi

        # If we have a git repo but no remote, still show final status
        if [ -d ".git" ]; then
            echo ""
            show_status
        fi
        exit 0
    fi

    # Commit any local changes first
    commit_local_changes

    # Pull and merge with local priority
    if pull_and_merge; then
        print_success "✅ Pull and merge completed successfully"

        # Show updated status
        echo ""
        show_status

        # Ask if user wants to push changes
        echo ""
        read -p "Do you want to push the merged changes back to remote? (y/N): " push_confirm
        if [[ $push_confirm =~ ^[Yy]$ ]]; then
            push_changes
        else
            print_status "Changes not pushed. You can push later with: git push"
        fi
    else
        print_error "❌ Pull and merge failed"
        exit 1
    fi

    print_success "🎉 Operation completed!"
    echo ""
    show_status
}

# Run main function with all arguments
main "$@"
