import { AppLayout } from "../src/layouts/AppLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../src/pages/Login";

function Home() {
  return <div>Ujjiboni</div>;
}

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
