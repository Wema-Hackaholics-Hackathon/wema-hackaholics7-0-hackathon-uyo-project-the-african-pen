import { createBrowserRouter } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import VerifyEmailPage from './pages/public/VerifyEmailPage'
import DashboardPage from './pages/platform/DashboardPage'
import ParcoursPage from './pages/platform/ParcoursPage'
import LessonPage from './pages/platform/LessonPage'
import BlitzPage from './pages/platform/BlitzPage'
import BlitzResultsPage from './pages/platform/BlitzResultsPage'
import ExamensPage from './pages/platform/ExamensPage'
import ExamResultsPage from './pages/platform/ExamResultsPage'
import QuizPage from './pages/platform/QuizPage'
import ValidationPage from './pages/platform/ValidationPage'
import ChatPage from './pages/platform/ChatPage'
import ProfilePage from './pages/platform/ProfilePage'
import RankingPage from './pages/platform/RankingPage'
import LaLettrePage from './pages/platform/LaLettrePage'
import LaTraductionPage from './pages/platform/LaTraductionPage'
import LaDebatPage from './pages/platform/LaDebatPage'
import LaOralPage from './pages/platform/LaOralPage'
import MesCoursPage from './pages/platform/MesCoursPage'
import OnboardingPage from './pages/platform/OnboardingPage'
import PlanSelectionPage from './pages/payment/PlanSelectionPage'
import ALATPaymentPage from './pages/payment/ALATPaymentPage'
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage'
import PaymentFailedPage from './pages/payment/PaymentFailedPage'
import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import React from 'react'

const PublicLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isAuthPage = ['/login', '/register', '/verify-email', '/plan-selection', '/onboarding'].includes(location.pathname)
  
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      {!isAuthPage && (
        <Header 
          currentView={location.pathname === '/' ? 'landing' : location.pathname.slice(1)} 
          setCurrentView={(view) => {
            if (view === 'signup') navigate('/register')
            else if (view === 'login') navigate('/login')
            else if (view === 'landing') navigate('/')
          }} 
          openSignupModal={() => navigate('/register')}
        />
      )}
      
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      
      {!isAuthPage && (
        <Footer 
          setCurrentView={(view) => {
            if (view === 'signup') navigate('/register')
            else if (view === 'login') navigate('/login')
          }} 
          openSignupModal={() => navigate('/register')}
        />
      )}
    </div>
  )
}

const PlatformLayout = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/verify-email',
        element: <VerifyEmailPage />
      },
      {
        path: '/plan-selection',
        element: <PlanSelectionPage />
      },
      {
        path: '/onboarding',
        element: <OnboardingPage />
      },
      {
        path: '/payment',
        element: <ALATPaymentPage />
      },
      {
        path: '/payment/success',
        element: <PaymentSuccessPage />
      },
      {
        path: '/payment/failed',
        element: <PaymentFailedPage />
      }
    ]
  },
  {
    element: <PlatformLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/parcours',
        element: <ParcoursPage />
      },
      {
        path: '/cours/:lessonId',
        element: <LessonPage />
      },
      {
        path: '/blitz',
        element: <BlitzPage />
      },
      {
        path: '/blitz/results',
        element: <BlitzResultsPage />
      },
      {
        path: '/examens',
        element: <ExamensPage />
      },
      {
        path: '/examens/results',
        element: <ExamResultsPage />
      },
      {
        path: '/quiz',
        element: <QuizPage />
      },
      {
        path: '/validation',
        element: <ValidationPage />
      },
      {
        path: '/chat',
        element: <ChatPage />
      },
      {
        path: '/profil',
        element: <ProfilePage />
      },
      {
        path: '/classement',
        element: <RankingPage />
      },
      {
        path: '/projets/la-lettre',
        element: <LaLettrePage />
      },
      {
        path: '/projets/la-traduction',
        element: <LaTraductionPage />
      },
      {
        path: '/projets/la-debat',
        element: <LaDebatPage />
      },
      {
        path: '/projets/la-oral',
        element: <LaOralPage />
      },
      {
        path: '/mes-cours',
        element: <MesCoursPage />
      }
    ]
  }
])
