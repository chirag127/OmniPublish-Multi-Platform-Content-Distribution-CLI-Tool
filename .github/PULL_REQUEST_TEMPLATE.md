--- 
name: Feature / Fix / Refactor Pull Request
about: Submit a structured proposal for integration into the OmniPublisher core engine.
title: "[TYPE]: Concise, high-impact summary of changes (e.g., [FEAT]: Add Dev.to API V2 integration)"
labels: ['needs review', 'typescript']
assignees: ['chirag127']
---

## ⚡ Apex PR Submission Protocol

Welcome, Architect. This Pull Request must adhere to the high-velocity, zero-defect standard. Before merging, all checklist items must be validated.

### 🔗 Related Artifacts

Please link the relevant issue(s) this PR addresses. Use keywords like `Closes #XXX`, `Fixes #XXX`, or `Relates to #XXX`.

---

## 🚀 Overview & Impact

Provide a detailed summary of the changes and the expected impact on the system.

**Description:**
[Detailed explanation of the problem solved, or the new capability introduced.]

**Changes in Behavior (If Applicable):**
[Describe any new configuration, command-line flags, or breaking changes.]

---

## 🛠️ Technical Implementation Details

### Architecture & Modularity
This system follows the **Modular Monolith** pattern, ensuring clean separation of publishing adapters (Dev.to, Medium, etc.) using TypeScript.

*   **Design Decision:** [Briefly explain the primary technical approach taken (e.g., "Implemented a new `HashnodeAdapter` conforming to the `ContentPublisher` interface").]
*   **Modules/Files Affected:** [List the primary files or directories modified.]
*   **Dependency Changes:** [List any new or removed dependencies in `package.json`.]

### Testing Strategy
*   **New Test Coverage:** [Describe the new unit tests (Vitest) or end-to-end tests (Playwright) added.]
*   **Verification Command:** `npm run test` or `npm run integration:test`

---

## ✅ Pre-Merge Checklist (Mandatory Gate)

Ensure all development standards have been met.

### Code Quality & Standards
- [ ] **Code Complete:** The feature is fully implemented and tested locally.
- [ ] **Type Safety:** All new TypeScript code is strictly typed and passes `tsc --noEmit`.
- [ ] **Linting & Formatting:** Code adheres to the established **Biome** standards (`npm run format:check` and `npm run lint`).
- [ ] **Error Handling:** Robust error handling is implemented for all external API calls and asynchronous operations.
- [ ] **Documentation Updated:** JSDoc comments updated for all exported functions/classes, and the relevant sections of the documentation/README are updated.
- [ ] **Reviewer Assigned:** A reviewer has been explicitly assigned.

### Testing & Verification
- [ ] **Unit Tests:** New unit tests have been added or existing tests updated to cover the changes.
- [ ] **Test Passing:** All unit and integration tests pass successfully (`npm run test`).
- [ ] **CI Passing:** The Continuous Integration pipeline is green.
    [![CI Status](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/actions/workflows/ci.yml/badge.svg)](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/actions/workflows/ci.yml)

### Security & Performance
- [ ] **Security Review:** Changes introduce no new potential security vulnerabilities (e.g., API key exposure, unvalidated input).
- [ ] **Performance Audit:** Changes do not introduce significant performance bottlenecks, especially concerning large file processing or synchronous API calls.

---

## 🌟 Contributing Guidelines

Review the full contribution standards before approval:
[Contributing Guidelines](https://github.com/chirag127/OmniPublisher-MultiPlatform-Content-Syndicator/blob/main/.github/CONTRIBUTING.md)
