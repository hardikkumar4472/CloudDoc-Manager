// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import MainPage from "./MainPage";
// import LoginPage from "./LoginPage";
// import RegisterPage from "./RegisterPage";
// import DashboardPage from "./DashboardPage";
// import SharedFilePage from "./components/SharedFilePage";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<MainPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <DashboardPage />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/share/:token" element={<SharedFilePage />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import SharedFilePage from "./components/SharedFilePage";

// ✅ Initialize Google Analytics (GA4)
const TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your actual GA4 measurement ID

// ✅ Track page views when route changes
const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return (
    <BrowserRouter>
      <TrackPageView />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/share/:token" element={<SharedFilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
