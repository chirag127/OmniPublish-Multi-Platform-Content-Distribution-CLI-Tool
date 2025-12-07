# Contributing to OmniPublisher-MultiPlatform-Content-Syndicator

We are thrilled that you're considering contributing to **OmniPublisher**, the Apex solution for multi-platform content syndication and static site archival. Your contributions are vital to enhancing this powerful engine, which automates multi-platform content publishing & static site archival from a single Markdown source, syndicating posts across Dev.to, Medium, Hashnode, WordPress, LinkedIn, Reddit & more.

Our development philosophy is rooted in "Zero-Defect, High-Velocity, Future-Proof." We strive for absolute precision, robust architecture, and a seamless developer experience.

## Code of Conduct

Please review our [Code of Conduct](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/blob/main/.github/CODE_OF_CONDUCT.md) before contributing to foster an open and welcoming environment.

## How Can You Contribute?

We welcome contributions in various forms:

*   **Reporting Bugs:** If you discover a bug, please open an issue using our [Bug Report template](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/blob/main/.github/ISSUE_TEMPLATE/bug_report.md). Provide clear steps to reproduce, expected behavior, and actual behavior.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement? Open an issue and describe your proposal. We appreciate detailed explanations and use cases.
*   **Writing Code:** Implement new features, fix bugs, improve performance, or refactor existing code. See the "Getting Started" and "Coding Guidelines" sections below.
*   **Improving Documentation:** Clear, comprehensive documentation is crucial. Help us improve our `README.md`, inline comments, or any other project documentation.

## Getting Started: Development Setup

To set up your local development environment, follow these steps:

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: LTS version (e.g., v20.x or later).
*   **pnpm**: Our preferred package manager. Install with `npm install -g pnpm`.
*   **Git**: For version control.

### Installation

1.  **Clone the Repository:**
    bash
    git clone https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator.git
    

2.  **Navigate to the Project Directory:**
    bash
    cd OmniPublisher-MultiPlatform-Content-Syndicator
    

3.  **Install Dependencies:**
    bash
    pnpm install
    

4.  **Run Development Mode (if applicable):**
    bash
    pnpm dev
    # Or to build the project:
    # pnpm build
    

## Architectural Guidelines & Coding Standards

To maintain high quality and consistency, please adhere to these guidelines:

*   **Language:** All code must be written in **TypeScript** with strict mode enabled.
*   **Architecture:** We follow the **Feature-Sliced Design (FSD)** principles, ensuring a clear separation of concerns, modularity, and scalability. Adherence to **SOLID, DRY, and YAGNI** principles is mandatory.
*   **Formatting:** We use **Biome** for consistent code formatting. Before committing, run:
    bash
    pnpm format
    
*   **Linting:** **Biome** is used for static analysis and linting to catch potential issues early. Ensure your code is clean by running:
    bash
    pnpm lint
    
*   **Testing:**
    *   **Unit Tests:** All new features and bug fixes require comprehensive **Vitest** unit tests. Run tests with:
        bash
        pnpm test:unit
        
    *   **End-to-End (E2E) Tests:** For critical workflows and integrations, **Playwright** is used for E2E testing. Ensure existing E2E tests pass and consider adding new ones where appropriate.
        bash
        pnpm test:e2e
        
    *   **Coverage:** Strive for high test coverage, particularly for core logic.
*   **Type Safety:** Strict TypeScript types are mandatory. Any new code must be fully type-safe.

## Commit Messages

We enforce the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for clear and automated changelog generation. Examples:

*   `feat: add Hashnode API integration for content syndication`
*   `fix: resolve WordPress API authentication failure`
*   `docs: update README with new setup instructions`
*   `chore: upgrade biome to latest version`

## Submitting a Pull Request (PR)

1.  **Branching:** Create a new branch from `main` for your feature or bug fix:
    bash
    git checkout main
    git pull origin main
    git checkout -b feature/your-feature-name-here
    
2.  **Implement & Test:** Write your code, tests, and update relevant documentation.
3.  **Verify:** Ensure all tests pass (`pnpm test`), linting is clean (`pnpm lint`), and code is formatted (`pnpm format`).
4.  **Commit:** Commit your changes using Conventional Commits.
5.  **Push:** Push your branch to your forked repository (if contributing from a fork) or directly to the main repository if you have write access:
    bash
    git push origin feature/your-feature-name-here
    
6.  **Create Pull Request:** Open a Pull Request on GitHub against the `main` branch. Provide a clear title and description.
7.  **Template:** Use the provided [Pull Request Template](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/blob/main/.github/PULL_REQUEST_TEMPLATE.md) to guide your submission.
8.  **Code Review:** Be responsive to feedback during the code review process. We may request changes or clarifications.

## Resources

*   [Issue Tracker](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/issues)
*   [Security Policy](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/blob/main/.github/SECURITY.md)

Thank you for contributing to OmniPublisher! Your effort helps make this tool even more robust and valuable.