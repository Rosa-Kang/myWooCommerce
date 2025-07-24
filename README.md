# PurelyScrunchies

A headless e-commerce store built with Next.js and WordPress, specializing in premium scrunchies for the Canadian market.

## Tech Stack

- **Frontend**: Next.js 15.4.3 + TypeScript + Tailwind CSS
- **Backend**: WordPress 6.8.2 + WooCommerce 10.0.4
- **API**: WooCommerce REST API + Custom endpoints
- **State Management**: Zustand
- **Development**: Local by Flywheel

## Features

- Headless WordPress CMS with custom API endpoints
- Canadian market optimization (CAD currency, tax compliance)
- Responsive design with Tailwind CSS
- WooCommerce integration for product management
- Custom API testing dashboard
- PayPal payment integration

## Getting Started

### Prerequisites

- Node.js 18+
- Local by Flywheel (for WordPress backend)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd purelyscrunchies
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```bash
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:10033
WORDPRESS_API_URL=http://localhost:10033/wp-json/wc/v3
WC_CONSUMER_KEY=your_consumer_key
WC_CONSUMER_SECRET=your_consumer_secret
NEXT_PUBLIC_STORE_CURRENCY=CAD
NEXT_PUBLIC_STORE_COUNTRY=CA
```

5. Start the development server
```bash
npm run dev
```

### WordPress Setup

1. Install Local by Flywheel
2. Create a new WordPress site
3. Install WooCommerce plugin
4. Install the custom `headless-api-config` plugin (located in WordPress plugins folder)
5. Generate WooCommerce REST API keys

## API Testing

Visit `/test` to verify all API connections and view sample data.

## Project Structure

```
├── app/                 # Next.js app directory
├── lib/                 # Utility functions and API integrations
│   └── woocommerce.ts   # WooCommerce API wrapper
├── components/          # React components (to be added)
├── public/              # Static assets
└── .env.local          # Environment variables
```

## Development

- **Frontend**: `npm run dev` (runs on http://localhost:3000)
- **Backend**: Start WordPress site in Local by Flywheel
- **API Testing**: http://localhost:3000/test

## Contributing

This is a personal project, but feel free to fork and adapt for your own use.

## License

© 2025 therosessom. All rights reserved.