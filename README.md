# School Library Management System - Frontend

A modern, beautiful library management system built with React and JSX. This frontend provides an intuitive interface for students, teachers, and librarians to manage library resources.

## 🚀 Features

### For Students & Teachers
- **Beautiful Dashboard** - Overview of borrowed books and due dates
- **Book Browsing** - Search and filter books by title, author, genre
- **Book Details** - Comprehensive book information with borrowing functionality
- **My Books** - Track borrowed books and return them easily
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### For Librarians & Administrators
- **Admin Dashboard** - Library statistics and overview
- **Book Management** - Add, edit, and remove books
- **Borrowing Monitoring** - Track all library activity
- **User Management** - Monitor user borrowing patterns

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **JSX** - Clean, readable component syntax
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. **Install dependencies:**
   ```bash
   cd library-frontend
   npm install
   ```

2. **Create environment file:**
   ```bash
   echo "VITE_API_URL=http://localhost:5001/api" > .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎨 Design Features

### Modern UI/UX
- **Clean Design** - Minimalist, professional interface
- **Color Scheme** - Library blue theme with proper contrast
- **Typography** - Inter font for excellent readability
- **Animations** - Smooth transitions and loading states
- **Icons** - Lucide React icons for consistency

### Responsive Layout
- **Mobile First** - Optimized for mobile devices
- **Tablet Friendly** - Perfect layout for tablets
- **Desktop Enhanced** - Full features on larger screens
- **Touch Friendly** - Large buttons and touch targets

### User Experience
- **Loading States** - Beautiful loading spinners
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Clear confirmation messages
- **Navigation** - Intuitive breadcrumbs and back buttons

## 📱 Pages & Components

### Core Pages
- **Login** - Secure authentication with demo credentials
- **Dashboard** - Overview with quick actions and statistics
- **Book List** - Browse and search books with filters
- **Book Detail** - Comprehensive book information and borrowing
- **My Books** - Manage borrowed books and returns
- **Admin Panel** - Library management for librarians

### Reusable Components
- **Navbar** - Responsive navigation with user menu
- **LoadingSpinner** - Consistent loading states
- **Cards** - Reusable card components
- **Buttons** - Styled button variants
- **Badges** - Status indicators

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:5001/api
```

### Tailwind Configuration
Custom colors and components defined in `tailwind.config.js`:
- Library blue theme
- Custom button styles
- Responsive breakpoints
- Animation utilities

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/          # React components
│   ├── Login.jsx       # Authentication
│   ├── Dashboard.jsx   # Main dashboard
│   ├── BookList.jsx    # Book browsing
│   ├── BookDetail.jsx  # Book details
│   ├── MyBooks.jsx     # User's books
│   ├── AdminPanel.jsx  # Admin interface
│   ├── Navbar.jsx      # Navigation
│   └── LoadingSpinner.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── services/           # API services
│   └── api.js         # HTTP client
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Key Features

### Authentication
- JWT token management
- Automatic token refresh
- Protected routes
- User role-based access

### Book Management
- Search and filter books
- Pagination support
- Genre filtering
- Availability status

### Borrowing System
- One-click borrowing
- Due date tracking
- Overdue notifications
- Easy returns

### Admin Features
- Library statistics
- Recent activity monitoring
- Book management tools
- User activity tracking

## 🎨 Customization

### Colors
The system uses a custom color palette defined in Tailwind config:
- `library-blue` - Primary brand color
- `library-green` - Success states
- `library-orange` - Warning states
- `library-red` - Error states

### Components
All components are built with Tailwind CSS classes and can be easily customized by modifying the CSS classes or adding new utility classes.

## 📱 Mobile Optimization

The frontend is fully responsive and optimized for mobile devices:
- Touch-friendly buttons
- Swipe gestures
- Mobile-first navigation
- Optimized images
- Fast loading times

## 🔒 Security

- JWT token authentication
- Secure API communication
- Protected admin routes
- Input validation
- XSS protection

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify** - Drag and drop the `dist` folder
- **Vercel** - Connect your GitHub repository
- **Firebase** - Use Firebase Hosting
- **AWS S3** - Static website hosting

### Environment Variables for Production
Make sure to set the correct API URL for your production backend:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, JSX, and Tailwind CSS** 