# Okta React App - Harley-Davidson Style Guide

## Design Philosophy

The application has been styled to match the bold, confident aesthetic of Harley-Davidson's brand identity - featuring high-contrast design, dramatic typography, and a powerful black/white/orange color scheme.

## Color Palette

### Primary Colors
- **Black**: `#000000` - Primary background color, representing power and sophistication
- **Dark Gray**: `#1a1a1a` - Card backgrounds and secondary surfaces
- **White**: `#ffffff` - Primary text color for maximum contrast

### Accent Colors
- **Harley Orange**: `#fa6600` - Primary accent for CTAs, highlights, and interactive elements
- **Dark Orange**: `#e65200` - Hover state for orange elements

### Neutral Colors
- **Medium Gray**: `#757575` - Secondary text and subtle content
- **Border Gray**: `#4e4e4e` - Borders and dividing lines

## Typography

### Font Family
- **Primary**: Helvetica Neue, Helvetica, Arial, sans-serif
- **Monospace**: Courier New, monospace (for code/tokens)

### Font Weights
- **900**: Extra Bold - Used for all headings (h1-h6) to create dramatic impact
- **700**: Bold - Used for buttons, labels, and navigation items
- **600**: Semi-Bold - Used for user names and secondary emphasis
- **400**: Regular - Used for body text and descriptions

### Type Scale
- **Hero Titles**: 4rem (64px) - Main page headings, uppercase
- **Page Titles**: 3rem (48px) - Section headings, uppercase
- **Section Titles**: 2rem (32px) - Subsection headings, uppercase
- **Card Titles**: 1.75rem (28px) - Feature cards, uppercase
- **Body Large**: 1.5rem (24px) - Descriptions and intro text
- **Body Regular**: 1rem (16px) - Standard content
- **Small**: 0.875rem (14px) - Labels and navigation

### Text Styling
- **Letter Spacing**: -0.02em for large headings, 0.05em for uppercase text
- **Line Height**: 1.1 for headings, 1.6 for body text
- **Text Transform**: UPPERCASE for all headings, buttons, and labels

## Button Styles

### Primary Button (Orange)
```css
background: #fa6600;
color: #ffffff;
border: 2px solid #fa6600;
padding: 16px 48px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
```

**Hover State:**
```css
background: #e65200;
border-color: #e65200;
transform: translateY(-2px);
box-shadow: 0 8px 16px rgba(250, 102, 0, 0.3);
```

### Secondary Button (White Outline)
```css
background: transparent;
color: #ffffff;
border: 2px solid #ffffff;
```

**Hover State:**
```css
background: #ffffff;
color: #000000;
```

## Component Styles

### Navbar
- **Background**: Black (#000000)
- **Border**: 1px solid #4e4e4e on bottom
- **Height**: Auto with 1.5rem (24px) vertical padding
- **Max Width**: 1360px (centered)
- **Logo**: Uppercase, 900 weight, turns orange on hover
- **Links**: Uppercase, 700 weight, underline appears on hover in orange
- **Position**: Sticky at top

### Cards
- **Background**: #1a1a1a
- **Border**: 1px solid #4e4e4e
- **Border Hover**: Changes to orange (#fa6600)
- **Padding**: 2-3rem depending on context
- **No Border Radius**: Sharp corners for bold aesthetic

### Feature Cards
- **Orange Top Border**: Animates from 0 to 100% width on hover
- **Lift Effect**: Transform translateY(-5px) on hover
- **Title**: Uppercase, 900 weight
- **Description**: Gray (#757575) for hierarchy

### Form Elements
- **Input Backgrounds**: #1a1a1a
- **Input Borders**: 1px solid #4e4e4e
- **Focus State**: Orange border (#fa6600)
- **Labels**: Uppercase, orange (#fa6600), 700 weight

## Layout

### Container Widths
- **Narrow**: 600px (Login)
- **Medium**: 1000-1200px (Profile, Home)
- **Wide**: 1360px (Tokens, Navbar)

### Spacing Scale
- **XS**: 0.5rem (8px)
- **SM**: 1rem (16px)
- **MD**: 1.5rem (24px)
- **LG**: 2rem (32px)
- **XL**: 3rem (48px)
- **XXL**: 4rem (64px)

### Padding
- **Desktop Horizontal**: 2rem (32px)
- **Mobile Horizontal**: 1.875rem (30px)
- **Card Internal**: 2-3rem (32-48px)

## Interactive States

### Hover
- **Links**: Color changes to orange, subtle underline appears
- **Buttons**: Background darkens, slight lift (translateY(-2px))
- **Cards**: Border changes to orange, lift effect
- **Orange Elements**: Darken to #e65200

### Transitions
- **Standard**: `all 0.3s ease`
- **Border Width Animation**: `width 0.3s ease`
- **Color Changes**: `color 0.3s ease`

## Responsive Breakpoints

### Mobile (max-width: 768px)
- Stack navigation vertically
- Single column grids
- Reduced font sizes (hero: 2.5rem, titles: 2rem)
- Reduced padding (1.875rem horizontal)
- Simplified layouts

## Scrollbar

### Styling
- **Width**: 12px
- **Track**: #1a1a1a (dark gray)
- **Thumb**: #fa6600 (orange)
- **Thumb Hover**: #e65200 (dark orange)
- **Border Radius**: 0 (sharp corners)

## Special Effects

### Orange Accent Bars
Used on section headings:
- 3px solid orange border on bottom
- Creates strong visual hierarchy

### Hover Underlines
Used on navigation links:
- 2px orange bar appears below text
- Positioned 5px below text baseline

### Shadow Effects
Orange glow on primary button hover:
```css
box-shadow: 0 8px 16px rgba(250, 102, 0, 0.3);
```

## Usage Guidelines

### DO:
✓ Use uppercase for all headings and labels
✓ Maintain high contrast (black/white)
✓ Use orange sparingly for maximum impact
✓ Keep sharp corners (no border-radius except scrollbar)
✓ Use bold, confident typography (900 weight for headings)
✓ Create dramatic size contrasts
✓ Use transform effects for hover states

### DON'T:
✗ Use soft, rounded corners
✗ Use pastels or muted colors
✗ Use light backgrounds
✗ Use thin font weights for headings
✗ Overuse orange - it should be an accent
✗ Use subtle, timid design elements
✗ Mix lowercase and uppercase inconsistently

## Accessibility

- **Contrast Ratio**: Exceeds WCAG AA standards (white on black)
- **Focus States**: Clear visual indicators
- **Font Sizes**: Large enough for readability
- **Interactive Elements**: Minimum 44x44px touch targets
- **Semantic HTML**: Proper heading hierarchy

## Brand Alignment

This design captures the Harley-Davidson essence:
- **Bold**: High contrast, dramatic typography
- **Confident**: Strong shapes, uppercase text
- **Premium**: Clean, sophisticated layout
- **Powerful**: Dark backgrounds, commanding presence
- **Iconic**: Orange accent creates instant recognition
