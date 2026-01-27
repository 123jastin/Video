
import React, { useState, useEffect, useMemo } from 'react';
import { User, Event, Group, Product, Post as PostType } from '../types';
import { Post } from './Feed';

// --- SUGGESTED PROFILES PAGE (Now DISCOVERY PAGE) ---
interface SuggestedProfilesPageProps {
    currentUser: User;
    users: User[];
    groups?: Group[];
    products?: Product[];
    events?: Event[];
    onFollow: (id: number) => void;
    onProfileClick: (id: number) => void;
    onJoinGroup?: (groupId: string) => void;
    onJoinEvent?: (eventId: number) => void;
    onViewProduct?: (product: Product) => void;
}

export const SuggestedProfilesPage: React.FC<SuggestedProfilesPageProps> = ({ 
    currentUser, users, groups = [], products = [], events = [], 
    onFollow, onProfileClick, onJoinGroup, onJoinEvent, onViewProduct 
}) => {
    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans pb-20">
            <h2 className="text-2xl font-bold text-[#E4E6EB] mb-4">Discover People & Communities</h2>
            <div className="p-8 text-center text-[#B0B3B8] bg-[#242526] rounded-xl border border-[#3E4042]">
                <i className="fas fa-search-plus text-4xl mb-3"></i>
                <p>Discovery feature coming soon.</p>
            </div>
        </div>
    );
};

// --- BIRTHDAYS PAGE ---
interface BirthdaysPageProps { 
    currentUser: User; 
    users: User[]; 
    onMessage: (id: number) => void; 
    onProfileClick: (id: number) => void;
}

