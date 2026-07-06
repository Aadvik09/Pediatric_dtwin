// Social feed + checkup messaging mock data.

export interface Friend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  posts: number;
  followers: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  caption: string;
  image: string;
  likes: number;
  liked?: boolean;
  comments: { author: string; avatar: string; text: string }[];
  tag?: string;
  time: string;
}

export interface Reel {
  id: string;
  authorId: string;
  caption: string;
  // stock sample videos (publicly hosted, playable <video>)
  videoUrl: string;
  likes: number;
  liked?: boolean;
  tag?: string;
}

export const friends: Friend[] = [
  { id: 'u1', name: 'Maria Chen', handle: '@maria.c', avatar: 'https://images.pexels.com/photos/1239287/pexels-photo-1239287.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', bio: 'Mom of 2 · navigating asthma', posts: 42, followers: 310, followingCount: 188, isFollowing: false },
  { id: 'u2', name: 'James Okafor', handle: '@jokids', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', bio: 'Dad · pediatric nurse by day', posts: 78, followers: 1200, followingCount: 340, isFollowing: true },
  { id: 'u3', name: 'Priya Shah', handle: '@priya.shah', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', bio: 'First-time mom · #HealthQuest', posts: 25, followers: 540, followingCount: 210, isFollowing: false },
  { id: 'u4', name: 'Daniel Reyes', handle: '@dr.reyes', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', bio: 'Pediatrician · sharing tips', posts: 132, followers: 8400, followingCount: 120, isFollowing: true },
  { id: 'u5', name: 'Sofia Almeida', handle: '@sofia.kids', avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop', bio: 'Mom of 3 · healthy lunches', posts: 64, followers: 2200, followingCount: 300, isFollowing: true },
];

export const currentUser: Friend = {
  id: 'me', name: 'Alex Rivera', handle: '@alex.r', avatar: 'https://images.pexels.com/photos/3779448/pexels-photo-3779448.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  bio: 'Parent on HealthQuest', posts: 3, followers: 88, followingCount: 142,
};

export const posts: Post[] = [
  { id: 'p1', authorId: 'u1', caption: "Asthma action plan updated today and Alex actually asked to go to the clinic. This app changed everything for us. 💙", image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800', likes: 142, tag: 'Win', time: '2h', comments: [ { author: 'Priya Shah', avatar: friends[2].avatar, text: 'This is amazing! We need to try this.' } ] },
  { id: 'p2', authorId: 'u4', caption: "Tip Tuesday: kids breathe better when they know how their lungs work. Show them the digital twin before the visit!", image: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=800', likes: 890, tag: 'Tip', time: '5h', comments: [ { author: 'Maria Chen', avatar: friends[0].avatar, text: 'Did this yesterday, huge difference!' } ] },
  { id: 'p3', authorId: 'u5', caption: "Rainbow lunchboxes = rainbow nutrition. The Vita Vixen buddy appeared after we hit 5 colors today 🦊", image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800', likes: 432, tag: 'Nutrition', time: '8h', comments: [] },
  { id: 'p4', authorId: 'u3', caption: "First checkup with ZERO tears. She was so excited to show the doctor her Health Buddies. 🥹", image: 'https://images.pexels.com/photos/3933252/pexels-photo-3933252.jpeg?auto=compress&cs=tinysrgb&w=800', likes: 318, tag: 'Win', time: '1d', comments: [ { author: 'James Okafor', avatar: friends[1].avatar, text: 'Love this!' } ] },
  { id: 'p5', authorId: 'u2', caption: "As a pediatric nurse, seeing kids arrive informed and calm is everything. This is the future of pediatric care.", image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800', likes: 612, tag: 'Pro', time: '1d', comments: [] },
];

export const reels: Reel[] = [
  { id: 'r1', authorId: 'u4', caption: 'How to explain asthma to a 7-year-old in 60 seconds', videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', likes: 1240, tag: 'Doctor Tips' },
  { id: 'r2', authorId: 'u5', caption: '5-color lunchbox ideas for picky eaters', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', likes: 890, tag: 'Nutrition' },
  { id: 'r3', authorId: 'u1', caption: 'Our 30-day HealthQuest journey', videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4', likes: 2100, tag: 'Journey' },
  { id: 'r4', authorId: 'u2', caption: 'Breathing exercises for kids during an asthma flare', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', likes: 760, tag: 'Asthma' },
  { id: 'r5', authorId: 'u3', caption: 'Why my kid now asks to go to the doctor', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', likes: 1820, tag: 'Win' },
];

export interface CheckupRecord {
  id: string;
  date: string;
  type: string;
  provider: string;
  providerRole: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  status: 'clear' | 'follow-up' | 'monitor';
  attachments?: { name: string; kind: string }[];
  messages: { from: 'parent' | 'doctor'; text: string; time: string }[];
}

export const checkups: CheckupRecord[] = [
  { id: 'c1', date: '2026-06-18', type: 'Wellness Visit', provider: 'Dr. Maya Okafor', providerRole: 'Pediatrician', diagnosis: 'Healthy, growth on track', prescription: '—', notes: 'Continue balanced diet; increase fiber. Next visit in 12 months.', status: 'clear', messages: [] },
  { id: 'c2', date: '2026-04-02', type: 'Vision Screening', provider: 'Dr. Raj Patel', providerRole: 'Optometrist', diagnosis: '20/20 both eyes', prescription: '—', notes: 'No correction needed. Limit screen time to <2h/day.', status: 'clear', messages: [ { from: 'doctor', text: 'Vision looks great! Keep up the outdoor time.', time: '2026-04-03 09:14' } ] },
  { id: 'c3', date: '2026-02-14', type: 'Dental Checkup', provider: 'Dr. Lena Sørensen', providerRole: 'Dentist', diagnosis: 'No cavities', prescription: 'Fluoride toothpaste', notes: 'One sealant applied to molar. Brush twice daily.', status: 'clear', messages: [ { from: 'parent', text: 'When should we apply the next sealant?', time: '2026-02-20 18:30' }, { from: 'doctor', text: 'Usually around age 9-10. I will flag it at the next visit!', time: '2026-02-21 08:02' } ] },
  { id: 'c4', date: '2025-11-20', type: 'Flu Vaccine', provider: 'Nurse Adams', providerRole: 'Nurse', diagnosis: 'Seasonal immunization', prescription: '—', notes: 'No adverse reaction. Shield Buddy unlocked!', status: 'clear', messages: [] },
  { id: 'c5', date: '2025-09-08', type: 'Asthma Review', provider: 'Dr. Maya Okafor', providerRole: 'Pediatrician', diagnosis: 'Mild asthma, well controlled', prescription: 'Salbutamol inhaler (as needed)', notes: 'Action plan updated. Avoid known triggers. Review in 6 months.', status: 'monitor', messages: [ { from: 'parent', text: 'He had a mild cough after soccer in the cold. Used the inhaler once.', time: '2026-01-12 20:15' }, { from: 'doctor', text: 'Good use of the action plan. If it happens more than twice a week, message me and we may adjust the controller.', time: '2026-01-13 07:40' } ] },
];

export const vitals = [
  { label: 'Heart Rate', value: '88 bpm', trend: 'flat', trendValue: 'stable', status: 'good' },
  { label: 'Sleep', value: '9.5 h', trend: 'up', trendValue: '+0.4h', status: 'good' },
  { label: 'Activity', value: '64 min', trend: 'up', trendValue: '+12 min', status: 'good' },
  { label: 'Screen Time', value: '1.4 h', trend: 'down', trendValue: '-0.3h', status: 'watch' },
];
