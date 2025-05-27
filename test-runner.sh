#!/bin/bash

# Pine City Zoo Website Testing Script
# This script runs all tests for the Pine City Zoo website

set -e  # Exit on any error

echo "🦁 Pine City Zoo Website Testing Suite 🦁"
echo "=========================================="

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

# Check if dependencies are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing npm dependencies..."
        npm install
    fi
    
    print_success "Dependencies are ready!"
}

# Start local server
start_server() {
    print_status "Starting local server on port 8080..."
    
    # Kill any existing server on port 8080
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    
    # Start server in background
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8080 > /dev/null 2>&1 &
    elif command -v python &> /dev/null; then
        python -m http.server 8080 > /dev/null 2>&1 &
    else
        print_error "Python is not installed. Cannot start local server."
        exit 1
    fi
    
    SERVER_PID=$!
    sleep 2
    
    # Check if server is running
    if curl -s http://localhost:8080 > /dev/null; then
        print_success "Server started successfully (PID: $SERVER_PID)"
    else
        print_error "Failed to start server"
        exit 1
    fi
}

# Stop local server
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        print_status "Stopping local server..."
        kill $SERVER_PID 2>/dev/null || true
        lsof -ti:8080 | xargs kill -9 2>/dev/null || true
        print_success "Server stopped"
    fi
}

# Trap to ensure server is stopped on script exit
trap stop_server EXIT

# Run HTML validation
test_html() {
    print_status "🧱 Running HTML validation..."
    if npx html-validate *.html; then
        print_success "HTML validation passed!"
    else
        print_error "HTML validation failed!"
        return 1
    fi
}

# Run CSS validation
test_css() {
    print_status "🎨 Running CSS validation..."
    if npx stylelint "**/*.css"; then
        print_success "CSS validation passed!"
    else
        print_error "CSS validation failed!"
        return 1
    fi
}

# Run accessibility tests
test_accessibility() {
    print_status "♿ Running accessibility tests..."
    if npx pa11y-ci; then
        print_success "Accessibility tests passed!"
    else
        print_error "Accessibility tests failed!"
        return 1
    fi
}

# Run visual regression tests
test_visual() {
    print_status "🖼 Running visual regression tests..."
    
    # Check if reference images exist
    if [ ! -d "backstop_data/bitmaps_reference" ] || [ -z "$(ls -A backstop_data/bitmaps_reference 2>/dev/null)" ]; then
        print_warning "No reference images found. Creating reference images..."
        if npx backstop reference; then
            print_success "Reference images created!"
            print_status "Skipping visual comparison (no baseline to compare against)"
            return 0
        else
            print_error "Failed to create reference images!"
            return 1
        fi
    fi
    
    if npx backstop test; then
        print_success "Visual regression tests passed!"
    else
        print_warning "Visual regression tests failed! Check the report for details."
        print_status "Opening visual test report..."
        # The report should automatically open in browser
        return 1
    fi
}

# Main execution
main() {
    echo ""
    print_status "Starting test suite..."
    
    check_dependencies
    start_server
    
    # Initialize test results
    TESTS_PASSED=0
    TESTS_FAILED=0
    
    # Run tests
    echo ""
    if test_html; then
        ((TESTS_PASSED++))
    else
        ((TESTS_FAILED++))
    fi
    
    echo ""
    if test_css; then
        ((TESTS_PASSED++))
    else
        ((TESTS_FAILED++))
    fi
    
    echo ""
    if test_accessibility; then
        ((TESTS_PASSED++))
    else
        ((TESTS_FAILED++))
    fi
    
    echo ""
    if test_visual; then
        ((TESTS_PASSED++))
    else
        ((TESTS_FAILED++))
    fi
    
    # Print summary
    echo ""
    echo "=========================================="
    echo "🦁 Test Suite Summary 🦁"
    echo "=========================================="
    print_success "Tests passed: $TESTS_PASSED"
    if [ $TESTS_FAILED -gt 0 ]; then
        print_error "Tests failed: $TESTS_FAILED"
        echo ""
        print_status "To fix visual regression issues, run: npm run test:visual:approve"
        exit 1
    else
        print_success "All tests passed! 🎉"
        echo ""
        print_status "Your Pine City Zoo website is ready for production!"
    fi
}

# Run main function
main "$@"
