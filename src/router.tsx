import { AppLayout } from './layouts/AppLayout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { useStore } from './store';
import { AccountsPage } from './pages/AccountsPage';

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
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
            </>
          )}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
