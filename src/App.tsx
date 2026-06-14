import { AppProvider } from './context/AppContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { DynamicIsland } from './components/DynamicIsland';
import { BottomNav } from './components/BottomNav';
import { DonghuaNav } from './components/DonghuaNav';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SchedulePage } from './pages/SchedulePage';
import { GenrePage } from './pages/GenrePage';
import { DetailPage } from './pages/DetailPage';
import { EpisodePage } from './pages/EpisodePage';
import { DonghuaHomePage } from './pages/DonghuaHomePage';
import { DonghuaLibraryPage } from './pages/DonghuaLibraryPage';
import { DonghuaSearchPage } from './pages/DonghuaSearchPage';
import { DonghuaSchedulePage } from './pages/DonghuaSchedulePage';
import { DonghuaGenrePage } from './pages/DonghuaGenrePage';
import { DonghuaDetailPage } from './pages/DonghuaDetailPage';
import { DonghuaEpisodePage } from './pages/DonghuaEpisodePage';
import { GenreDetailPage } from './pages/GenreDetailPage';
import { DonghuaGenreDetailPage } from './pages/DonghuaGenreDetailPage';
import { FlyingFavorite } from './components/FlyingFavorite';
import { useEffect, useState } from 'react';

const donghuaRouteNames = ['donghua','donghua-search','donghua-library','donghua-schedule','donghua-genre','donghua-detail','donghua-episode','donghua-genre-detail'];
const noNavRoutes = ['detail','episode','donghua-detail','donghua-episode'];

function Routes() {
  const { route } = useRouter();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(k => k + 1);
  }, [route]);

  let page: React.ReactNode = null;
  switch (route.name) {
    case 'home': page = <HomePage />; break;
    case 'search': page = <SearchPage />; break;
    case 'library': page = <LibraryPage />; break;
    case 'favorites': page = <FavoritesPage />; break;
    case 'schedule': page = <SchedulePage />; break;
    case 'genre': page = <GenrePage />; break;
    case 'genre-detail': page = <GenreDetailPage slug={route.slug} genreName={route.genreName} />; break;
    case 'detail': page = <DetailPage slug={route.slug} />; break;
    case 'episode': page = <EpisodePage slug={route.slug} />; break;
    // Donghua routes
    case 'donghua': page = <DonghuaHomePage />; break;
    case 'donghua-search': page = <DonghuaSearchPage />; break;
    case 'donghua-library': page = <DonghuaLibraryPage />; break;
    case 'donghua-schedule': page = <DonghuaSchedulePage />; break;
    case 'donghua-genre': page = <DonghuaGenrePage />; break;
    case 'donghua-genre-detail': page = <DonghuaGenreDetailPage slug={route.slug} genreName={route.genreName} />; break;
    case 'donghua-detail': page = <DonghuaDetailPage slug={route.slug} />; break;
    case 'donghua-episode': page = <DonghuaEpisodePage slug={route.slug} />; break;
  }

  const isDonghua = donghuaRouteNames.includes(route.name);
  const showNav = !noNavRoutes.includes(route.name);

  return (
    <>
      <div key={key} className="animate-page-in">
        {page}
      </div>
      {showNav && (isDonghua ? <DonghuaNav /> : <BottomNav />)}
    </>
  );
}

function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="blob-bg w-[400px] h-[400px] -top-20 -right-20" style={{ background: 'var(--blob-a)' }} />
      <div className="blob-bg w-[350px] h-[350px] top-1/2 -left-20" style={{ background: 'var(--blob-b)', animationDelay: '6s' }} />
      <div className="blob-bg w-[300px] h-[300px] bottom-0 right-0" style={{ background: 'var(--blob-c)', animationDelay: '10s' }} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider>
        <div className="min-h-screen relative">
          <BackgroundDecor />
          <DynamicIsland />
          <FlyingFavorite />
          <main className="max-w-md mx-auto relative">
            <Routes />
          </main>
        </div>
      </RouterProvider>
    </AppProvider>
  );
}
