Act as a Senior Full-Stack Software Architect, Principal Next.js Engineer, TypeScript Expert, PostgreSQL Database Architect, UI/UX Designer, Security Engineer, QA Engineer, and DevOps Engineer.

Your mission is to build a complete, production-oriented Restaurant Food Ordering Platform by following the attached Product Requirements Document (PRD) as the primary source of truth.

The attached PRD contains the product vision, requirements, features, database entities, architecture, workflows, security rules, testing requirements, and implementation roadmap.

Read the entire attached PRD before making implementation decisions.

**Do not merely explain how the application could be built. Implement the application in the current project workspace.**

Do not stop after creating a plan, generating a few UI screens, or writing a database schema. Continue through implementation, integration, testing, debugging, and production-readiness verification.

---

# 1. PROJECT CONTEXT

Build a modern online food ordering platform for a local restaurant.

Customers must be able to discover food products, browse categories, search and filter the menu, customize food items, add products to their cart, enter customer and delivery information, place orders, make payments where configured, and track their orders.

Restaurant administrators must be able to manage products, categories, orders, prices, product availability, coupons, restaurant settings, customer information, payment records, and business reports according to their permissions.

The application must use real persistent database operations.

## Mandatory Technology Stack

Use the following stack unless the existing project contains a compatible, already-configured equivalent:

- Framework: Next.js with App Router.
- Language: TypeScript with strict type checking.
- Styling: Tailwind CSS.
- UI Components: shadcn/ui where appropriate.
- Icons: Lucide React.
- Database: Neon Serverless PostgreSQL.
- ORM: Prisma.
- Validation: Zod.
- Forms: React Hook Form where appropriate.
- Authentication: A maintained, compatible authentication solution.
- Payments: Razorpay integration, subject to credentials and provider configuration.
- Deployment target: Vercel.
- Image storage: A suitable persistent image storage service.
- Testing: Appropriate unit, integration, and end-to-end testing tools compatible with the project.

Use the existing dependency versions when they are compatible. Avoid unnecessary upgrades or dependency replacement.

Do not introduce another backend framework or another database without a demonstrated technical requirement.

---

# 2. SOURCE OF TRUTH AND REQUIREMENT PRIORITY

Follow this priority order:

1. The attached PRD.
2. Existing project requirements and established working functionality.
3. Security, payment correctness, data integrity, and accessibility requirements.
4. The implementation instructions in this master prompt.
5. Reasonable engineering defaults where the PRD leaves details unspecified.

If the PRD explicitly defines a business rule, implement that rule.

If a requirement is ambiguous, choose a reasonable, secure default, document the decision, and continue.

Do not silently remove features from the PRD.

If an external service requires credentials that are unavailable, implement the appropriate integration boundary, configuration checks, error handling, and setup documentation. Never pretend an unconfigured integration is operational.

---

# 3. PHASE ZERO — INSPECT BEFORE IMPLEMENTING

Before modifying any files:

1. Inspect the complete repository structure.
2. Read package.json and the lockfile.
3. Identify the installed Next.js, React, TypeScript, Tailwind CSS, and Prisma versions.
4. Inspect existing pages, components, routes, database schemas, migrations, and environment-variable examples.
5. Check whether Neon and Prisma are already connected.
6. Identify any existing authentication or payment integration.
7. Identify broken features, incomplete implementations, duplicate components, and inconsistent styles.
8. Inspect the attached PRD in its entirety.
9. Determine which requirements are already implemented and which are missing.
10. Create a requirement-to-implementation checklist.

Do not delete or replace working code simply to follow a preferred folder structure.

Preserve useful existing functionality and follow the conventions of the installed Next.js version.

After inspection, create or update the implementation checklist and begin development immediately. Do not stop to ask for approval unless an essential external decision genuinely blocks implementation.

---

# 4. IMPLEMENT THE COMPLETE APPLICATION

## 4.1 Customer-Facing Website

Implement all applicable customer-facing pages from the PRD.

Required areas include:

