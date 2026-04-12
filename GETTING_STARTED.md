# Getting Started with HMS Frontend

## Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Ensure you have Node.js installed
node --version  # Should be v14 or higher
npm --version
```

### 2. Install Dependencies
```bash
cd Frontend
npm install
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# The default settings should work if backend runs on port 3000
# Update if your backend runs on a different port/URL
```

### 4. Start Development Server
```bash
npm run dev
```

Open `http://localhost:3001` in your browser. You should see the login page.

### 5. Login with Demo Credentials
Use the following credentials to test different roles:

#### Super Admin
- **Email**: superadmin@gmail.com
- **Password**: 12345

#### Admin (Hospital Admin)
- **Email**: admin@gmail.com
- **Password**: 12345

#### Doctor
- **Email**: doctor@gmail.com
- **Password**: 12345

#### Receptionist
- **Email**: receptionist@gmail.com
- **Password**: 12345

> Note: These are default credentials from your backend seed. Update them in the backend seed file if desired.

## Project Structure Overview

```
Frontend/
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context for auth
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components by role
│   ├── services/            # API calls and axios config
│   ├── styles/              # Global CSS
│   ├── utils/               # Helper functions and constants
│   ├── App.jsx              # Main App with routing
│   └── main.jsx             # React DOM entry point
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── postcss.config.js        # PostCSS config
```

## Common Tasks

### Add a New Page
1. Create component in `src/pages/[role]/[PageName].jsx`
2. Add route in `src/App.jsx`
3. Add sidebar menu item in `src/components/DashboardLayout.jsx`

Example:
```jsx
// src/pages/admin/NewPage.jsx
export const NewPage = () => {
  return <div>Your content here</div>;
};
```

```jsx
// src/App.jsx - Add route
<Route path="/admin/new-page" element={...} />
```

### Make an API Call
```jsx
import { adminService } from '../../services/apiServices';

const result = await adminService.getDoctors();
console.log(result.data);
```

### Handle Forms
```jsx
import { useForm } from '../../hooks';
import { FormInput, Button } from '../../components/common';

const { values, handleChange, handleSubmit } = useForm(
  { name: '', email: '' },
  async (values) => {
    // Submit logic here
  }
);
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Backend Connection Error
- Verify backend is running on port 3000
- Check `VITE_API_BASE_URL` in `.env`
- Look at browser console (F12) for CORS errors

### Token/Authentication Issues
- Clear browser cache/cookies
- Check localStorage in DevTools
- Verify backend returns valid JWT token

### Styles Not Applying
- Rebuild: `npm run dev` and refresh browser
- Check class names match tailwind config
- Verify Tailwind CSS is imported in `src/styles/index.css`

## Development Tips

### Hot Module Replacement (HMR)
Changes are automatically reflected in browser during development.

### Debug with React DevTools
- Install React DevTools browser extension
- Inspect components and their props in tab DevTools

### Check Network Requests
- Open browser DevTools (F12)
- Go to Network tab
- Check API requests and responses

### Format Code
All code should follow Tailwind CSS and React best practices.

## Before Production Build

1. **Update API URL**
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

2. **Remove demo credentials**
   - Update login page message
   - Or remove it entirely

3. **Test all role workflows**
   - Login as each role
   - Test main features
   - Check responsive design on mobile

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview build**
   ```bash
   npm run preview
   ```

## Deployment

### Vercel (Recommended for Vite)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Traditional Server
```bash
# Build
npm run build

# Deploy 'dist' folder to your server
```

## Next Steps

1. ✅ Get frontend running
2. Read through the [Main README.md](./README.md)
3. Explore each role's dashboard
4. Test the main workflows
5. Customize styling as needed
6. Deploy to production

## Need Help?

- Check browser console for errors (F12)
- Review API responses in Network tab
- Check backend logs for API errors
- Double-check role permissions in `src/utils/constants.js`

---

Happy coding! 🚀
