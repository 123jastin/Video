import React, { useState, useRef, useEffect } from 'react';
import { User, Event } from '../types';
import { LOCATIONS_DATA } from '../constants';

// --- OSM LOCATION SEARCH COMPONENT ---
const LocationSearch: React.FC<{ value: string, onSelect: (val: string) => void }> = ({ value, onSelect }) => {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeout = useRef<any>(null);

    const handleSearch = async (q: string) => {
        if (q.length < 3) { setResults([]); return; }
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error("Location search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setShowResults(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => handleSearch(val), 500);
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <input 
                    className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] text-sm pl-10" 
                    placeholder="Search city or country..." 
                    value={query} 
                    onChange={handleChange}
                    onFocus={() => setShowResults(true)}
                />
                <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B3B8]"></i>
                {loading && <i className="fas fa-spinner fa-spin absolute right-4 top-1/2 -translate-y-1/2 text-[#1877F2]"></i>}
            </div>
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-[#242526] border border-[#3E4042] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {results.map((res, i) => (
                        <div 
                            key={i} 
                            className="p-3 hover:bg-[#3A3B3C] cursor-pointer text-white text-sm border-b border-[#3E4042] last:border-0"
                            onClick={() => {
                                onSelect(res.display_name);
                                setQuery(res.display_name);
                                setShowResults(false);
                            }}
                        >
                            <i className="fas fa-location-dot mr-2 text-[#B0B3B8]"></i>
                            {res.display_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface CreateEventModalProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (event: Partial<Event>) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ currentUser, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [visibility, setVisibility] = useState<'worldwide' | 'targeted'>('worldwide');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setImage(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time || !location) {
            alert("Please fill all required fields");
            return;
        }
        
        onCreate({
            title,
            description: desc,
            date: new Date(`${date}T${time}`).toISOString(),
            time,
            location,
            visibility,
            image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            organizerId: currentUser.id,
            attendees: [currentUser.id],
            interestedIds: []
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[500px] rounded-xl border border-[#3E4042] shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#E4E6EB]">Create Event</h2>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                
                <div className="p-4 overflow-y-auto space-y-4">
                    {/* Image Upload */}
                    <div 
                        className="w-full h-40 bg-[#3A3B3C] rounded-lg flex flex-col items-center justify-center cursor-pointer border border-dashed border-[#B0B3B8] hover:bg-[#4E4F50] transition-colors overflow-hidden relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Event Cover" />
                        ) : (
                            <>
                                <i className="fas fa-camera text-2xl text-[#E4E6EB] mb-2"></i>
                                <span className="text-[#E4E6EB] text-sm font-semibold">Add Cover Photo</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Event Name</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event name" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Date</label>
                            <input type="date" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Time</label>
                            <input type="time" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Location</label>
                        <LocationSearch value={location} onSelect={setLocation} />
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Who should see this?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="visibility" 
                                    value="worldwide" 
                                    checked={visibility === 'worldwide'} 
                                    onChange={() => setVisibility('worldwide')}
                                    className="accent-[#1877F2]"
                                />
                                <span className="text-sm text-[#E4E6EB]">Worldwide</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="visibility" 
                                    value="targeted" 
                                    checked={visibility === 'targeted'} 
                                    onChange={() => setVisibility('targeted')}
                                    className="accent-[#1877F2]"
                                />
                                <span className="text-sm text-[#E4E6EB]">Only in event location</span>
                            </label>
                        </div>
                        {visibility === 'targeted' && (
                            <p className="text-[11px] text-[#B0B3B8] mt-1 italic">Shown to users in {location ? location.split(',').pop()?.trim() : 'the selected location'}.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Description (Links supported)</label>
                        <textarea 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] h-32 resize-none" 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Share all the details including website links, instructions, etc." 
                        />
                        <p className="text-[10px] text-[#B0B3B8] mt-1 italic">URLs like https://unera.com will be clickable.</p>
                    </div>

                    <button onClick={handleSubmit} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 rounded-lg font-bold shadow-md transition-all active:scale-95">Create Event</button>
                </div>
            </div>
        </div>
    );
};