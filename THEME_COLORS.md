# Color Scheme Documentation

This site now uses a comprehensive CSS custom properties system for easy color management and theme switching.

## Color Variables

### Light Theme Colors
- `--primary-bg`: Main background color (#ffffff)
- `--primary-text`: Main text color (#2d3748)
- `--secondary-text`: Secondary text color (#4a5568)
- `--muted-text`: Muted/subtle text color (#718096)
- `--accent-color`: Primary accent color (#2a748c)
- `--accent-hover`: Accent color on hover (#2c5aa0)
- `--border-color`: General border color (#e2e8f0)
- `--code-bg`: Code block background (rgba(0, 0, 0, 0.06))
- `--blockquote-text`: Blockquote text color (#d69e2e)
- `--quote-author`: Quote author color (#ed8936)
- `--about-border`: About section border color (#2a748c)
- `--btn-bg`: Button background (#f7fafc)
- `--btn-hover`: Button hover background (#2a748c)
- `--tooltip-bg`: Tooltip background (#2d3748)
- `--tooltip-text`: Tooltip text color (#e2e8f0)
- `--footer-separator`: Footer separator color (#000000)
- `--menu-selected`: Selected menu item color (#2a748c)
- `--menu-text`: Menu text color (#2d3748)
- `--link-underline`: Link underline color (#2a748c)

### Dark Theme Colors
The dark theme uses the same variable names but with different values optimized for dark backgrounds.

## Features

### Theme Toggle
- Fixed position toggle button in the top-right corner
- Clicking toggles between light and dark modes
- Theme preference is saved in localStorage
- Smooth transitions between themes

### Easy Customization
To change colors, simply modify the CSS custom properties in the `:root` and `[data-theme="dark"]` selectors in `style.css`.

## Usage Examples

### Changing the Accent Color
```css
:root {
  --accent-color: #your-new-color;
}

[data-theme="dark"] {
  --accent-color: #your-new-dark-color;
}
```

### Adding New Color Variables
```css
:root {
  --your-new-color: #value;
}

[data-theme="dark"] {
  --your-new-color: #dark-value;
}
```

Then use it in your CSS:
```css
.your-element {
  color: var(--your-new-color);
}
``` 