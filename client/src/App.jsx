import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import Dashboard from "./Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Authenticate from "./components/Authenticate";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Landing from "./screens/Landing";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Explore from "./screens/Explore";
import Settings from "./components/explore/Settings";
import Feeds from "./components/explore/Feeds";
import Test from "./screens/Test";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Authenticate />} />
        <Route path="/explore/*" element={<Explore />}>
          {/* Nested routes */}
          <Route path="settings" element={<Settings />} />
          <Route path="news-feed" element={<Feeds />} />
          <Route path="message" element={<div>Messages Page</div>} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