- Homepage.
- Restaurant branding and navigation.
- Food category browsing.
- Complete product listing.
- Product details.
- Product variants and add-ons.
- Search and filtering.
- Cart.
- Checkout.
- Order confirmation.
- Order tracking.
- Order history.
- Customer profile.
- Saved addresses.
- Favorites.
- Reviews and ratings.
- Contact and support information.
- Privacy policy, terms, cancellation, and refund policy pages.

Do not create pages that only look complete. Every required interactive element must have its intended behavior.

## 4.2 Homepage

Create a polished, professional restaurant homepage featuring:

- Responsive navigation.
- Restaurant logo and identity.
- Attractive hero section.
- Primary ordering CTA.
- Food category navigation.
- Featured products.
- Popular dishes derived from actual data where possible.
- Current offers and combos.
- Restaurant hours.
- Delivery or pickup information.
- Customer reviews based on real records.
- Contact information and footer.

Use real database-driven content wherever the feature requires it.

If the database is empty, show a purposeful empty state and provide an appropriate admin workflow for adding content. Do not invent live business statistics.

## 4.3 Menu and Product Management

Implement:

- Database-driven categories.
- Database-driven products.
- Product image support.
- Price and discount display.
- Veg / Non-Veg indicators.
- Product availability.
- Variants such as half/full portions.
- Configurable add-ons.
- Search and filters.
- Sorting.
- Pagination or efficient incremental loading.
- Product details.
- Out-of-stock handling.

Products and categories must be manageable through the admin dashboard.

Avoid hardcoded product lists in production code.

## 4.4 Shopping Cart

Implement a reliable cart system supporting:

- Add to cart.
- Increase and decrease quantity.
- Remove products.
- Edit supported customizations.
- Display item-level prices.
- Calculate subtotals.
- Display applicable discounts and charges.
- Persist guest carts appropriately.
- Support database-backed carts for authenticated users when required.
- Revalidate cart data before checkout.

Never trust client-submitted prices, discounts, tax amounts, or totals.

Recalculate every payable amount using trusted server-side data.

## 4.5 Checkout and Order Creation

Implement a complete checkout flow.

Collect the customer information required by the PRD.

Validate delivery addresses and service areas where applicable.

Support delivery and pickup according to restaurant configuration.

Before creating an order:

1. Validate the request.
2. Load current product and variant data.
3. Verify availability.
4. Validate add-ons and quantities.
5. Recalculate prices.
6. Validate coupon eligibility.
7. Calculate delivery fees and applicable taxes.
8. Apply currency-safe arithmetic.
9. Create the order and order-item snapshots transactionally.
10. Apply idempotency protection against duplicate submissions.
11. Record the initial order and payment states correctly.
12. Return the order reference.

Preserve historical product descriptions, customizations, quantities, and charged prices in order-item snapshots.

Handle concurrent requests and inventory-related conflicts safely.

## 4.6 Order Tracking

Implement:

- Unique order references.
- Customer order history.
- Order details.
- Status timelines.
- Status-change timestamps.
- Cancellation rules.
- Order status history.
- Reorder functionality where products remain available.
- Customer-facing order status labels.

Enforce valid status transitions on the server.

Do not allow arbitrary order-status changes from client-side code.

## 4.7 Customer Authentication

Implement the authentication requirements in the PRD.

Support guest checkout if specified.

Protect account routes and private order information.

Use secure sessions and an appropriate password or identity-provider mechanism.

Do not build custom authentication cryptography.

Verify that customers can access only their own account, addresses, and orders.

---

# 5. ADMIN DASHBOARD

Build a separate, professional, protected admin application.

Required modules:

1. Admin dashboard overview.
2. Product management.
3. Category management.
4. Product variants and add-ons.
5. Order management.
6. Customer management.
7. Payment records.
8. Coupon management.
9. Restaurant configuration.
10. Sales reports.
11. Reviews and moderation.
12. Inventory features where included in the PRD.
13. Audit logs for sensitive administrative actions.
14. Role and permission management where required.

## Dashboard requirements

Use real database queries for:

