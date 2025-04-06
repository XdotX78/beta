# Publishing to GitHub

This document provides instructions for publishing this project to GitHub.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Basic familiarity with Git commands

## Steps to Publish

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com/) and sign in
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "gaia-explorer")
4. Add a description (optional)
5. Choose whether to make the repository public or private
6. Do NOT initialize the repository with a README, .gitignore, or license (we've already set these up)
7. Click "Create repository"

### 2. Connect Local Repository to GitHub

After creating the repository, GitHub will show instructions. Follow the ones for "push an existing repository":

```bash
# Add the GitHub repository as a remote named "origin"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Push your local repository to GitHub
git push -u origin master
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your GitHub username and the name you gave your repository.

### 3. Verify Your Repository

1. Refresh the GitHub page
2. You should see all your project files along with:
   - README.md displayed at the bottom of the page
   - LICENSE file recognized by GitHub
   - Issue templates available when you click on "Issues" → "New issue"
   - Pull request template when creating a new pull request
   - GitHub Actions workflow set up under the "Actions" tab

## Additional Configuration

### Branch Protection Rules

To ensure code quality, consider setting up branch protection rules:

1. Go to your repository on GitHub
2. Click "Settings" → "Branches"
3. Under "Branch protection rules", click "Add rule"
4. In the "Branch name pattern" field, enter "master" or "main"
5. Configure the following options:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
6. Click "Create" or "Save changes"

### Repository Visibility

If you initially created a private repository but want to make it public (or vice versa):

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to the "Danger Zone"
4. Click "Change repository visibility"
5. Select the desired visibility and confirm

## Final Checklist

Before sharing your repository with others, ensure:

- [ ] All sensitive data is removed or kept in .env.local (which is gitignored)
- [ ] README.md contains accurate project information
- [ ] License information is correct
- [ ] GitHub Actions workflow is working correctly

## Troubleshooting

- If you encounter issues with GitHub Actions, check the workflow logs under the "Actions" tab
- For permission errors, ensure you have the correct access to the repository
- For push errors, ensure your local Git is configured with the correct credentials 