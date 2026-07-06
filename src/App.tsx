import { useEffect, useState } from 'react';
import { ModeProvider } from './context/ModeContext';
import { Navbar, type PageId } from './components/Navbar';
import { Home } from './pages/Home';
import { Twin } from './pages/Twin';
import { QuestGame } from './pages/Quest';

function App() {
  const [page, setPage] = useState<PageId>(() => {
    const hash = window.location.hash.replace('#/', '');
    return (['home', 'twin', 'quest'].includes(hash) ? hash : 'home') as PageId;
  });

  const navigate = (p: PageId) => {
    setPage(p);
    window.location.hash = `/${p}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#/', '');
      if (['home', 'twin', 'quest'].includes(h)) setPage(h as PageId);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <ModeProvider>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar page={page} onNavigate={navigate} />
        <main className="flex-1">
          {page === 'home' && <Home onNavigate={navigate} />}
          {page === 'twin' && <Twin onNavigate={navigate} />}
          {page === 'quest' && <QuestGame />}
        </main>
        <Footer onNavigate={navigate} />
      </div>
    </ModeProvider>
  );
}

function Footer({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <footer className="border-t mt-8" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-7 w-7 rounded-lg text-white" style={{ background: 'var(--brand)' }}>
            <span className="text-xs font-bold">H</span>
          </span>
          <span className="font-display font-bold">HealthQuest</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted">
          <button onClick={() => onNavigate('home')} className="hover:text-[var(--text)] transition-colors">Home</button>
          <button onClick={() => onNavigate('twin')} className="hover:text-[var(--text)] transition-colors">Digital Twin</button>
          <button onClick={() => onNavigate('quest')} className="hover:text-[var(--text)] transition-colors">Quest</button>
        </div>
        <div className="text-xs text-muted">A demo digital-twin concept · No real medical data</div>
      </div>
    </footer>
  );
}

export default App;