- Today's orders.
- Pending orders.
- Orders in preparation.
- Completed and cancelled orders.
- Sales totals.
- Discounts and refunds.
- Bestselling products.
- Recent orders.
- Sales trends.

Clearly define revenue calculations.

Never use hardcoded chart values or fake business statistics.

Provide appropriate loading, empty, error, and success states.

## Product management

Admins must be able to create, edit, archive, and manage products and categories.

Support image uploads through persistent storage.

Validate file types, sizes, and upload permissions.

Allow administrators to manage prices, variants, add-ons, preparation times, and availability.

## Order management

Implement:

- Incoming orders.
- Accept and reject actions.
- Preparation-status updates.
- Pickup and delivery statuses.
- Cancellation handling.
- Payment-status visibility.
- Customer contact and delivery information.
- Search and filtering.
- Print-friendly bills.
- Order status history.

Enforce role permissions and valid status transitions on the server.

## Restaurant settings

Allow authorized users to manage restaurant hours, contact details, delivery areas, delivery charges, minimum order amounts, tax configuration, accepted payment methods, and temporary closure.

Persist all settings in the database.

---

# 6. NEON POSTGRESQL + PRISMA

Neon PostgreSQL is the application's primary persistent database.

Inspect the existing database configuration before creating a new schema.

If Prisma is already configured, extend the existing schema safely.

If it is not configured, install and configure a compatible Prisma version and connect it to Neon.

Implement all entities required by the PRD, including the applicable versions of:

- User and authentication identities.
- Address.
- Category.
- Product.
- ProductVariant.
- AddOnGroup.
- AddOnOption.
- Cart.
- CartItem.
- Order.
- OrderItem.
- Payment.
- OrderStatusHistory.
- Coupon.
- CouponRedemption.
- Review.
- RestaurantSettings.
- AuditLog.

Add delivery, inventory, notification, or kitchen entities if those modules are implemented.

## Database rules

- Use appropriate primary and foreign keys.
- Add unique constraints and indexes.
- Define deletion and archival behavior.
- Use integer minor units or an appropriate decimal type for money.
- Never use floating-point arithmetic for financial totals.
- Store currency explicitly.
- Use consistent timestamp handling.
- Preserve order history.
- Add database constraints where useful.
- Use transactions for critical operations.
- Prevent duplicate order references.
- Protect against duplicate payment processing.
- Keep production and development databases separate.

## Neon configuration

Support the connection configuration recommended by Neon for the selected runtime.

Use the appropriate pooled connection for application traffic and a suitable direct connection for migrations if required by the selected configuration.

Do not expose either connection string in client-side code.

Create an .env.example file containing variable names and safe placeholders only.

Never overwrite a real environment file or reveal its secrets.

Do not run destructive production migrations or reset production data.

Use Prisma migrations to manage schema changes.

Do not claim database connectivity is verified unless an actual connection test succeeds.

---

# 7. BACKEND ARCHITECTURE

Implement backend functionality using Next.js server-side capabilities.

Use Route Handlers, Server Actions, and server-side service modules where appropriate.

Separate:

- Request validation.
- Authentication and authorization.
- Business logic.
- Database access.
- Payment-provider operations.
- Notification delivery.
- Error handling.

Create reusable modules for:

- Product services.
- Category services.
- Cart validation.
- Pricing calculations.
- Coupon validation.
- Order creation.
- Order status transitions.
- Payment operations.
- Admin authorization.
- Reporting.

Use Zod schemas at trust boundaries.

Use typed service results and consistent error responses.

Prevent duplicate or conflicting business operations.

Use pagination for potentially large datasets.

Apply rate limiting to sensitive endpoints.

Do not expose internal errors, stack traces, credentials, or database details to users.

Avoid unnecessary client-side fetching for data that can be securely rendered on the server.

---

# 8. PAYMENT INTEGRATION

Implement payment integration according to the PRD.

Support Cash on Delivery and the configured online payment provider.

For Razorpay or another selected provider:

