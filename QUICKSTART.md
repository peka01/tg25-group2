# Quick Start Guide

## Start the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

## Try the Guided Onboarding

### Option 1: Automatic Start (First Visit)
1. Click on **"Create Invoice"** in the sidebar
2. The guide will automatically start highlighting the UI
3. Follow the 8-step tour to learn invoice creation
4. Click "Next" to progress through steps

### Option 2: Manual Start
1. Navigate to **"Create Invoice"**
2. Click the **"Start Guide"** button in the header
3. The guide will begin immediately

### Option 3: Disable Auto-Start
1. Go to **"Settings"** in the sidebar
2. Toggle **"Auto-start Guides"** to OFF
3. Now guides only start when you click "Start Guide"

## Create Your First Invoice

1. **Select a Customer**
   - Choose from: Acme Corporation, TechStart Inc, or Global Solutions Ltd

2. **Add Products/Services**
   - Select a product from the dropdown
   - Enter quantity
   - Click "Add Item"
   - Repeat for multiple items

3. **Review Totals**
   - Subtotal, tax (10%), and total are calculated automatically

4. **Save Invoice**
   - Click "Save Invoice" button
   - Success notification appears
   - You'll be redirected to the invoice list

## View Your Invoices

1. Click **"View Invoices"** in the sidebar
2. See all created invoices in a table
3. View invoice numbers, customers, dates, and totals

## Navigate the Dashboard

1. Click **"Dashboard"** in the sidebar
2. View statistics:
   - Total invoices
   - Total customers
   - Paid invoices
   - Draft invoices
3. Use quick action cards to jump to different pages

## Manage Guide Settings

1. Go to **"Settings"**
2. **Auto-start Guides**
   - Toggle ON: Guides start automatically on first visit
   - Toggle OFF: Only manual guide starts
3. **Reset Guide Progress**
   - Click "Reset Guide Progress"
   - Guides will show again on first visit
4. View **Available Guides** section for guide status

## Tips

- **Guide Controls**: 
  - Next/Previous buttons to navigate
  - Close button to exit guide
  - "Stop Guide" button in header

- **Data Persistence**:
  - Invoices are stored in memory
  - Data resets on page refresh
  - Guide settings saved in localStorage

- **Keyboard Shortcuts**:
  - Arrow keys to navigate guide steps (when guide is active)
  - ESC to close guide

## Available Products

1. Professional Service - Hourly: $150.00
2. Software License - Annual: $1,200.00
3. Training Session: $500.00
4. Support Package - Premium: $2,500.00
5. Custom Development: $5,000.00

## Available Customers

1. Acme Corporation
2. TechStart Inc
3. Global Solutions Ltd

## Troubleshooting

**Issue**: Guide doesn't start automatically
- **Solution**: Check Settings → Auto-start Guides is enabled
- **Solution**: Reset guide progress in Settings

**Issue**: Can't see invoices after creating one
- **Solution**: Navigate to "View Invoices" page
- **Solution**: Check Dashboard for statistics

**Issue**: Line item not adding
- **Solution**: Ensure customer is selected first
- **Solution**: Ensure product and quantity are valid

**Issue**: Development server won't start
- **Solution**: Run `npm install` first
- **Solution**: Check if port 5173 is available
- **Solution**: Try `npm run build` to check for errors

## Next Steps

- Create multiple invoices to see the dashboard populate
- Try different combinations of products and quantities
- Test the guide system with auto-start on and off
- Explore the clean, professional UI design
- Check the code to understand how guides are configured

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Enjoy exploring the ERP system with guided onboarding! 🎉
