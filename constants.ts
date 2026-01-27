
import { User, Post, Story, Reel, LocationData, Event, Group, Song, Album, Podcast, Episode, Brand } from './types';

export const LOCATIONS_DATA: LocationData[] = [
    { name: "Arusha, Tanzania", flag: "🇹🇿" },
    { name: "Dar es Salaam, Tanzania", flag: "🇹🇿" },
    { name: "Dodoma, Tanzania", flag: "🇹🇿" },
    { name: "Zanzibar, Tanzania", flag: "🇹🇿" },
    { name: "Nairobi, Kenya", flag: "🇰🇪" },
    { name: "Kampala, Uganda", flag: "🇺🇬" },
    { name: "Lagos, Nigeria", flag: "🇳🇬" },
    { name: "London, United Kingdom", flag: "🇬🇧" },
    { name: "New York, USA", flag: "🇺🇸" },
];

export const BRAND_CATEGORIES = ["Personal Blog", "Product/Service", "Business Center", "Entertainment", "Education"];
export const MARKETPLACE_CATEGORIES = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'vehicles', name: 'Vehicles' }
];

export const REACTION_ICONS: Record<string, string> = { like: "👍", love: "❤️", haha: "😆", wow: "😮", sad: "😢", angry: "😡" };
export const REACTION_COLORS: Record<string, string> = { like: "#1877F2", love: "#F3425F", haha: "#F7B928", wow: "#F7B928", sad: "#F7B928", angry: "#E41E3F" };

export const STICKER_PACKS = {
    "All": ["https://media.giphy.com/media/l41lFj8afUOMY8vQc/giphy.gif", "https://media.giphy.com/media/10UeedrT5MIfPG/giphy.gif"]
};

export const EMOJI_LIST = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣"];

export const MOCK_SONGS: Song[] = [
    { id: 's1', title: 'Midnight City', artist: 'M83', album: 'Hurry Up', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600', duration: '4:03', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', stats: { plays: 1500000, downloads: 5000, shares: 2000, likes: 12000, reelsUse: 120 } },
];

export const MOCK_ALBUMS: Album[] = [
    { id: 'a1', title: 'After Hours', artist: 'The Weeknd', year: '2020', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=600', songs: ['s2'] },
];

export const MOCK_PODCASTS: Podcast[] = [
    { id: 'p1', title: 'The Daily Tech', host: 'Tech Insider', category: 'Technology', followers: 12000, description: 'Daily news.', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600' },
];

export const MOCK_EPISODES: Episode[] = [
    { id: 'e1', podcastId: 'p1', title: 'AI Revolution', description: 'Future of AI.', date: '2 days ago', duration: '24:15', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', stats: { plays: 1000, downloads: 100, shares: 50, likes: 200, reelsUse: 0 } },
];

export const INITIAL_BRANDS: Brand[] = [
    { id: 1001, name: 'TechNova', category: 'Product/Service', description: 'Leading innovation.', location: 'Silicon Valley', adminId: 0, profileImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600', coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1500', followers: [1], isVerified: true },
];

export const INITIAL_GROUPS: Group[] = [
    { id: 'g1', name: 'UNERA Enthusiasts', description: 'Official group.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600', coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1500', members: [0, 1], posts: [], type: 'public', adminId: 0, createdDate: Date.now() }
];

export const INITIAL_USERS: User[] = [
    { id: 0, name: 'UNERA Admin', profileImage: 'https://ui-avatars.com/api/?name=UNERA&background=1877F2&color=fff', followers: [1], following: [1], isOnline: true, email: 'admin@unera.com', password: 'password', isVerified: true },
    { id: 1, name: 'Sarah Chen', profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800', followers: [0], following: [0], isOnline: true, email: 'user@unera.com', password: 'password', isVerified: true },
];

export const INITIAL_POSTS: Post[] = [
    { id: 1, authorId: 1, content: "Just spent the weekend hiking in the Rockies. The views were absolutely breathtaking! 🏔️✨ #Nature #Hiking", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", timestamp: "2h", createdAt: Date.now() - 7200000, reactions: [{ userId: 0, type: 'love' }], comments: [], shares: 12, type: 'image', visibility: 'Public', views: 1250 },
    { id: 2, authorId: 0, content: "Welcome to UNERA Social! A platform to connect and share your world. 🌍✨", timestamp: "5h", createdAt: Date.now() - 18000000, reactions: [{ userId: 1, type: 'like' }], comments: [], shares: 4, type: 'text', visibility: 'Public', views: 890 }
];

export const INITIAL_STORIES: Story[] = [
    { id: 1, userId: 1, type: 'image', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800', createdAt: Date.now() },
];

export const INITIAL_REELS: Reel[] = [
    { id: 1, userId: 1, videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-29-large.mp4', caption: 'Neon vibes! ✨', songName: 'Midnight City', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', reactions: [], comments: [], shares: 45 },
    { id: 2, userId: 0, videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-at-a-concert-4028-large.mp4', caption: 'Concert magic! 🎸', songName: 'Rock Anthem', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', reactions: [], comments: [], shares: 120 },
];

export const INITIAL_EVENTS: Event[] = [
    { id: 1, title: 'Tech Summit 2025', image: 'https://images.unsplash.com/photo-1540575861501-7ad05a639b3a?w=1500', date: '2025-06-15', time: '09:00', location: 'Nairobi, Kenya', organizerId: 0, attendees: [0, 1], interestedIds: [1] },
];

export const TRANSLATIONS: Record<string, any> = {
    en: { tagline: "Connect with friends and the world around you on UNERA.", login: "Log In", home: "Home", logout: "Log Out" }
};