1. Create payment orders on the server.
2. Store provider references.
3. Return only the data required by the client.
4. Verify signatures through the provider's documented mechanism.
5. Verify webhook authenticity.
6. Process duplicate webhook events idempotently.
7. Record payment status transitions.
8. Reconcile provider payment references with application orders.
9. Handle payment failures and retries.
10. Handle eligible cancellations and refunds.
11. Keep payment records available to authorized admins.

Important rules:

- A successful redirect is not sufficient proof of payment.
- Do not mark payments successful without server-side verification.
- Do not trust client-submitted amounts.
- Never expose provider secret keys.
- Never store raw card details.
- Never silently convert a failed payment into a successful one.
- Do not create duplicate orders when payment is retried.
- Keep payment status separate from order status.

If credentials are missing, implement the integration safely and document the exact setup steps.

Use test credentials and the provider's test environment for development.

Never simulate real payment success in production.

---

# 9. PREMIUM UI/UX IMPLEMENTATION

The entire application must have a consistent, polished, professional design system.

## Design requirements

- Premium restaurant brand identity.
- Strong typography hierarchy.
- High-quality food imagery.
- Consistent colors and spacing.
- Clean navigation.
- Reusable UI components.
- Well-designed product cards.
- Clear prices and discounts.
- Accessible forms.
- Subtle motion.
- Smooth transitions where appropriate.
- Clear calls to action.
- Consistent buttons, dialogs, cards, and inputs.

Use shadcn/ui and Tailwind CSS appropriately.

Avoid excessive animations, visual clutter, generic placeholder layouts, and unnecessary gradients.

Do not add decorative UI that makes ordering slower or harder.

## Responsive requirements

Implement mobile-first layouts for:

- Homepage.
- Category navigation.
- Product listing.
- Product details.
- Cart.
- Checkout.
- Order tracking.
- Customer account.
- Admin dashboard.
- Kitchen interface, if included.

Test small mobile screens, larger phones, tablets, laptops, and desktops.

Prevent horizontal overflow.

Use responsive product grids, touch-friendly controls, compact mobile navigation, and readable forms.

Use mobile-friendly alternatives to wide administrative tables where necessary.

## Required interface states

Implement:

- Loading skeletons.
- Empty states.
- Error messages.
- Success feedback.
- Disabled controls.
- Form validation.
- Network failure handling.
- Confirmation dialogs for destructive operations.
- Appropriate retry actions.

Every visible button, link, form, filter, and navigation item must work as intended.

Do not leave dead buttons or fake interactions.

---

# 10. IMAGE AND ASSET MANAGEMENT

Use suitable, high-quality restaurant and food imagery.

Prefer image assets explicitly supplied by the project owner or images obtained through an appropriately configured image service.

Store uploaded images using persistent object storage.

Store image URLs and relevant metadata in the database.

Implement image validation and optimization.

Provide graceful fallbacks for missing images.

Do not generate fake image URLs or pretend an upload succeeded.

Do not rely on temporary development files for production image storage.

Do not overwrite user-supplied assets without a clear need.

---

# 11. PERFORMANCE AND SEO

Implement:

- Appropriate server rendering.
- Optimized image delivery.
- Lazy loading where beneficial.
- Efficient database queries.
- Database indexes.
- Pagination.
- Reduced unnecessary client JavaScript.
- Appropriate caching and cache invalidation.
- Metadata for customer-facing pages.
- Search-friendly category and product URLs.
- Sitemap and robots.txt.
- Social-sharing metadata.
- Local business structured data where appropriate.
- Accessible semantic HTML.

Do not cache private customer or order information in a way that could expose it to another user.

Invalidate relevant menu and product caches when admins update data.

Keep order and payment state changes consistent with what customers and staff see.

---

# 12. SECURITY AND ACCESS CONTROL

Implement security throughout the application.

Mandatory requirements:

- Server-side authorization.
- Role-based access control.
- Secure session handling.
- Password hashing through a maintained authentication solution.
- Input validation.
- Safe database access.
- Rate limiting.
- Secure file uploads.
- Payment signature verification.
- Webhook authentication.
- Duplicate request protection.
- Guest-order access protection.
- Customer data privacy.
- Secure error handling.
- Least-privilege database credentials.
- Secret management through environment variables.
- Audit logs for important administrative operations.

