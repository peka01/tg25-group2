# ERP System with Guided Onboarding

A modern ERP system built with React, TypeScript, and Tailwind CSS, featuring an intelligent guided onboarding system powered by driver.js.

## Features

### Core ERP Functionality
- **Customer Management**: Pre-loaded customer database
- **Product Catalog**: Service and product offerings
- **Invoice Creation**: Complete invoice workflow
  - Customer selection
  - Line item management with quantity and pricing
  - Real-time total calculations
  - Tax calculation (10%)
- **Invoice Management**: View and track all invoices

### Guided Onboarding System
- **Interactive Tours**: Step-by-step guides using driver.js
- **Configurable Guides**: JSON-based guide configuration
- **Auto-start Option**: Automatically launch guides on first visit
- **Manual Control**: Start/stop guides at any time
- **Visual Highlights**: Spotlight effect on UI elements
- **Contextual Help**: Tooltips with descriptions for each step

### User Experience
- **Single Page Application**: Fast, seamless navigation
- **Responsive Design**: Works on desktop and mobile
- **Professional UI**: Clean, modern interface with Tailwind CSS
- **Real-time Feedback**: Success notifications and validation

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Guide System**: driver.js
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   └── Layout.tsx              # Main layout with sidebar navigation
├── pages/
│   ├── Dashboard.tsx           # Dashboard with stats and quick actions
│   ├── CreateInvoice.tsx       # Invoice creation workflow
│   ├── ViewInvoices.tsx        # Invoice list view
│   └── Settings.tsx            # Guide settings and preferences
├── context/
│   ├── GuideContext.tsx        # Guide system state management
│   └── InvoiceContext.tsx      # Invoice form state management
├── services/
│   └── mockData.ts             # Mock data services (customers, products, invoices)
├── types/
│   └── index.ts                # TypeScript type definitions
├── data/
│   └── guides/
│       └── invoice-creation.json  # Invoice creation guide configuration
├── App.tsx                     # Root component
├── main.tsx                    # Application entry point
└── style.css                   # Global styles with Tailwind directives
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tg25-group2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating an Invoice

1. Navigate to **Create Invoice** from the sidebar
2. If enabled, the guide will automatically start on first visit
3. Follow these steps:
   - Select a customer from the dropdown
   - Add line items by selecting products and quantities
   - Review the invoice preview with calculated totals
   - Save the invoice

### Managing Guides

1. Navigate to **Settings**
2. Toggle **Auto-start Guides** on/off
3. Reset guide progress to see guides again
4. View available guides and their status

### Starting a Guide Manually

- Click the **Start Guide** button in the header (available on relevant pages)
- The guide will highlight UI elements and show step-by-step instructions
- Use Next/Previous buttons to navigate
- Click Stop Guide or close the guide at any time

## Guide System

### Adding New Guides

Create a new JSON file in `src/data/guides/` with this structure:

```json
{
  "name": "Guide Name",
  "description": "Guide description",
  "category": "category-name",
  "autoStartDefault": true,
  "steps": [
    {
      "element": "[data-guide-step='step-id']",
      "popover": {
        "title": "Step Title",
        "description": "Step description",
        "side": "bottom"
      }
    }
  ]
}
```

### Guide Step Attributes

Add `data-guide-step` attributes to UI elements you want to highlight:

```tsx
<button data-guide-step="save-invoice">
  Save Invoice
</button>
```

## Mock Data

The application uses in-memory mock data:

- **Customers**: 3 pre-loaded customers
- **Products**: 5 products/services with prices
- **Invoices**: Created invoices are stored in memory (reset on page refresh)

## Development

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Future Enhancements

- Persistent storage (localStorage or backend API)
- Additional guides for other workflows
- Admin panel for guide management
- Export invoices as PDF
- Customer creation and management
- Product catalog management
- Invoice status updates (sent, paid)
- Payment tracking
- Multi-currency support
- User authentication

## License

MIT

## Contributors

Built for TG25 Group 2
