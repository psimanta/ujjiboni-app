import { AppLayout } from './layouts/AppLayout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { useStore } from './store';
import { AccountsPage } from './pages/AccountsPage';
import { AccountDetailsPage } from './pages/AccountDetailsPage';
import { LoansPage } from './pages/LoansPage';
import { LoanDetailsPage } from './pages/LoanDetailsPage';
import { MembersPage } from './pages/MembersPage';
import { SettingsPage } from './pages/SettingsPage';
import { SetupPasswordPage } from './pages/SetupPasswordPage';

export const AppRouter = () => {
  const { isAuthenticated } = useStore(state => state);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/accounts/:id" element={<AccountDetailsPage />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/loans/:id" element={<LoanDetailsPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/setup-password" element={<SetupPasswordPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
