import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./main_layout/MainLayout";
import AuthLayout from "./main_layout/AuthLayout";
import VehicleRecognitionPage from "./pages/VehicleRecognitionPage";
import ShopPage from "./pages/ShopPage";
import PartPage from "./pages/PartPage";
import UserPage from "./pages/UserPage";
import ARPreviewPage from "./pages/ARPreviewPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/" element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/preview-ar" element={<ARPreviewPage />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/recognition" element={<VehicleRecognitionPage />} />
          <Route path="/shops" element={<ShopPage />} />
          <Route path="/parts" element={<PartPage />} />
          <Route path="/users" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
