import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import BannerImage from "./pages/BannerImage";
import SubCategory from "./pages/SubCategory";
import Category from "./pages/Category";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/BannerImage" element={<BannerImage />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/SubCategory" element={<SubCategory />} />
      </Routes>
    </Router>
  );
};

export default App;