Never rely on UI visibility as an authorization mechanism.

Never trust a role, price, discount, payment status, or order status submitted by the browser without server-side verification.

Protect against common web vulnerabilities.

Use only the personal information required for the application's functionality.

---

# 13. TESTING AND QUALITY ASSURANCE

Create and run appropriate automated tests.

## Unit tests

Test:

- Product pricing.
- Variant pricing.
- Add-on pricing.
- Coupon validation.
- Delivery fees.
- Tax calculations.
- Order status transitions.
- Payment status transitions.
- Quantity limits.

## Integration tests

Test:

- Neon connectivity.
- Prisma queries.
- Product creation and updates.
- Category management.
- Order creation.
- Order item snapshots.
- Coupon redemption.
- Payment verification.
- Duplicate webhook handling.
- Admin permissions.

## End-to-end tests

Test the complete customer journey:

1. Open the homepage.
2. Browse food categories.
3. Search for a food item.
4. Open product details.
5. Select variants or add-ons.
6. Add products to the cart.
7. Update quantities.
8. Proceed to checkout.
9. Enter customer information.
10. Select delivery or pickup.
11. Choose a payment method.
12. Submit the order.
13. Verify the order is stored in the database.
14. Verify the order appears in the admin dashboard.
15. Update its status.
16. Verify the customer can see the status update.

Also test payment failures, unavailable products, expired coupons, unauthorized access, duplicate submissions, and mobile responsiveness.

Use isolated test data and a payment sandbox.

Never perform destructive tests against production data.

---

# 14. IMPLEMENTATION STRATEGY

Build the application in the following phases.

## Phase 1 — Repository and Architecture

- Inspect existing code.
- Read the PRD.
- Identify missing functionality.
- Confirm compatible dependencies.
- Establish design tokens.
- Set up the implementation checklist.
- Define the architecture.

## Phase 2 — Database Foundation

- Configure Prisma and Neon.
- Define and validate the schema.
- Create migrations.
- Implement seed scripts for development.
- Test database connectivity.
- Verify core read and write operations.

Development seed data must be separate from production data.

## Phase 3 — Design System and Customer UI

- Build reusable layouts.
- Build navigation.
- Build the homepage.
- Build category and product components.
- Build search and filters.
- Build product details.
- Build the cart and checkout interfaces.
- Implement responsive layouts and interface states.

## Phase 4 — Database-Driven Features

- Connect the menu to Neon.
- Implement product queries.
- Implement category queries.
- Implement filtering and pagination.
- Implement product variants and availability.
- Remove obsolete mock data from production paths.

## Phase 5 — Cart and Ordering

- Implement cart persistence.
- Implement server-side pricing.
- Implement checkout validation.
- Implement transactional order creation.
- Implement order history.
- Implement order tracking.
- Implement duplicate request protection.

## Phase 6 — Authentication and Admin

- Implement authentication.
- Implement role-based authorization.
- Build the admin dashboard.
- Implement product management.
- Implement category management.
- Implement order processing.
- Implement restaurant settings.
- Implement reporting.

## Phase 7 — Payments

- Configure the payment provider.
- Implement payment creation.
- Implement server-side verification.
- Implement authenticated webhook processing.
- Implement payment retries.
- Implement eligible refunds.
- Test payment failure and duplicate-event scenarios.

## Phase 8 — Advanced Business Features

Implement the applicable PRD features:

- Coupons.
- Favorites.
- Reviews.
- Notifications.
- Inventory.
- Kitchen operations.
- Delivery management.
- Advanced analytics.

Prioritize features according to the PRD and existing project scope.

## Phase 9 — Testing and Production Readiness

- Run TypeScript checks.
- Run linting.
- Run unit and integration tests.
- Run end-to-end tests.
- Run the production build.
- Fix discovered issues.
- Test mobile responsiveness.
- Verify security boundaries.
- Document environment setup.
- Verify migration procedures.
- Prepare deployment instructions.

