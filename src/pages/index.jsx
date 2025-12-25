import Layout from "./Layout.jsx";

import Home from "./Home";

import About from "./About";

import Membership from "./Membership";

import Safety from "./Safety";

import FAQ from "./FAQ";

import Onboarding from "./Onboarding";

import Dashboard from "./Dashboard";

import Browse from "./Browse";

import Matches from "./Matches";

import Profile from "./Profile";

import Messages from "./Messages";

import EditProfile from "./EditProfile";

import TermsOfService from "./TermsOfService";

import RecommendedProfiles from "./RecommendedProfiles";

import Login from "./Login";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Home: Home,

    About: About,

    Membership: Membership,

    Safety: Safety,

    FAQ: FAQ,

    Onboarding: Onboarding,

    Dashboard: Dashboard,

    Browse: Browse,

    Matches: Matches,

    Profile: Profile,

    Messages: Messages,

    EditProfile: EditProfile,

    TermsOfService: TermsOfService,

    RecommendedProfiles: RecommendedProfiles,

    Login: Login,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/Membership" element={<Membership />} />
                <Route path="/Safety" element={<Safety />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />

                {/* Public only routes - redirect to dashboard if logged in */}
                <Route path="/Login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                <Route path="/Onboarding" element={<PublicOnlyRoute><Onboarding /></PublicOnlyRoute>} />

                {/* Protected routes */}
                <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/Browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
                <Route path="/Matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
                <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/Messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/EditProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/RecommendedProfiles" element={<ProtectedRoute><RecommendedProfiles /></ProtectedRoute>} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}