export const BirthdaysPage: React.FC<BirthdaysPageProps> = ({ currentUser, users, onMessage, onProfileClick }) => {
    const birthdayData = useMemo(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        const todayMonth = now.getMonth() + 1;
        const todayDay = now.getDate();
        const tomMonth = tomorrow.getMonth() + 1;
        const tomDay = tomorrow.getDate();

        // Find users who follow the current user
        const followers = users.filter(u => currentUser.followers.includes(u.id));
        
        const today: User[] = [];
        const nextDay: User[] = [];
        const upcoming: { user: User, daysUntil: number }[] = [];

        followers.forEach(u => {
            if (!u.birthDate) return;
            const [bYear, bMonth, bDay] = u.birthDate.split('-').map(Number);
            
            if (bMonth === todayMonth && bDay === todayDay) {
                today.push(u);
            } else if (bMonth === tomMonth && bDay === tomDay) {
                nextDay.push(u);
            } else {
                // Calculate days until next birthday
                let nextBday = new Date(now.getFullYear(), bMonth - 1, bDay);
                if (nextBday < now && (bMonth !== todayMonth || bDay !== todayDay)) {
                    nextBday.setFullYear(now.getFullYear() + 1);
                }
                const diffTime = Math.abs(nextBday.getTime() - now.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 30) { // Show upcoming for next 30 days
                    upcoming.push({ user: u, daysUntil: diffDays });
                }
            }
        });

        return { 
            today, 
            tomorrow: nextDay, 
            upcoming: upcoming.sort((a, b) => a.daysUntil - b.daysUntil) 
        };
    }, [currentUser, users]);

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans pb-24 animate-fade-in">
            <div className="bg-gradient-to-br from-[#FF007A] via-[#A033FF] to-[#1877F2] p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-6 -translate-y-6 scale-150">
                    <i className="fas fa-birthday-cake text-[180px] text-white"></i>
                </div>
                <div className="relative z-10">
                    <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                        <i className="fas fa-gift text-white text-3xl"></i>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Celebrations</h1>
                    <p className="text-white/90 text-lg font-medium">Never miss a special moment with your followers.</p>
                </div>
            </div>

            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#E4E6EB] flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF007A] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF007A]"></span>
                        </span>
                        Today's Birthdays
                    </h2>
                    {birthdayData.today.length > 0 && (
                        <span className="bg-[#FF007A]/10 text-[#FF007A] text-xs font-black px-3 py-1 rounded-full border border-[#FF007A]/20">
                            {birthdayData.today.length} CELEBRATING
                        </span>
                    )}
                </div>

                {birthdayData.today.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {birthdayData.today.map(user => (
                            <div key={user.id} className="bg-[#242526] border border-[#3E4042] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-xl hover:border-[#FF007A]/40 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF007A]"></div>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 sm:mb-0">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#FF007A] to-[#F7B928]">
                                            <img 
                                                src={user.profileImage} 
                                                className="w-full h-full rounded-full object-cover border-4 border-[#242526] cursor-pointer" 
                                                alt="" 
                                                onClick={() => onProfileClick(user.id)} 
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#242526] shadow-lg">
                                            <i className="fas fa-cake-candles text-[14px] text-[#FF007A]"></i>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-black text-[#E4E6EB] text-2xl hover:underline cursor-pointer" onClick={() => onProfileClick(user.id)}>{user.name}</h3>
                                        <p className="text-[#FF007A] font-bold text-sm uppercase tracking-widest mt-1 flex items-center justify-center sm:justify-start gap-2">
                                            🎉 Happy Birthday!
                                        </p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => onMessage(user.id)}
                                    className="bg-gradient-to-r from-[#1877F2] to-[#0055FF] text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-[0_4px_15px_rgba(24,119,242,0.4)] active:scale-95"
                                >
                                    Wish Them Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#242526] p-12 rounded-3xl border border-[#3E4042] text-center shadow-inner">
                        <div className="w-20 h-20 bg-[#3A3B3C] rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-calendar-day text-[#B0B3B8] text-3xl"></i>
                        </div>
                        <p className="text-[#B0B3B8] text-lg font-medium">No follower birthdays today.</p>
                    </div>
                )}
            </div>

            <div className="mb-10">
                <h2 className="text-xl font-bold text-[#E4E6EB] mb-6 flex items-center gap-3">
                    <i className="fas fa-sun text-[#F7B928]"></i> Tomorrow
                </h2>
                {birthdayData.tomorrow.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {birthdayData.tomorrow.map(user => (
                            <div key={user.id} className="bg-[#242526] border border-[#3E4042] rounded-2xl p-5 flex items-center gap-4 shadow-md hover:bg-[#3A3B3C] transition-colors cursor-pointer group" onClick={() => onProfileClick(user.id)}>
                                <div className="relative">
                                    <img src={user.profileImage} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F7B928]/50" alt="" />
                                    <div className="absolute -top-2 -right-2 bg-[#F7B928] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg">TOMORROW</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#E4E6EB] truncate text-lg group-hover:text-[#F7B928] transition-colors">{user.name}</h3>
                                    <p className="text-[#B0B3B8] text-sm font-semibold italic">Turning a year older!</p>
                                </div>
                                <i className="fas fa-chevron-right text-[#3E4042] group-hover:text-[#B0B3B8]"></i>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#242526] p-6 rounded-2xl border border-[#3E4042] text-center opacity-60">
                        <p className="text-[#B0B3B8] text-sm">Quiet day tomorrow.</p>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold text-[#E4E6EB] mb-6 flex items-center gap-3">
                    <i className="fas fa-bullseye text-[#1877F2]"></i> Upcoming this month
                </h2>
                {birthdayData.upcoming.length > 0 ? (
                    <div className="bg-[#242526] rounded-3xl border border-[#3E4042] overflow-hidden shadow-lg">
                        {birthdayData.upcoming.map(({ user, daysUntil }, idx) => (
                            <div key={user.id} className={`flex items-center justify-between p-4 hover:bg-[#3A3B3C] transition-colors ${idx !== birthdayData.upcoming.length - 1 ? 'border-b border-[#3E4042]' : ''}`}>
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onProfileClick(user.id)}>
                                    <img src={user.profileImage} className="w-12 h-12 rounded-full object-cover border border-[#4E4F50]" alt="" />
                                    <div>
                                        <h4 className="font-bold text-[#E4E6EB]">{user.name}</h4>
                                        <p className="text-[#B0B3B8] text-xs font-medium">
                                            {new Date(user.birthDate!).toLocaleString('default', { month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="bg-[#1877F2]/10 text-[#1877F2] text-[10px] font-black px-3 py-1.5 rounded-xl border border-[#1877F2]/20 uppercase tracking-tighter">
                                        In {daysUntil} {daysUntil === 1 ? 'Day' : 'Days'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#242526] p-6 rounded-2xl border border-[#3E4042] text-center opacity-60">
                        <p className="text-[#B0B3B8] text-sm">No other birthdays in the next 30 days.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- EVENTS PAGE ---
interface EventsPageProps { 
    events: Event[]; 
    currentUser: User | null; 
    onJoinEvent: (eventId: number) => void; 
    onCreateEventClick: () => void; 
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, currentUser, onJoinEvent, onCreateEventClick }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const categories = ['All', 'Discover', 'Hosting', 'Upcoming'];

    const filteredEvents = useMemo(() => {
        if (selectedCategory === 'All' || selectedCategory === 'Discover') return events;
        if (selectedCategory === 'Hosting' && currentUser) return events.filter(e => e.organizerId === currentUser.id);
        if (selectedCategory === 'Upcoming' && currentUser) return events.filter(e => e.attendees.includes(currentUser.id));
        return events;
    }, [events, selectedCategory, currentUser]);

    return (
        <div className="w-full max-w-[1000px] mx-auto p-4 font-sans pb-24 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-[#242526] p-6 rounded-3xl border border-[#3E4042] shadow-xl">
                <div>
                    <h1 className="text-3xl font-black text-[#E4E6EB]">Events</h1>
                    <p className="text-[#B0B3B8] text-lg font-medium mt-1">Discover experiences near you.</p>
                </div>
                {currentUser && (
                    <button 
                        onClick={onCreateEventClick}
                        className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all shadow-lg active:scale-95"
                    >
                        <i className="fas fa-plus-circle text-xl"></i>
                        <span>Create New Event</span>
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-full font-black text-sm whitespace-nowrap border transition-all ${
                            selectedCategory === cat 
                            ? 'bg-[#1877F2] border-[#1877F2] text-white shadow-lg' 
                            : 'bg-[#242526] border-[#3E4042] text-[#B0B3B8] hover:bg-[#3A3B3C]'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map(event => {
                        const date = new Date(event.date);
                        const isInterested = currentUser && event.interestedIds.includes(currentUser.id);
                        const isAttending = currentUser && event.attendees.includes(currentUser.id);

                        return (
                            <div key={event.id} className="bg-[#242526] rounded-3xl overflow-hidden border border-[#3E4042] flex flex-col shadow-lg hover:shadow-2xl transition-all group">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    <div className="absolute top-4 left-4 bg-white/95 text-black rounded-2xl px-3 py-2 text-center shadow-2xl backdrop-blur-sm min-w-[50px]">
                                        <div className="text-[10px] font-black uppercase tracking-tighter text-[#1877F2]">{date.toLocaleString('default', { month: 'short' })}</div>
                                        <div className="text-xl font-black leading-tight">{date.getDate()}</div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-white text-xs font-bold bg-[#1877F2]/80 px-2 py-1 rounded-md">See Details</span>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-[#E4E6EB] mb-2 line-clamp-1 group-hover:text-[#1877F2] transition-colors">{event.title}</h3>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-[#B0B3B8] text-sm font-bold">
                                            <i className="fas fa-clock text-[#1877F2] w-5 text-center"></i>
                                            <span>{date.toLocaleDateString()} at {event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#B0B3B8] text-sm font-bold">
                                            <i className="fas fa-map-marker-alt text-[#F3425F] w-5 text-center"></i>
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#B0B3B8] text-sm font-bold">
                                            <i className="fas fa-users text-[#45BD62] w-5 text-center"></i>
                                            <span>{event.attendees.length} going • {event.interestedIds.length} interested</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-2">
                                        <button 
                                            onClick={() => onJoinEvent(event.id)}
                                            className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                                                isAttending 
                                                ? 'bg-[#45BD62]/10 text-[#45BD62] border border-[#45BD62]/30' 
                                                : 'bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]'
                                            }`}
                                        >
                                            <i className={`fas ${isAttending ? 'fa-check' : 'fa-star'}`}></i>
                                            {isAttending ? 'Going' : 'Interested'}
                                        </button>
                                        <button className="w-12 h-10 bg-[#3A3B3C] rounded-xl flex items-center justify-center text-[#E4E6EB] hover:bg-[#4E4F50] transition-colors">
                                            <i className="fas fa-share"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-16 text-center text-[#B0B3B8] bg-[#242526] rounded-3xl border border-[#3E4042] shadow-inner">
                    <div className="w-24 h-24 bg-[#3A3B3C] rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-calendar-times text-5xl"></i>
                    </div>
                    <h3 className="text-xl font-black text-[#E4E6EB] mb-2">No events found</h3>
                    <p className="max-w-xs mx-auto font-medium">Try changing your filters or create a new event to get the party started.</p>
                </div>
            )}
        </div>
    );
};

// --- MEMORIES PAGE ---
interface MemoriesPageProps {
    currentUser: User;
    posts: PostType[];
    users: User[];
    onProfileClick: (id: number) => void;
    onTagClick: (tag: string) => void;
}

export const MemoriesPage: React.FC<MemoriesPageProps> = ({ currentUser, posts, users, onProfileClick, onTagClick }) => {
    // Memories show the current user's old posts
    const memories = useMemo(() => {
        return posts
            .filter(p => p.authorId === currentUser.id && p.timestamp !== 'Just now')
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }, [posts, currentUser]);

    return (
        <div className="w-full max-w-[680px] mx-auto pb-20 font-sans">
            <div className="bg-[#242526] md:rounded-b-xl p-6 mb-4 border-b border-[#3E4042] shadow-sm">
                <h1 className="text-3xl font-black text-[#E4E6EB] mb-2">Memories</h1>
                <p className="text-[#B0B3B8] text-lg">Revisit your favorite moments from the past.</p>
            </div>
            
            <div className="flex flex-col gap-4">
                {memories.length > 0 ? memories.map(post => {
                    return (
                        <div key={post.id} className="w-full">
                            <div className="px-4 py-2 text-[#B0B3B8] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <i className="fas fa-history text-xs"></i> 
                                On This Day
                            </div>
                            <Post 
                                post={post}
                                author={currentUser}
                                currentUser={currentUser}
                                users={users}
                                onProfileClick={onProfileClick}
                                onReact={() => {}}
                                onShare={() => {}}
                                onVideoClick={() => {}}
                                onViewImage={() => {}}
                                onOpenComments={() => {}}
                                onTagClick={onTagClick}
                            />
                        </div>
                    );
                }) : (
                    <div className="bg-[#242526] md:rounded-xl p-12 text-center text-[#B0B3B8] mx-4 md:mx-0 border border-[#3E4042]">
                        <div className="w-24 h-24 bg-[#18191A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <i className="fas fa-history text-5xl text-[#3E4042]"></i>
                        </div>
                        <h3 className="text-xl font-bold text-[#E4E6EB] mb-2">No memories to show today</h3>
                        <p className="max-w-xs mx-auto">When you have posts from years past, they'll appear here for you to enjoy.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SETTINGS PAGE ---
interface SettingsPageProps {
    currentUser: User | null;
    onUpdateUser: (data: Partial<User>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUser }) => {
    const [activeSection, setActiveSection] = useState<'main' | 'details' | 'security'>('main');
    
    const [name, setName] = useState(currentUser?.name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [location, setLocation] = useState(currentUser?.location || '');
    const [work, setWork] = useState(currentUser?.work || '');

    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState(currentUser?.password || '');

    if (!currentUser) return <div className="p-8 text-center text-[#B0B3B8]">Please login to access settings.</div>;

    const handleSaveDetails = () => {
        onUpdateUser({ name, bio, location, work });
        alert("Details updated successfully!");
        setActiveSection('main');
    };

    const handleSaveSecurity = () => {
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        onUpdateUser({ email, password });
        alert("Security settings updated!");
        setActiveSection('main');
    };

    if (activeSection === 'details') {
        return (
            <div className="w-full max-w-[600px] mx-auto p-4 text-[#E4E6EB] animate-fade-in">
                <button onClick={() => setActiveSection('main')} className="mb-4 text-[#B0B3B8] hover:text-white flex items-center gap-2"><i className="fas fa-arrow-left"></i> Back</button>
                <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Full Name</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Bio</label>
                        <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={bio} onChange={e => setBio(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Location</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Work</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={work} onChange={e => setWork(e.target.value)} />
                    </div>
                    <button onClick={handleSaveDetails} className="w-full bg-[#1877F2] py-3 rounded-lg font-bold mt-4">Save Changes</button>
                </div>
            </div>
        );
    }

    if (activeSection === 'security') {
        return (
            <div className="w-full max-w-[600px] mx-auto p-4 text-[#E4E6EB] animate-fade-in">
                <button onClick={() => setActiveSection('main')} className="mb-4 text-[#B0B3B8] hover:text-white flex items-center gap-2"><i className="fas fa-arrow-left"></i> Back</button>
                <h2 className="text-2xl font-bold mb-6">Password and Security</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Email Address (Username)</label>
                        <input type="email" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">New Password</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSaveSecurity} className="w-full bg-[#1877F2] py-3 rounded-lg font-bold mt-4">Update Security</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans text-[#E4E6EB] animate-fade-in pb-20">
            <h1 className="text-2xl font-bold mb-6">Settings & Privacy</h1>
            
            <div className="flex flex-col gap-6">
                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-user-shield text-[#1877F2]"></i> Accounts Center
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Manage your connected experiences and account settings.</p>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]" onClick={() => setActiveSection('details')}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-user-circle text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Personal details</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors" onClick={() => setActiveSection('security')}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-shield-alt text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Password and security</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-tools text-[#1877F2]"></i> Tools & Resources
                        </h2>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-globe text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Default Audience Settings</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-bell text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Notifications</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
