import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnimeHomePage from './pages/anime/AnimeHomePage';
import AnimeSchedulePage from './pages/anime/AnimeSchedulePage';
import AnimeDetailPage from './pages/anime/AnimeDetailPage';
import AnimeWatchPage from './pages/anime/AnimeWatchPage';
import AnimeSearchPage from './pages/anime/AnimeSearchPage';
import DonghuaHomePage from './pages/donghua/DonghuaHomePage';
import DonghuaSchedulePage from './pages/donghua/DonghuaSchedulePage';
import DonghuaDetailPage from './pages/donghua/DonghuaDetailPage';
import DonghuaWatchPage from './pages/donghua/DonghuaWatchPage';
import DonghuaSearchPage from './pages/donghua/DonghuaSearchPage';
import ComicHomePage from './pages/comic/ComicHomePage';
import ComicDetailPage from './pages/comic/ComicDetailPage';
import ComicGenresPage from './pages/comic/ComicGenresPage';
import ComicSearchPage from './pages/comic/ComicSearchPage';
import ComicReadPage from './pages/comic/ComicReadPage';
import ComicByGenrePage from './pages/comic/ComicByGenrePage';
import NovelHomePage from './pages/novel/NovelHomePage';
import NovelDetailPage from './pages/novel/NovelDetailPage';
import NovelSearchPage from './pages/novel/NovelSearchPage';
import NovelReadPage from './pages/novel/NovelReadPage';
import NovelGenresPage from './pages/novel/NovelGenresPage';
import FavoritePage from './pages/FavoritePage';
import AboutPage from './pages/AboutPage';
import UpdatesPage from './pages/UpdatesPage';
import FloatingInbox from './components/FloatingInbox';
import DrachinHomePage from './pages/drachin/DrachinHomePage';
import DrachinSearchPage from './pages/drachin/DrachinSearchPage';
import DrachinDetailPage from './pages/drachin/DrachinDetailPage';
import DrachinWatchPage from './pages/drachin/DrachinWatchPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-darker">
      <Navbar />
      <ScrollToTop />
      <FloatingInbox />
      <main className="pt-[3.5rem] md:pt-[6.5rem]" key={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Anime Routes */}
          <Route path="/s/anime/" element={<AnimeHomePage />} />
          <Route path="/s/anime/schedule" element={<AnimeSchedulePage />} />
          <Route path="/s/anime/detail/:slug" element={<AnimeDetailPage />} />
          <Route path="/s/anime/watch/:episodeId" element={<AnimeWatchPage />} />
          <Route path="/s/anime/search" element={<AnimeSearchPage />} />

          {/* Donghua Routes */}
          <Route path="/s/donghua/" element={<DonghuaHomePage />} />
          <Route path="/s/donghua/schedule" element={<DonghuaSchedulePage />} />
          <Route path="/s/donghua/detail/:slug" element={<DonghuaDetailPage />} />
          <Route path="/s/donghua/watch/:slug" element={<DonghuaWatchPage />} />
          <Route path="/s/donghua/search" element={<DonghuaSearchPage />} />

          {/* Comic Routes */}
          <Route path="/s/comic/" element={<ComicHomePage />} />
          <Route path="/s/comic/detail/:slug" element={<ComicDetailPage />} />
          <Route path="/s/comic/genres" element={<ComicGenresPage />} />
          <Route path="/s/comic/genre/:genre" element={<ComicByGenrePage />} />
          <Route path="/s/comic/search" element={<ComicSearchPage />} />
          <Route path="/s/comic/read/:chapterSlug" element={<ComicReadPage />} />

          {/* Novel Routes */}
          <Route path="/s/novel/" element={<NovelHomePage />} />
          <Route path="/s/novel/detail/:slug" element={<NovelDetailPage />} />
          <Route path="/s/novel/genres" element={<NovelGenresPage />} />
          <Route path="/s/novel/search" element={<NovelSearchPage />} />
          <Route path="/s/novel/baca/:chapterSlug" element={<NovelReadPage />} />

          {/* Drachin Routes */}
          <Route path="/s/drachin/" element={<DrachinHomePage />} />
          <Route path="/s/drachin/detail/:collectionId" element={<DrachinDetailPage />} />
          <Route path="/s/drachin/search" element={<DrachinSearchPage />} />
          <Route path="/s/drachin/watch/:collectionId/:episode" element={<DrachinWatchPage />} />

          {/* Other Routes */}
          <Route path="/s/favorite/" element={<FavoritePage />} />
          <Route path="/s/about/" element={<AboutPage />} />
          <Route path="/s/updates/" element={<UpdatesPage />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-2">404</h1>
              <p className="font-mono text-text-secondary">Halaman tidak ditemukan</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
