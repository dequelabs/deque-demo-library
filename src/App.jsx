import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';

// FinTech (fully built)
import FintechLayout from './sites/fintech/Layout.jsx';
import PublicLayout from './sites/fintech/PublicLayout.jsx';
import AuthLayout from './sites/fintech/AuthLayout.jsx';
import { ProtectedRoute } from './sites/fintech/auth.jsx';
import FintechHome from './sites/fintech/Home.jsx';
import FintechAbout from './sites/fintech/About.jsx';
import FintechBusiness from './sites/fintech/Business.jsx';
import FintechWealth from './sites/fintech/Wealth.jsx';
import FintechHelp from './sites/fintech/Help.jsx';
import FintechLegal from './sites/fintech/Legal.jsx';
import FintechForgot from './sites/fintech/Forgot.jsx';
import FintechChecking from './sites/fintech/products/Checking.jsx';
import FintechSavings from './sites/fintech/products/Savings.jsx';
import FintechCreditCards from './sites/fintech/products/CreditCards.jsx';
import FintechMortgages from './sites/fintech/products/Mortgages.jsx';
import FintechLogin from './sites/fintech/Login.jsx';
import FintechDashboard from './sites/fintech/Dashboard.jsx';
import FintechTransfer from './sites/fintech/Transfer.jsx';
import FintechBills from './sites/fintech/Bills.jsx';
import FintechDeposit from './sites/fintech/Deposit.jsx';
import FintechStatements from './sites/fintech/Statements.jsx';
import FintechCards from './sites/fintech/Cards.jsx';
import FintechProfile from './sites/fintech/Profile.jsx';

// Education / Government (Northbrook Connect)
import EduGovLayout from './sites/edu-gov/Layout.jsx';
import EduGovPublicLayout from './sites/edu-gov/PublicLayout.jsx';
import EduGovAuthLayout from './sites/edu-gov/AuthLayout.jsx';
import { ProtectedRoute as EduGovProtectedRoute } from './sites/edu-gov/auth.jsx';
import EduGovHome from './sites/edu-gov/Home.jsx';
import EduGovLogin from './sites/edu-gov/Login.jsx';
import EduGovAccount from './sites/edu-gov/Account.jsx';
import EduGovSchools from './sites/edu-gov/Schools.jsx';
import EduGovEnroll from './sites/edu-gov/Enroll.jsx';
import EduGovGrades from './sites/edu-gov/Grades.jsx';
import EduGovUniversity from './sites/edu-gov/University.jsx';
import EduGovRegister from './sites/edu-gov/Register.jsx';
import EduGovServices from './sites/edu-gov/Services.jsx';
import EduGovDMV from './sites/edu-gov/DMV.jsx';
import EduGovBenefits from './sites/edu-gov/Benefits.jsx';
import EduGovCity from './sites/edu-gov/City.jsx';
import EduGovPermits from './sites/edu-gov/Permits.jsx';
import EduGovVote from './sites/edu-gov/Vote.jsx';
import EduGovComingSoon from './sites/edu-gov/ComingSoon.jsx';

// Other sectors - stubbed pending approval
import SaasLayout from './sites/saas/Layout.jsx';
import SaasStub from './sites/saas/Stub.jsx';
import AgencyLayout from './sites/agency/Layout.jsx';
import AgencyStub from './sites/agency/Stub.jsx';
import HospitalityLayout from './sites/hospitality/Layout.jsx';
import HospitalityStub from './sites/hospitality/Stub.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* FinTech / Banking — store provider lives in FintechLayout */}
      <Route path="/fintech" element={<FintechLayout />}>
        {/* Public-facing pages */}
        <Route element={<PublicLayout />}>
          <Route index element={<FintechHome />} />
          <Route path="about"        element={<FintechAbout />} />
          <Route path="business"     element={<FintechBusiness />} />
          <Route path="wealth"       element={<FintechWealth />} />
          <Route path="help"         element={<FintechHelp />} />
          <Route path="legal"        element={<FintechLegal />} />
          <Route path="forgot"       element={<FintechForgot />} />
          <Route path="checking"     element={<FintechChecking />} />
          <Route path="savings"      element={<FintechSavings />} />
          <Route path="credit-cards" element={<FintechCreditCards />} />
          <Route path="mortgages"    element={<FintechMortgages />} />
          <Route path="login"        element={<FintechLogin />} />
        </Route>

        {/* Authed pages */}
        <Route
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard"  element={<FintechDashboard />} />
          <Route path="transfer"   element={<FintechTransfer />} />
          <Route path="bills"      element={<FintechBills />} />
          <Route path="deposit"    element={<FintechDeposit />} />
          <Route path="statements" element={<FintechStatements />} />
          <Route path="cards"      element={<FintechCards />} />
          <Route path="profile"    element={<FintechProfile />} />
        </Route>
      </Route>

      {/* Education / Government — Northbrook Connect */}
      <Route path="/edu-gov" element={<EduGovLayout />}>
        {/* Public-facing pages */}
        <Route element={<EduGovPublicLayout />}>
          <Route index               element={<EduGovHome />} />
          <Route path="login"        element={<EduGovLogin />} />
          <Route path="schools"      element={<EduGovSchools />} />
          <Route path="university"   element={<EduGovUniversity />} />
          <Route path="services"     element={<EduGovServices />} />
          <Route path="city"         element={<EduGovCity />} />
          <Route path="about"        element={<EduGovComingSoon />} />
        </Route>

        {/* Authed pages */}
        <Route
          element={
            <EduGovProtectedRoute>
              <EduGovAuthLayout />
            </EduGovProtectedRoute>
          }
        >
          <Route path="account"              element={<EduGovAccount />} />
          <Route path="schools/enroll"       element={<EduGovEnroll />} />
          <Route path="schools/grades"       element={<EduGovGrades />} />
          <Route path="university/register"  element={<EduGovRegister />} />
          <Route path="services/dmv"         element={<EduGovDMV />} />
          <Route path="services/benefits"    element={<EduGovBenefits />} />
          <Route path="city/permits"         element={<EduGovPermits />} />
          <Route path="city/vote"            element={<EduGovVote />} />
        </Route>
      </Route>

      {/* SaaS */}
      <Route path="/saas" element={<SaasLayout />}>
        <Route index element={<SaasStub />} />
      </Route>

      {/* Agency */}
      <Route path="/agency" element={<AgencyLayout />}>
        <Route index element={<AgencyStub />} />
      </Route>

      {/* Hospitality */}
      <Route path="/hospitality" element={<HospitalityLayout />}>
        <Route index element={<HospitalityStub />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
