import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './components/auth/signup';
import SigninPage from './components/auth/signin';
import HomePage from './components/auth/home';  // Import the HomePage component
import ForgotPassword from './components/auth/forgotPass';
import ResetPassword from './components/auth/resetPass';
import PurchaseService from './components/buyPage/purchase';
import VerifyEmail from './components/auth/verifyemail';
import { AuthProvider } from './components/auth/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home page route */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/purchase" element={<PurchaseService />} />
          <Route path="/verifyemail" element={<VerifyEmail />} />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
