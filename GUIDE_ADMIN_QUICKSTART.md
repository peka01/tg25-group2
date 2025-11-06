# Quick Start: Guide Admin Panel

## Access the Admin Panel

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to Settings**:
   - Open http://localhost:5174/ in your browser
   - Click on "Settings" in the navigation

3. **Switch to Admin Panel**:
   - Click the "Admin Panel" tab at the top of the Settings page

## Quick Actions

### 🎬 Test Existing Guides
1. Go to Admin Panel tab
2. Find a guide in the list
3. Click **"▶️ Test"** to preview it immediately

### ✏️ Edit a Guide
1. Find the guide in the Admin Panel
2. Click **"✏️ Edit"**
3. Modal editor opens with:
   - **Left side**: Guide info and steps list
   - **Right side**: Detailed step editor
4. Click on any step to edit it
5. Make changes and click **"Save Changes"**
6. Guide JSON file will download automatically

### ➕ Create a New Guide

#### Method 1: From Scratch
1. Click **"Create New Guide"** card
2. Fill in:
   - Guide name (e.g., "User Profile Setup")
   - Description (e.g., "Learn how to configure your profile")
   - Category (e.g., "account")
   - Auto-start checkbox (default: off)
3. Click **"+ Add Step"** button
4. For each step, configure:
   - **Element Selector**: CSS selector for highlighting
     - **NEW!** Click the **"🎯 Pick"** button to visually select elements from the UI
     - Or manually type: `[data-guide-step="profile-button"]`
     - Example alternatives: `#user-menu` or `.settings-panel`
   - **Title**: Short, clear action (e.g., "Click Your Profile")
   - **Description**: Explain what to do and why
   - **Position**: Where popover appears (top/right/bottom/left)
   - **Alignment**: How it aligns (start/center/end)
5. Add more steps as needed
6. Use **↑ ↓** arrows to reorder steps
7. Click **"Save Changes"**

#### Method 2: Import from JSON
1. Click **"Import Guide"** card
2. Paste valid JSON configuration
3. Click **"Import"**
4. Guide appears in the list

### 📥 Export a Guide
1. Find the guide you want to export
2. Click **"📤 Export"**
3. JSON file downloads automatically
4. Use for backup or sharing with team

### 🔄 Enable/Disable a Guide
1. Find the guide in the list
2. Click **"⏸️ Disable"** or **"▶️ Enable"**
3. Disabled guides won't auto-start but remain in the system

### 🗑️ Delete a Guide
1. Find the guide in the list
2. Click **"🗑️ Delete"**
3. Confirm deletion in the dialog
4. Guide is permanently removed

## Step Configuration Tips

### 🎯 NEW! Visual Element Picker

The easiest way to select elements:
1. Click the **"🎯 Pick"** button next to the Element Selector field
2. Your cursor becomes a crosshair
3. Hover over any element to preview it (purple highlight)
4. Click to select - the selector is automatically generated!
5. Press **Esc** to cancel

**Benefits:**
- ✅ No need to write CSS selectors manually
- ✅ See exactly what you're selecting in real-time
- ✅ Automatically generates reliable, unique selectors
- ✅ Shows element dimensions and tag info
- ✅ 10x faster than manual selector writing!

See **ELEMENT_PICKER_GUIDE.md** for detailed documentation.

### Element Selectors (Manual Method)
Use specific, stable selectors:
- ✅ **Good**: `[data-guide-step="create-invoice"]`
- ✅ **Good**: `#invoice-form`
- ⚠️ **Okay**: `.invoice-button`
- ❌ **Bad**: `.btn.btn-primary.ml-2` (too fragile)

### Writing Step Content

#### Titles (3-7 words)
- ✅ "Select a Customer"
- ✅ "Add Line Items"
- ✅ "Review and Submit"
- ❌ "This is where you select" (too long)

#### Descriptions (1-3 sentences)
- Be specific about what to do
- Explain why it matters
- Keep it under 150 characters if possible

Example:
```
"Choose the customer you want to invoice from the dropdown. 
You can search by name or company."
```

### Popover Positioning

- **Bottom**: Default, works for top navigation items
- **Top**: Good for bottom panels or footers
- **Left**: Use for right-side panels or forms
- **Right**: Use for left-side navigation or menus

## Pro Tips

### 🎯 Best Practices
1. **Test immediately**: Click "Test" after every change
2. **Keep steps focused**: One concept per step
3. **Use consistent selectors**: Add `data-guide-step` attributes to your components
4. **Progressive disclosure**: Build complexity gradually
5. **End positively**: Last step should celebrate completion

### 🔍 Debugging Steps
If a step doesn't highlight the element:
1. Open browser DevTools
2. Try the selector in console: `document.querySelector('[your-selector]')`
3. If it returns `null`, the selector is wrong
4. Adjust the selector in the editor
5. Test again

### 📋 Duplicating Steps
Use the **"📋 Duplicate"** button to:
- Create similar steps quickly
- Maintain consistent formatting
- Speed up guide creation

### 🎨 Preview Feature
The live preview shows exactly how users will see the step:
- Title and description rendering
- Position and alignment settings
- Visual representation of popover

## Common Workflows

### Workflow 1: Quick Guide Creation (5 min)
1. Click "Create New Guide"
2. Name it and describe it
3. Add 3-5 steps with clear titles
4. Set selectors for each
5. Test it
6. Adjust positions if needed
7. Save

### Workflow 2: Improving Existing Guide (10 min)
1. Test the current guide
2. Note which steps are confusing
3. Click "Edit" on that guide
4. Improve step descriptions
5. Adjust popover positions
6. Add missing steps if needed
7. Test again
8. Save when satisfied

### Workflow 3: Creating Guide Family (20 min)
1. Create a base guide with common steps
2. Export it
3. Import multiple times
4. Edit each to focus on different workflows
5. Use consistent naming (e.g., "Invoice: Creation", "Invoice: Editing")

## Keyboard Shortcuts (In Editor)

- **Tab**: Move between form fields
- **Enter**: Save when in last field
- **Esc**: Close modal (cancels changes)
- **Click outside**: Alternative to cancel

## Need Help?

### Check These First
1. **Element not highlighting?**
   - Verify selector in DevTools
   - Check if element exists on the page
   - Try a simpler selector

2. **Popover in wrong position?**
   - Try different side (top/right/bottom/left)
   - Adjust alignment (start/center/end)
   - Consider element's position on screen

3. **Changes not saved?**
   - Did you click "Save Changes"?
   - Check browser downloads folder
   - Re-import the JSON to verify

### Resources
- See `GUIDE_ADMIN_FEATURES.md` for detailed documentation
- Check existing guides in `/src/data/guides/` for examples
- Review the "Guide Design Best Practices" section in Admin Panel

---

**Ready to start?** Open http://localhost:5174/, go to Settings → Admin Panel, and click "Create New Guide"! 🚀
