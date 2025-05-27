#!/bin/bash

# Script to fix CSS paths and add JavaScript to all HTML files

echo "Fixing HTML files..."

# List of HTML files to update (excluding test-animations.html which is already correct)
files=(
    "giraffe.html"
    "thank-you.html" 
    "lion.html"
    "monkey-trail.html"
    "insect-house.html"
    "pizza-shop.html"
    "panda.html"
    "weather.html"
    "animal-detail-template.html"
    "lost-forest.html"
    "warthog.html"
    "monkey.html"
    "feedback.html"
    "restaurant.html"
    "Koala.html"
    "amphitheater.html"
    "gemsbok.html"
    "coffee-shop.html"
    "hippo.html"
    "jungle-gym.html"
    "gorilla.html"
    "elephant.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Fix CSS path from style.css to css/style.css
        sed -i 's|href="style.css"|href="css/style.css"|g' "$file"
        
        # Add JavaScript before closing body tag if not already present
        if ! grep -q "zoo_header_animations.js" "$file"; then
            # Find the line with </body> and insert JavaScript before it
            sed -i 's|</body>|        <!-- Load the spectacular header animations -->\n        <script src="js/zoo_header_animations.js"></script>\n    </body>|g' "$file"
        fi
        
        echo "Fixed $file"
    else
        echo "Warning: $file not found"
    fi
done

echo "All HTML files have been updated!"
echo "Changes made:"
echo "1. Updated CSS path from 'style.css' to 'css/style.css'"
echo "2. Added JavaScript file 'js/zoo_header_animations.js' before closing body tag"
