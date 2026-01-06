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

import ViewProfile from "./ViewProfile";

import Login from "./Login";

import PaymentSuccess from "./PaymentSuccess";

import PaymentCancel from "./PaymentCancel";

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

    ViewProfile: ViewProfile,

    Login: Login,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // Handle routes with parameters (e.g., /view-profile/:userId)
    const urlParts = url.split('/').filter(Boolean);

    // Check for known parameterized routes
    if (urlParts.length >= 2) {
        const routeBase = urlParts[urlParts.length - 2]; // e.g., "view-profile" from "/view-profile/123"
        const normalizedRouteBase = routeBase.toLowerCase().replace(/-/g, '');
        const matchedPage = Object.keys(PAGES).find(page => page.toLowerCase() === normalizedRouteBase);
        if (matchedPage) {
            return matchedPage;
        }
    }

    let urlLastPart = urlParts[urlParts.length - 1] || '';
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    // Convert kebab-case URL to match PascalCase page names
    // e.g., "recommended-profiles" -> "recommendedprofiles" for comparison
    const normalizedUrl = urlLastPart.toLowerCase().replace(/-/g, '');

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === normalizedUrl);
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
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />

                {/* Public only routes - redirect to dashboard if logged in */}
                <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

                {/* Onboarding - accessible to both authenticated (step 2+) and unauthenticated (step 1) users */}
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
                <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/recommended-profiles" element={<ProtectedRoute><RecommendedProfiles /></ProtectedRoute>} />
                <Route path="/view-profile/:userId" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />

                {/* Payment result routes */}
                <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
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