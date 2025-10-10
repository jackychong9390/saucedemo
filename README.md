**Overview**
This repository contains UI tests for saucedemo.com built with Playwright Test.
The suite is data-driven: different user personas produce different behaviors and results across pages (e.g., login outcomes, inventory visibility, cart state).

Objective
Deliver a near-complete, one-day slice of an end-to-end testing setup:
Navigate through core user flows (login → browse inventory → add to cart).
Implement assertions for each key interaction.
Produce artifacts (screenshots, video, traces) and an HTML report.
Wire up a CI/CD runner (GitHub Actions) so tests can be triggered on demand.
This demonstrates both approach and execution: how I structure tests, pick locators, and ship a runnable pipeline.

Flow covered:

1.Login with a selected persona (only standard user for now)

2.Inventory: view and sort products

3.Cart: add items (purchase flow scaffolded for extension) (Not yet)

4.Checkout (ready to extend) (Not yet)

**How to start (CI)**
Open Actions → Playwright E2E.
Choose a persona (e.g., standard_user).
Click Run workflow.
Artifacts (report, traces, video) are uploaded on completion.

**Environment inputs**
Tests accept a user persona via the USER_TYPE environment variable
(defaults to standard_user).

Available personas: standard_user (for now)

Locally, you can run with:
USER_TYPE=standard_user npx playwright test --project=chromium