Do not skip phases merely to finish quickly.

---

# 15. EXECUTION RULES

Follow these rules throughout development:

1. Work directly in the current project workspace.
2. Read existing files before editing them.
3. Implement real functionality, not just visual mockups.
4. Follow the attached PRD.
5. Preserve existing working features.
6. Do not use fake production data.
7. Do not use `any` as a shortcut for unresolved TypeScript errors.
8. Do not suppress compiler errors without a justified fix.
9. Do not leave unfinished TODOs in essential functionality.
10. Do not invent credentials or service integrations.
11. Do not expose secrets.
12. Do not destructively reset a database.
13. Do not claim tests pass unless they have actually run successfully.
14. Do not claim an integration works without verification.
15. Fix implementation errors as they are discovered.
16. Keep the code modular and maintainable.
17. Update documentation when configuration changes.
18. Avoid unnecessary dependencies.
19. Do not stop after generating a plan.
20. Continue implementing the next available phase until the requested scope is complete or a genuine external blocker is reached.

If an external dependency prevents completion, finish all independent work and clearly document the remaining blocker.

---

# 16. ENVIRONMENT AND DEPLOYMENT

Inspect the existing environment configuration.

Create or update `.env.example` with placeholder values for the required variables.

Depending on the implemented integrations, configuration may include:

- `DATABASE_URL`
- `DIRECT_URL`, if required by the Prisma and Neon setup
- Authentication secret and provider settings.
- Payment provider public key.
- Payment provider secret key.
- Payment webhook secret.
- Image storage credentials.
- Email or notification provider credentials.
- Application base URL.

Use the actual variable names expected by the selected libraries and project configuration.

Never print real secret values in logs or documentation.

Do not overwrite existing credentials.

Do not deploy until the application has been configured for the intended environment.

Document the exact steps needed to:

1. Install dependencies.
2. Configure environment variables.
3. Connect Neon.
4. Apply database migrations.
5. Seed development data.
6. Run the development server.
7. Run tests.
8. Build for production.
9. Deploy to Vercel.
10. Configure production webhooks and image storage.

---

# 17. CONTINUOUS VERIFICATION

After each major phase:

- Inspect the changed files.
- Run relevant checks.
- Test affected user flows.
- Fix errors.
- Update the checklist.
- Continue to the next phase.

At minimum, execute the checks supported by the project:

- TypeScript type checking.
- Linting.
- Unit tests.
- Integration tests.
- Production build.
- Critical end-to-end tests.

Do not mark an item complete just because code was generated.

Use actual test results, database verification, or observable application behavior as evidence of completion.

---

# 18. FINAL DELIVERY REPORT

When implementation reaches a stopping point, provide a concise but complete report containing:

## A. Implementation Summary
What has actually been built.

## B. Completed Features
List features implemented and verified.

## C. Partially Completed Features
Identify incomplete features and the reason.

## D. Database Status
Report the schema, migrations, and actual Neon connection-test results.

Do not expose credentials.

## E. Payment Status
State whether payment integration is configured, sandbox-tested, or blocked by missing credentials.

## F. Testing Results
Report the commands executed and their actual outcomes.

## G. Deployment Status
State whether the production build succeeded and whether deployment was actually completed.

## H. Environment Variables
List required variable names and explain how to configure them without revealing secrets.

## I. Remaining Tasks
Provide an actionable list of genuine blockers and unfinished requirements.

## J. Run Instructions
Provide the exact commands needed to run the project locally.

Never report a task as complete without evidence.

---

# FINAL COMMAND

Read the attached PRD, inspect the existing project, and begin implementing the complete Restaurant Food Ordering Platform now.

Follow the PRD, preserve working functionality, implement real database-backed features, secure all critical business operations, build the customer and admin experiences, integrate payments where credentials permit, test the application, fix errors, and document the final result.

Do not stop after planning, scaffolding, or creating static UI pages.

**Build the actual application end-to-end, phase by phase, and continue until all implementable requirements are complete or a genuine external blocker prevents further progress.**