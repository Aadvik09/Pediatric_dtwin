import { useEffect, useRef, useState } from 'react';
import {
  Heart, MessageCircle, Send, Bookmark, Plus, Camera, Play, Volume2, VolumeX,
  Grid3x3, Film, Users, MoreHorizontal, Check, X, Sparkles,
} from 'lucide-react';
import {
  friends as initialFriends, posts as initialPosts, reels as initialReels,
  currentUser, type Friend, type Post, type Reel,
} from '../data/social';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Tab = 'feed' | 'reels' | 'friends';

export function Media() {
  const [tab, setTab] = useState<Tab>('feed');
  const [friends, setFriends] = useLocalStorage<Friend[]>('healthquest:friends', initialFriends);
  const [posts, setPosts] = useLocalStorage<Post[]>('healthquest:posts', initialPosts);
  const [reels, setReels] = useLocalStorage<Reel[]>('healthquest:reels', initialReels);
  const [composeOpen, setComposeOpen] = useState(false);

  const friendById = (id: string) => id === 'me' ? currentUser : friends.find((f) => f.id === id);

  const toggleLike = (postId: string) => {
    setPosts((ps) => ps.map((p) => p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
  };
  const toggleFollow = (id: string) => {
    setFriends((fs) => fs.map((f) => f.id === id ? { ...f, isFollowing: !f.isFollowing } : f));
  };
  const toggleReelLike = (id: string) => {
    setReels((rs) => rs.map((r) => r.id === id ? { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) } : r));
  };
  const addPost = (caption: string, image: string) => {
    const newPost: Post = { id: `p-${Date.now()}`, authorId: 'me', caption, image, likes: 0, comments: [], time: 'now', tag: 'New' };
    setPosts((ps) => [newPost, ...ps]);
  };

  return (
    <div className="animate-fade-in py-6">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
          <div>
            <div className="chip mb-2" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>
              <Camera className="h-3.5 w-3.5" /> Parent community
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">HealthQuest Community</h1>
          </div>
          <button onClick={() => setComposeOpen(true)} className="btn btn-primary">
            <Plus className="h-4 w-4" /> Post
          </button>
        </div>

        {/* Profile strip */}
        <div className="card p-5 mb-5 flex items-center gap-5 animate-fade-up">
          <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 rounded-full object-cover ring-2" style={{ outlineColor: 'var(--brand)' }} />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg">{currentUser.name}</div>
            <div className="text-sm text-muted">{currentUser.handle}</div>
            <div className="text-xs text-muted mt-0.5">{currentUser.bio}</div>
          </div>
          <div className="flex gap-5 text-center">
            <div><div className="font-bold">{currentUser.posts}</div><div className="text-[11px] text-muted">posts</div></div>
            <div><div className="font-bold">{currentUser.followers}</div><div className="text-[11px] text-muted">followers</div></div>
            <div><div className="font-bold">{currentUser.followingCount}</div><div className="text-[11px] text-muted">following</div></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
          {([['feed', 'Feed', Grid3x3], ['reels', 'Reels', Film], ['friends', 'Friends', Users]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors relative ${tab === id ? 'text-[var(--text)]' : 'text-muted hover:text-[var(--text-soft)]'}`}
            >
              <Icon className="h-4 w-4" /> {label}
              {tab === id && <span className="absolute inset-x-0 -bottom-px h-0.5" style={{ background: 'var(--brand)' }} />}
            </button>
          ))}
        </div>

        {tab === 'feed' && <Feed posts={posts} friendById={friendById} onLike={toggleLike} />}
        {tab === 'reels' && <Reels reels={reels} friendById={friendById} onLike={toggleReelLike} />}
        {tab === 'friends' && <FriendsView friends={friends} onToggle={toggleFollow} />}
      </div>

      {composeOpen && <ComposeModal onClose={() => setComposeOpen(false)} onPost={addPost} />}
    </div>
  );
}

/* ---------------- Feed ---------------- */
function Feed({ posts, friendById, onLike }: { posts: Post[]; friendById: (id: string) => Friend | undefined; onLike: (id: string) => void }) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {posts.map((p, i) => {
        const author = friendById(p.authorId);
        return (
          <article key={p.id} className="card overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            {/* header */}
            <div className="flex items-center gap-3 p-4">
              <img src={author?.avatar} alt={author?.name} className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{author?.name}</div>
                <div className="text-[11px] text-muted">{author?.handle} · {p.time}</div>
              </div>
              {p.tag && <span className="chip text-[10px]" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>{p.tag}</span>}
              <button className="text-muted hover:text-[var(--text)]"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            {/* image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-alt)]">
              <img src={p.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            {/* actions */}
            <div className="flex items-center gap-4 px-4 pt-3">
              <button onClick={() => onLike(p.id)} className="flex items-center gap-1.5 text-sm group">
                <Heart className={`h-6 w-6 transition-all ${p.liked ? 'fill-red-500 text-red-500 scale-110' : 'text-soft group-hover:text-red-500'}`} />
                <span className="font-semibold text-soft">{p.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-soft">
                <MessageCircle className="h-6 w-6" /> <span className="font-semibold">{p.comments.length}</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-soft">
                <Send className="h-6 w-6" />
              </button>
              <button className="ml-auto text-soft hover:text-[var(--text)]"><Bookmark className="h-6 w-6" /></button>
            </div>
            {/* caption + comments */}
            <div className="px-4 py-3 space-y-1.5">
              <div className="text-sm"><span className="font-semibold">{author?.handle}</span> {p.caption}</div>
              {p.comments.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  {p.comments.map((c, j) => (
                    <div key={j} className="text-sm text-soft flex items-start gap-2">
                      <img src={c.avatar} alt="" className="h-5 w-5 rounded-full object-cover mt-0.5" />
                      <span><span className="font-semibold">{c.author}</span> {c.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ---------------- Reels ---------------- */
function Reels({ reels, friendById, onLike }: { reels: Reel[]; friendById: (id: string) => Friend | undefined; onLike: (id: string) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Snap-scroll detection
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const idx = Math.round(el.scrollTop / h);
      setActiveIdx(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[70vh] overflow-y-scroll snap-y snap-mandatory no-scrollbar rounded-2xl border" style={{ borderColor: 'var(--border)', background: '#000' }}>
      {reels.map((r, i) => {
        const author = friendById(r.authorId);
        return (
          <div key={r.id} className="relative h-full w-full snap-center flex items-center justify-center">
            <ReelPlayer reel={r} active={i === activeIdx} />
            {/* overlay UI */}
            <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 text-white">
              <button onClick={() => onLike(r.id)} className="flex flex-col items-center gap-1">
                <Heart className={`h-8 w-8 drop-shadow-lg transition-all ${r.liked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                <span className="text-xs font-semibold">{r.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <MessageCircle className="h-8 w-8 drop-shadow-lg" />
                <span className="text-xs font-semibold">0</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <Send className="h-8 w-8 drop-shadow-lg" />
              </button>
            </div>
            {/* caption */}
            <div className="absolute left-4 bottom-20 right-20 text-white">
              <div className="flex items-center gap-2 mb-2">
                <img src={author?.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/60" />
                <span className="font-bold text-sm">{author?.handle}</span>
                {r.tag && <span className="chip text-[10px] glass text-white">{r.tag}</span>}
              </div>
              <div className="text-sm drop-shadow-lg">{r.caption}</div>
            </div>
            {/* play hint when not active */}
            {i !== activeIdx && (
              <div className="absolute inset-0 grid place-items-center bg-black/40">
                <Play className="h-12 w-12 text-white/80" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReelPlayer({ reel, active }: { reel: Reel; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <>
      <video
        ref={ref}
        src={reel.videoUrl}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={toggle}
        className="h-full w-full object-cover"
      />
      {/* center play/pause */}
      {!playing && active && (
        <button onClick={toggle} className="absolute inset-0 grid place-items-center">
          <span className="grid place-items-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm animate-pop">
            <Play className="h-8 w-8 text-white" />
          </span>
        </button>
      )}
      {/* mute toggle */}
      <button onClick={() => { setMuted((m) => !m); if (!muted) ref.current?.play().catch(() => {}); }} className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-white/15 backdrop-blur-sm text-white">
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  );
}

/* ---------------- Friends ---------------- */
function FriendsView({ friends, onToggle }: { friends: Friend[]; onToggle: (id: string) => void }) {
  const [q, setQ] = useState('');
  const filtered = friends.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()) || f.handle.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="max-w-2xl mx-auto">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search friends…"
        className="w-full rounded-xl px-4 py-3 text-sm bg-transparent border focus:ring-focus mb-4"
        style={{ borderColor: 'var(--border)' }}
      />
      <div className="space-y-2.5">
        {filtered.map((f, i) => (
          <div key={f.id} className="card p-4 flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
            <img src={f.avatar} alt={f.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{f.name}</div>
              <div className="text-xs text-muted truncate">{f.handle} · {f.bio}</div>
              <div className="text-[11px] text-muted mt-0.5">{f.posts} posts · {f.followers} followers · {f.followingCount} following</div>
            </div>
            <button
              onClick={() => onToggle(f.id)}
              className={`btn text-sm ${f.isFollowing ? 'btn-outline' : 'btn-primary'}`}
            >
              {f.isFollowing ? <><Check className="h-4 w-4" /> Following</> : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Compose ---------------- */
const STOCK_IMAGES = [
  'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3933252/pexels-photo-3933252.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
];

function ComposeModal({ onClose, onPost }: { onClose: () => void; onPost: (caption: string, image: string) => void }) {
  const [caption, setCaption] = useState('');
  const [img, setImg] = useState(STOCK_IMAGES[0]);
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="card w-full max-w-lg overflow-hidden animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5" style={{ color: 'var(--brand)' }} /> New Post</h3>
          <button onClick={onClose} className="btn btn-ghost h-9 w-9 p-0"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3" style={{ background: 'var(--bg-alt)' }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 mb-3">
            {STOCK_IMAGES.map((s) => (
              <button key={s} onClick={() => setImg(s)} className={`h-14 w-14 rounded-lg overflow-hidden border-2 transition-all ${img === s ? 'scale-105' : 'opacity-60'}`} style={img === s ? { borderColor: 'var(--brand)' } : { borderColor: 'var(--border)' }}>
                <img src={s} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm bg-transparent border focus:ring-focus resize-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <button
            onClick={() => { if (caption.trim()) { onPost(caption.trim(), img); onClose(); } }}
            disabled={!caption.trim()}
            className="btn btn-primary w-full mt-3 disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Share Post
          </button>
        </div>
      </div>
    </div>
  );
}
