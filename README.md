# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Database update

Before deploying the period-name feature, run [`drizzle/0000_add_period_name.sql`](./drizzle/0000_add_period_name.sql) once against the PostgreSQL database. Existing periods will receive a name based on their start date.

Before deploying buyer names and payment status for sales, run [`drizzle/0001_add_sale_buyer_and_payment.sql`](./drizzle/0001_add_sale_buyer_and_payment.sql) once against the PostgreSQL database. Existing sales are initialized with an empty buyer name and unpaid status.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
