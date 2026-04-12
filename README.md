# HMS Frontend - Hospital Management System

A modern, responsive React frontend for the Hospital Management System (HMS) with role-based access control and comprehensive features for managing hospital operations.

## Features

### 🏥 Multi-Role Support
- **Super Admin**: Hospital creation and management
- **Admin**: Staff management (Doctors & Receptionists)
- **Receptionist**: Patient registration and OPD management
- **Doctor**: Queue management and patient consultations

### 🎯 Core Features
- ✅ JWT Authentication
- ✅ Role-based dashboards
- ✅ Patient management
- ✅ OPD queue system
- ✅ Medical records
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS

## Project Structure

```
Frontend/
├── public/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common.jsx        # Button, Form inputs, etc.
│   │   ├── Modal.jsx         # Modal components
│   │   ├── Table.jsx         # Table component
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── DashboardLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/              # React Context
│   │   └── AuthContext.jsx   # Authentication context
│   ├── hooks/                # Custom hooks
│   │   └── index.js
│   ├── pages/                # Page components
│   │   ├── LoginPage.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   ├── superadmin/       # Super Admin pages
│   │   ├── admin/            # Admin pages
│   │   ├── receptionist/     # Receptionist pages
│   │   └── doctor/           # Doctor pages
│   ├── services/             # API services
│   │   ├── axiosInstance.js  # Axios configuration
│   │   └── apiServices.js    # API service functions
│   ├── styles/               # Global styles
│   │   └── index.css
│   ├── utils/                # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update environment variables** (if needed)
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

All API calls are handled through the `services/apiServices.js` file:

- **Authentication**: `authService.login()`
- **Super Admin**: `superAdminService.*`
- **Admin**: `adminService.*`
- **Receptionist**: `receptionistService.*`
- **Doctor**: `doctorService.*`

Authentication tokens are automatically attached to all requests via the axios interceptor in `services/axiosInstance.js`.

## Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token and user data
3. Token is stored in localStorage
4. Token is automatically attached to all API requests
5. On token expiration (401), user is redirected to login

## Key Technologies

- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **Lucide React**: Icons

## Customization

### Adding New Pages
1. Create page component in `src/pages/[role]/`
2. Add route in `src/App.jsx`
3. Add menu item in `src/components/DashboardLayout.jsx`

### Styling
- Global styles: `src/styles/index.css`
- Tailwind config: `tailwind.config.js`
- Use utility classes from `common.jsx` for consistent styling

### API Calls
- Add new service functions in `src/services/apiServices.js`
- Use the axios instance automatically configured with auth headers

## Role-Based Access Control

Each route is protected with `ProtectedRoute` component:

```jsx
<Route
  path="/admin/create-doctor"
  element={
    <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
      <DashboardLayout>
        <CreateDoctorPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

## Troubleshooting

### Authentication Issues
- Check if backend is running on port 3000
- Verify JWT token is stored in localStorage
- Check browser console for CORS errors

### API Errors
- Ensure backend routes match API service calls
- Check network tab in browser DevTools
- Verify user has correct role for the endpoint

### Styling Issues
- Rebuild Tailwind CSS: `npm run build`
- Clear browser cache
- Check `tailwind.config.js` for proper paths

## Future Enhancements
- [ ] IPD management
- [ ] Billing system
- [ ] Appointment scheduling
- [ ] Patient reports
- [ ] Analytics dashboard
- [ ] Multiple language support
- [ ] Dark mode

## Support

For issues or questions, refer to the backend documentation or create an issue in the project repository.

## License

This project is part of the Hospital Management System (HMS).
