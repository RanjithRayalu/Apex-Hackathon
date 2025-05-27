
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/components/Landing";
import HRDashboard from "@/components/HRDashboard";
import JobDetails from "@/components/JobDetails";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleTryDemo = () => {
    setShowDashboard(true);
  };

  if (!showDashboard) {
    return <Landing onTryDemo={handleTryDemo} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HRDashboard />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Index;
