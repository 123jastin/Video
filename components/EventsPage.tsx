import React, { useState, useMemo } from 'react';
import { User, Event } from '../types';

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
