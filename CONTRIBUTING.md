# Contributing to Gaia Explorer

Thank you for your interest in contributing to Gaia Explorer! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (browser, OS, device)

### Suggesting Enhancements

We welcome suggestions for enhancements! Please create an issue with:
- A clear, descriptive title
- A detailed description of the enhancement
- Any relevant mockups or examples
- Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style and conventions
- Update documentation as needed
- Add or update tests as appropriate
- Keep pull requests focused on a single feature or bug fix
- Link related issues in your pull request description

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env.local` file based on `.env.example`
4. Start the development server:
```bash
npm run dev
```

## Adding New News Sources

When adding new news sources to the news scraper, please follow these guidelines:

1. Check if the source provides an RSS feed first (preferred method)
2. For non-RSS sources, determine if simple HTTP scraping will work or if Puppeteer is needed
3. Test your source with a small sample before submitting
4. Include selectors or parser configuration for the new source
5. Document the new source in your PR

## Code Style and Standards

- Follow TypeScript best practices
- Use functional components with hooks for React components
- Follow the existing project architecture
- Use descriptive variable and function names
- Comment complex logic
- Write meaningful commit messages

## Testing

- Write tests for new features
- Run existing tests before submitting PRs:
```bash
npm test
```

## License

By contributing to Gaia Explorer, you agree that your contributions will be licensed under the project's MIT License. 