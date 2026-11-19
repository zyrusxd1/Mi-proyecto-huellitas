import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { AnimalsPage } from './pages/AnimalsPage';
import { StorePage } from './pages/StorePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { NewsPage } from './pages/NewsPage';
import { CommunityPage } from './pages/CommunityPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPanel } from './pages/AdminPanel';

const AppShell: React.FC = () => {
  const { isAdminLoggedIn } = useApp();
  const [route, setRoute] = useState<PublicRoute>('inicio');
  const [initialAnimalId, setInitialAnimalId] = useState<string | null>(null);
  const [initialNewsId, setInitialNewsId] = useState<string | null>(null);
  const [storeLookupCode, setStoreLookupCode] = useState<string | undefined>(undefined);

  const navigate = (nextRoute: PublicRoute) => {
    if (nextRoute === 'admin' && !isAdminLoggedIn) {
      setRoute('admin-login');
    } else {
      setRoute(nextRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (route === 'admin' && !isAdminLoggedIn) {
      setRoute('admin-login');
    }
  }, [route, isAdminLoggedIn]);

  if (route === 'admin' && isAdminLoggedIn) {
    return <AdminPanel onBackToSite={() => navigate('inicio')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EFE4] text-[#2B2118]">
      <Navbar currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route === 'inicio' && (
          <HomePage
            onNavigate={navigate}
            onSelectAnimal={(id) => {
              setInitialAnimalId(id);
              navigate('animales');
            }}
            onSelectNews={(id) => {
              setInitialNewsId(id);
              navigate('noticias');
            }}
          />
        )}

        {route === 'animales' && (
          <AnimalsPage
            initialAnimalId={initialAnimalId}
            onClearInitialAnimal={() => setInitialAnimalId(null)}
          />
        )}

        {route === 'tienda' && <StorePage lookupCodePrefill={storeLookupCode} />}

        {route === 'campanas' && <CampaignsPage />}

        {route === 'noticias' && (
          <NewsPage
            initialNewsId={initialNewsId}
            onClearInitialNews={() => setInitialNewsId(null)}
          />
        )}

        {route === 'comunidad' && <CommunityPage />}

        {route === 'nosotros' && <AboutPage />}

        {route === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={() => setRoute('admin')}
            onBackToSite={() => navigate('inicio')}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

      <CartDrawer
        onGoToStoreLookup={(code) => {
          setStoreLookupCode(code);
          navigate('tienda');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
