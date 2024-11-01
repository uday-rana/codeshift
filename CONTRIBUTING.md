# Contributing

We welcome contributions to improve codeshift! Whether it's reporting a bug, suggesting new features, or submitting a pull request, your input is valuable.

## How to Contribute

1. Fork the repository

   - Click the "Fork" button on the top right of the repository page.

2. Clone your fork

   ```bash
   git clone https://github.com/<your-username>/codeshift.git
   cd codeshift
   ```

3. Create a branch for your change. Name your branch `issue-number` based on the issue number on GitHub. If your change doesn't have an issue, [create one](https://github.com/uday-rana/codeshift/issues).

   ```bash
   git checkout -b issue-24
   ```

4. Make your changes

   - Ensure that your code follows the existing style and conventions.
   - Run `npm run lint` and `npm run prettier` to lint your code before committing changes.

5. Commit your changes

   - Follow the [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages.

   ```bash
   git commit -m "feat(scope): add new feature description"
   ```

6. Push to your fork

   ```bash
   git push origin feature/my-awesome-feature
   ```

7. [Submit a pull request](https://github.com/uday-rana/codeshift/pulls)

   - Go to the original repository, navigate to the "Pull Requests" tab, and open a new pull request.
   - Fill in the template. Link your issue using closing keywords, and provide a clear description of your changes.

## Guidelines

- **Follow the coding standards**: Keep your code clean and consistent with the project's existing style.
- **Write tests**: If applicable, add tests to cover your changes.
- **Keep commits small**: Focus each commit on a single problem or feature.
- **Document your changes**: Update the README or other documentation if your changes affect usage.

Thank you for contributing!
