# Aura Clock Tab

A beautiful and customizable new tab page with a clock, date, and weather information.

## Features

- 🕒 Digital and analog clock display
- 🌅 Dynamic themes that change throughout the day
- 🎨 Customizable appearance
- 🌍 Multi-language support (i18n)
- 📱 Responsive design
- 🛡️ Enhanced security with strict CSP
- 📊 Error logging and reporting
- 🧪 Built-in test harness
- 💻 Built with TypeScript for better maintainability

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome or any Chromium-based browser

## Installation

1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/aura-clock-tab.git
   cd aura-clock-tab
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Build the extension:
   ```bash
   npm run build
   # or
   yarn build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `dist` directory

## Development

### Project Structure

```
.
├── src/                    # Source files
│   ├── background/         # Background script
│   ├── components/         # UI components
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   ├── background.ts       # Background script entry
│   ├── content.ts          # Content script entry
│   └── newtab.ts           # New tab page entry
├── assets/                 # Static assets
├── _locales/               # Internationalization files
├── dist/                   # Built extension files
├── webpack.config.js       # Webpack configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project configuration
└── README.md               # This file
```

### Development Mode

To start the development server with hot-reloading:

```bash
npm run dev
# or
yarn dev
```

This will watch for changes and automatically rebuild the extension.

### Building for Production

To create a production build:

```bash
npm run build:prod
# or
yarn build:prod
```

The production files will be output to the `dist` directory.

### Testing

Run tests with:

```bash
npm test
# or
yarn test
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## TypeScript Support

This project uses TypeScript for type safety and better developer experience. The codebase is being gradually migrated from JavaScript to TypeScript.

### Migration Strategy

1. New files should be written in TypeScript (`.ts` or `.tsx`)
2. Existing JavaScript files will be gradually migrated to TypeScript
3. TypeScript files are compiled to JavaScript during build
4. `allowJs` is enabled to support incremental migration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [TypeScript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

Tests are automatically run in development mode. You can also run them manually:

```javascript
// In the browser console
TestHarness.run().then(results => {
    console.log('Test results:', results);
});
```

## Security

- Content Security Policy (CSP) is strictly enforced
- All external resources are loaded over HTTPS
- Error logging is local-only by default
- Sensitive operations are sandboxed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Credits

- [Your Name]
- [Contributors]
