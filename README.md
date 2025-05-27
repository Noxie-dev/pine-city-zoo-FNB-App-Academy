# Pine City Zoo Mobile App

<div align="center">

<img src="images/fnb-aoty-logo.png" alt="FNB App Academy Logo" width="200"/>
<img src="images/ITv-Logo.png" alt="IT Varsity Logo" width="200"/>

<br><br>

<img src="images/logo.png" alt="Pine City Zoo Logo" width="300"/>

</div>

## Project Overview

This mobile web application provides visitors to Pine City Zoo with an interactive guide to enhance their zoo experience. The app allows users to explore information about animals, navigate the zoo using an interactive map, discover various places of interest, check weather conditions, and provide feedback.

## Features

- **Animals Section**: Information about various animals in the zoo including elephants, giraffes, gorillas, koalas, lions, monkeys, pandas, and warthogs
- **Interactive Map**: Navigate the zoo grounds with an easy-to-use map
- **Places of Interest**: Discover amenities and attractions such as:
  - Garden Amphitheater
  - Coffee Shop
  - Lost Forest
  - Monkey Trail
  - Insect House
  - Restaurants and Food Options
- **Weather Information**: Check current weather conditions at the zoo
- **Feedback System**: Provide comments and suggestions about your zoo experience

## Technologies Used

- HTML5
- CSS3
- Responsive design for mobile devices
- Image optimization for faster loading

## Project Structure

```
Pine City Zoo/
│
├── index.html          # Main entry point of the application
├── style.css           # Styling for the entire application
├── README.md           # Project documentation (this file)
│
└── images/             # Directory containing all image assets
    ├── logo.png        # Zoo logo
    ├── map.png         # Zoo map
    ├── wood-bg.png     # Background texture
    ├── animal images   # Various animal photos
    ├── location images # Photos of zoo locations
    └── weather icons   # Weather condition icons
```

## Setup Instructions

1. Clone or download this repository to your local machine
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open http://localhost:8080 in your browser
5. For the best experience, use a mobile device or toggle device emulation in your browser's developer tools

## 🧪 Testing Suite

This project includes a comprehensive testing suite to ensure code quality, accessibility, and cross-browser compatibility.

### Available Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run basic tests (HTML, CSS, Accessibility) |
| `npm run test:html` | Validate HTML markup |
| `npm run test:css` | Validate CSS styles |
| `npm run test:a11y` | Run accessibility tests |
| `npm run test:visual` | Run visual regression tests |
| `npm run test:cross-browser` | Test across different browsers |
| `npm run test:lighthouse` | Run Lighthouse performance audit |
| `npm run test:all` | Run all automated tests |
| `npm run test:full` | Run complete test suite with server |

### 🧱 HTML Validation

Uses `html-validate` to check for:
- Valid HTML5 markup
- Proper tag nesting
- Missing alt attributes
- Accessibility issues
- Semantic HTML usage

### 🎨 CSS Validation

Uses `stylelint` to check for:
- CSS syntax errors
- Best practices
- Consistent formatting
- Performance issues
- Browser compatibility

### ♿ Accessibility Testing

Uses `pa11y` to test against WCAG 2.1 AA standards:
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- Form labels
- ARIA attributes

### 🖼 Visual Regression Testing

Uses `BackstopJS` to detect visual changes:
- Cross-device testing (mobile, tablet, desktop)
- Layout consistency
- UI component integrity
- Hover states and interactions

**Commands:**
```bash
npm run test:visual:reference  # Create baseline images
npm run test:visual           # Compare against baseline
npm run test:visual:approve   # Approve visual changes
```

### 🌐 Cross-Browser Testing

Uses `Puppeteer` to test across browsers:
- Chrome and Firefox compatibility
- JavaScript error detection
- Image loading verification
- CSS rendering consistency

### 🚀 Performance Testing

Uses `Lighthouse CI` to audit:
- Performance metrics
- Best practices
- SEO optimization
- Progressive Web App features

## 📊 Test Reports

Test results are generated in multiple formats:

- **Visual Tests:** `backstop_data/html_report/index.html`
- **Cross-Browser:** `cross-browser-report.html`
- **Lighthouse:** `.lighthouseci/` directory
- **Accessibility:** Console output and CI artifacts

## 🔧 Development Workflow

1. **Make changes** to HTML/CSS files
2. **Run tests** to catch issues early: `npm run test:full`
3. **Fix any issues** reported by the tests
4. **Create visual baselines** if layout changes are intentional: `npm run test:visual:reference`
5. **Commit changes** once all tests pass

## Responsive Design

The application is designed to work on mobile devices with:
- Fixed navigation at top and bottom
- Responsive image sizing
- Touch-friendly navigation elements

## Future Enhancements

- Animal search functionality
- Event calendar integration
- Ticket purchasing system
- User accounts for personalized experiences
- Push notifications for feeding times and special events

## Assignment Information

- **Course**: FNB App Academy
- **Project**: Pine City Zoo Mobile Application
- **Focus**: Mobile web development with HTML and CSS

## Screenshots

The application features a clean, intuitive interface with:
- Top navigation for main sections (Animals, Map, Places)
- Bottom navigation for utilities (Weather, Feedback)
- Full-width map display on the home screen

## License

This project was created for educational purposes as part of the FNB App Academy curriculum.

---

© 2023 Pine City Zoo App | FNB App Academy
