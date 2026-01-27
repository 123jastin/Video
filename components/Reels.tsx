import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Reel, ReactionType, Comment, Song } from '../types';
import { MOCK_SONGS } from '../constants';

const formatCount = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

// --- PROFESSIONAL DUAL-THUMB PRECISION AUDIO TRIMMER ---
const AudioTrimmer: React.FC<{ 
    url: string, 
    onClose: () => void, 
    onConfirm: (start: number, end: number) => void,
    initialStart: number,
    initialEnd: number
}> = ({ url, onClose, onConfirm, initialStart, initialEnd }) => {
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd > 0 ? initialEnd : Math.min(60, initialStart + 15));
    const [duration, setDuration] = useState(1); 
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeThumb, setActiveThumb] = useState<'start' | 'end'>('start');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const checkBounds = () => {
            if (audio.currentTime >= end || audio.currentTime < start) {
                audio.currentTime = start;
                audio.play().catch(() => {});
            }
        };

        audio.addEventListener('timeupdate', checkBounds);
        
        if (!isDragging) {
            audio.currentTime = start;
            audio.play().catch(() => {});
        } else {
            audio.currentTime = activeThumb === 'start' ? start : end;
        }

        return () => audio.removeEventListener('timeupdate', checkBounds);
    }, [start, end, isDragging, activeThumb]);

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            const d = audioRef.current.duration;
            setDuration(d);
            if (initialEnd === 0 || initialEnd > d) {
                setEnd(Math.min(d, start + 15));
            }
        }
    };

    const handleTrackInteraction = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
        const clickTime = clickPercent * duration;

        const distStart = Math.abs(clickTime - start);
        const distEnd = Math.abs(clickTime - end);
        setActiveThumb(distStart < distEnd ? 'start' : 'end');
    };

    return (
        <div className="fixed inset-0 z-[800] bg-black/98 flex flex-col justify-end animate-fade-in font-sans">
            <style>{`
                .precision-slider {
                    pointer-events: none;
                    appearance: none;
                    background: transparent;
                    width: 100%;
                    position: absolute;
                    left: 0;
                    z-index: 40;
                }
                .precision-slider::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    border: 4px solid currentColor;
                }
                .slider-active { z-index: 50; }
                .slider-blue::-webkit-slider-thumb { color: #1877F2; }
                .slider-red::-webkit-slider-thumb { color: #F3425F; }
            `}</style>

            <div className="bg-[#121212] w-full rounded-t-[40px] p-8 pb-14 border-t border-white/10 animate-slide-up shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <button onClick={onClose} className="text-[#B0B3B8] font-black uppercase text-[10px] tracking-widest px-4 py-2">Cancel</button>
                    <div className="text-center">
                        <h3 className="font-black text-white uppercase tracking-[4px] text-xs">Precision Sync</h3>
                        <p className="text-[9px] text-[#1877F2] font-black mt-1 uppercase tracking-tighter">Adjust Audio Window</p>
                    </div>
                    <button onClick={() => onConfirm(start, end)} className="text-[#1877F2] font-black uppercase text-[10px] tracking-widest px-4 py-2">Done</button>
                </div>

                <div 
                    ref={containerRef}
                    onMouseDown={(e) => handleTrackInteraction(e.clientX)}
                    onTouchStart={(e) => handleTrackInteraction(e.touches[0].clientX)}
                    className="relative h-28 w-full bg-white/5 rounded-3xl overflow-hidden px-8 border border-white/5 shadow-inner flex flex-col justify-center"
                >
                    <div className="absolute inset-0 flex items-center gap-[2px] opacity-10 px-8 pointer-events-none">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <div key={i} className="flex-1 bg-white rounded-full" style={{ height: `${15 + Math.random() * 70}%` }} />
                        ))}
                    </div>

                    <div 
                        className="absolute h-16 bg-[#1877F2]/10 border-x-2 border-white/30 pointer-events-none transition-all duration-75 z-10" 
                        style={{ left: `${(start / duration) * 100}%`, width: `${((end - start) / duration) * 100}%` }} 
                    />

                    <div className="relative w-full h-1 flex items-center bg-white/10 rounded-full">
                        <input 
                            type="range" min="0" max={duration} step="0.1" value={start} 
                            onMouseDown={() => { setIsDragging(true); setActiveThumb('start'); }}
                            onMouseUp={() => setIsDragging(false)}
                            onChange={(e) => setStart(Math.min(parseFloat(e.target.value), end - 0.5))}
                            className={`precision-slider slider-blue ${activeThumb === 'start' ? 'slider-active' : ''}`}
                        />
                        <input 
                            type="range" min="0" max={duration} step="0.1" value={end} 
                            onMouseDown={() => { setIsDragging(true); setActiveThumb('end'); }}
                            onMouseUp={() => setIsDragging(false)}
                            onChange={(e) => setEnd(Math.max(parseFloat(e.target.value), start + 0.5))}
                            className={`precision-slider slider-red ${activeThumb === 'end' ? 'slider-active' : ''}`}
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center">
                        <span className="text-[8px] font-black text-[#1877F2] uppercase tracking-widest">In</span>
                        <p className="text-white text-xs font-black">{(start).toFixed(1)}s</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center">
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Out</span>
                        <p className="text-white text-xs font-black">{(end).toFixed(1)}s</p>
                    </div>
                </div>

                <audio ref={audioRef} src={url} hidden onLoadedMetadata={handleLoadedMetadata} />
            </div>
        </div>
    );
};

// --- CREATOR STUDIO MODAL ---
export const CreateReelModal: React.FC<{ 
    currentUser: User, 
    onClose: () => void, 
    onCreate: (data: Partial<Reel>) => void,
    initialSound?: { name: string, url?: string, start?: number, end?: number } | null
}> = ({ currentUser, onClose, onCreate, initialSound }) => {
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState<{ url: string, name: string } | null>(
        initialSound?.url ? { url: initialSound.url, name: initialSound.name } : null
    );
    const [audioStart, setAudioStart] = useState(initialSound?.start || 0);
    const [audioEnd, setAudioEnd] = useState(initialSound?.end || 0);
    const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
    const [isTrimmerOpen, setIsTrimmerOpen] = useState(false);
    const [isStudioPlaying, setIsStudioPlaying] = useState(false);
    const [musicSearch, setMusicSearch] = useState('');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioUploadRef = useRef<HTMLInputElement>(null);

    const filteredSongs = useMemo(() => {
        if (!musicSearch.trim()) return MOCK_SONGS;
        return MOCK_SONGS.filter(s => 
            s.title.toLowerCase().includes(musicSearch.toLowerCase()) || 
            s.artist.toLowerCase().includes(musicSearch.toLowerCase())
        );
    }, [musicSearch]);

    // Enhanced Sync Engine for Studio
    useEffect(() => {
        if (mediaPreview && selectedAudio && audioRef.current && videoRef.current) {
            const audio = audioRef.current;
            const video = videoRef.current;

            if (isStudioPlaying) {
                const sync = () => {
                    const expectedAudioTime = video.currentTime + audioStart;
                    // Robust 0.5s threshold to prevent stuttering
                    if (Math.abs(audio.currentTime - expectedAudioTime) > 0.5) {
                        audio.currentTime = expectedAudioTime;
                    }
                    if (audioEnd > 0 && audio.currentTime >= audioEnd) {
                        video.currentTime = 0;
                        audio.currentTime = audioStart;
                    }
                };

                video.addEventListener('timeupdate', sync);
                if (video.paused) video.play().catch(() => {});
                if (audio.paused) audio.play().catch(() => {});
                return () => video.removeEventListener('timeupdate', sync);
            } else {
                video.pause();
                audio.pause();
            }
        }
    }, [mediaPreview, selectedAudio, audioStart, audioEnd, isStudioPlaying]);

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setSelectedAudio({ url, name: file.name.split('.')[0] });
            setAudioStart(0);
            setAudioEnd(0);
            setIsMusicPickerOpen(false);
            setIsTrimmerOpen(true);
        }
    };

    const handleUpload = () => {
        if (!mediaPreview) return;
        setIsUploading(true);
        setTimeout(() => {
            onCreate({
                videoUrl: mediaPreview,
                caption: caption,
                songName: selectedAudio?.name || 'Original Sound',
                audioUrl: selectedAudio?.url,
                audioStart,
                audioEnd
            });
            setIsUploading(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col font-sans animate-fade-in text-white overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[#050505] flex items-center justify-center">
                {mediaPreview ? (
                    <div className="relative w-full h-full" onClick={() => setIsStudioPlaying(!isStudioPlaying)}>
                        <video ref={videoRef} src={mediaPreview} className="w-full h-full object-cover opacity-70" loop muted={!!selectedAudio} />
                        {!isStudioPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                                    <i className="fas fa-play text-white text-2xl ml-1"></i>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center p-12 max-w-[300px]">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 mx-auto">
                            <i className="fas fa-video text-3xl text-[#1877F2]"></i>
                        </div>
                        <h2 className="text-2xl font-black mb-2 tracking-tight uppercase leading-none">Video Studio</h2>
                        <p className="text-white/40 text-xs font-medium">Select a video to begin production</p>
                    </div>
                )}
                {selectedAudio && <audio ref={audioRef} src={selectedAudio.url} hidden />}
            </div>

            <div className="relative z-20 h-14 flex items-center justify-between px-6 bg-gradient-to-b from-black/80 to-transparent pt-2">
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <i className="fas fa-times text-xs"></i>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black uppercase tracking-[3px] text-[#1877F2]">Sync Master</span>
                </div>
                <button onClick={handleUpload} disabled={!mediaPreview || isUploading} className="bg-[#1877F2] text-white px-5 py-1.5 rounded-lg font-black text-xs shadow-lg active:scale-95 transition-all">
                    {isUploading ? '...' : 'Next'}
                </button>
            </div>

            {mediaPreview && (
                <div className="absolute right-4 top-[20%] z-20 flex flex-col gap-5">
                    <button onClick={() => setIsMusicPickerOpen(true)} className="flex flex-col items-center gap-1.5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-xl transition-all border ${selectedAudio ? 'bg-[#1877F2] border-blue-400' : 'bg-white/5 border-white/10'}`}>
                            <i className="fas fa-music text-sm"></i>
                        </div>
                        <span className="text-[8px] font-black uppercase text-white/60">Audio</span>
                    </button>
                    {selectedAudio && (
                        <button onClick={() => setIsTrimmerOpen(true)} className="flex flex-col items-center gap-1.5 animate-fade-in">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                                <i className="fas fa-scissors text-sm"></i>
                            </div>
                            <span className="text-[8px] font-black uppercase text-white/60">Crop</span>
                        </button>
                    )}
                    <button onClick={() => setMediaPreview(null)} className="flex flex-col items-center gap-1.5">
                        <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center backdrop-blur-xl">
                            <i className="fas fa-trash-alt text-sm"></i>
                        </div>
                        <span className="text-[8px] font-black uppercase text-red-500/60">Reset</span>
                    </button>
                </div>
            )}

            {!mediaPreview && (
                <div className="flex-1 flex items-center justify-center px-10">
                    <input type="file" id="video-input" className="hidden" accept="video/*" onChange={(e) => e.target.files?.[0] && setMediaPreview(URL.createObjectURL(e.target.files[0]))} />
                    <label htmlFor="video-input" className="w-full max-w-[300px] aspect-[9/16] border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center cursor-pointer bg-black/20 backdrop-blur-md">
                        <i className="fas fa-cloud-upload-alt text-3xl text-white/20 mb-3"></i>
                        <p className="font-black uppercase text-[10px] tracking-widest text-white/40">Import Video</p>
                    </label>
                </div>
            )}

            {mediaPreview && (
                <div className="mt-auto relative z-20 p-6 bg-gradient-to-t from-black via-black/60 to-transparent pb-10">
                    <textarea 
                        className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 text-[16px] outline-none h-24 resize-none font-medium leading-tight shadow-inner"
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                    />
                </div>
            )}

            {isTrimmerOpen && selectedAudio && (
                <AudioTrimmer 
                    url={selectedAudio.url} 
                    onClose={() => setIsTrimmerOpen(false)} 
                    onConfirm={(s, e) => { setAudioStart(s); setAudioEnd(e); setIsTrimmerOpen(false); setIsStudioPlaying(true); }} 
                    initialStart={audioStart} 
                    initialEnd={audioEnd}
                />
            )}

            {isMusicPickerOpen && (
                <div className="fixed inset-0 z-[700] bg-[#0A0A0A] flex flex-col animate-slide-up">
                    <div className="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#121212] shrink-0">
                        <button onClick={() => setIsMusicPickerOpen(false)} className="text-[#B0B3B8] font-black uppercase text-[10px] tracking-widest">Back</button>
                        <h3 className="font-black text-white uppercase tracking-[4px] text-[10px]">Select Sound</h3>
                        <div className="w-8"></div>
                    </div>
                    
                    <div className="p-4 bg-[#121212] shrink-0">
                        <div className="relative">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/20"></i>
                            <input 
                                type="text"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 pl-11 text-white outline-none focus:ring-1 focus:ring-[#1877F2] font-medium"
                                placeholder="Search UNERA sounds..."
                                value={musicSearch}
                                onChange={(e) => setMusicSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div 
                            onClick={() => audioUploadRef.current?.click()}
                            className="bg-gradient-to-r from-[#1877F2]/20 to-transparent border border-[#1877F2]/30 p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-[#1877F2]/30 transition-all active:scale-95 mb-2"
                        >
                            <div className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center shadow-lg">
                                <i className="fas fa-file-import text-white text-xl"></i>
                            </div>
                            <div>
                                <p className="font-black text-white">Import from Phone</p>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">MP3, WAV, AAC</p>
                            </div>
                            <input type="file" ref={audioUploadRef} className="hidden" accept="audio/*" onChange={handleAudioUpload} />
                        </div>

                        <div className="h-px bg-white/5 my-2"></div>

                        {filteredSongs.map(song => (
                            <div key={song.id} onClick={() => { setSelectedAudio({ url: song.audioUrl, name: song.title }); setAudioStart(0); setAudioEnd(0); setIsMusicPickerOpen(false); setIsTrimmerOpen(true); }} className="bg-white/5 p-3 rounded-2xl flex items-center gap-4 active:scale-95 transition-transform border border-transparent hover:border-white/10 group">
                                <img src={song.cover} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt="" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm truncate group-hover:text-[#1877F2] transition-colors">{song.title}</p>
                                    <p className="text-white/40 text-[10px] font-bold truncate">{song.artist}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#1877F2]"><i className="fas fa-plus text-xs"></i></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SOUND DETAIL VIEW (TikTok Style) ---
interface SoundDetailViewProps {
    sound: { name: string, url?: string, start?: number, end?: number, creator?: User };
    reels: Reel[];
    onClose: () => void;
    onUseSound: (sound: any) => void;
    onReelClick: (id: number) => void;
}

const SoundDetailView: React.FC<SoundDetailViewProps> = ({ sound, reels, onClose, onUseSound, onReelClick }) => {
    // Filter reels that use this specific sound
    const matchingCreations = reels.filter(r => r.songName === sound.name || r.audioUrl === sound.url);
    const creationCountStr = matchingCreations.length >= 1000 ? (matchingCreations.length / 1000).toFixed(1) + 'K' : matchingCreations.length;

    return (
        <div className="fixed inset-0 z-[600] bg-black flex flex-col animate-fade-in font-sans pb-20 overflow-hidden">
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-xl shrink-0">
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform">
                    <i className="fas fa-chevron-left text-sm"></i>
                </button>
                <div className="flex flex-col items-center max-w-[250px]">
                    <h3 className="font-black text-white text-[12px] uppercase tracking-[4px] truncate w-full text-center">Sound Detail</h3>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                    <i className="fas fa-share-alt text-sm"></i>
                </button>
            </div>
            
            {/* Sound Hero Section */}
            <div className="p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-b from-white/5 to-transparent shrink-0">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-gray-900 via-gray-800 to-black shadow-[0_0_40px_rgba(0,0,0,0.8)] border-[3px] border-white/10 flex items-center justify-center animate-spin-slow">
                        <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 border border-white/5 flex items-center justify-center">
                            <i className="fas fa-music text-[#1877F2] text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-black text-white mb-1 leading-tight tracking-tighter">
                        Original Sound - {sound.creator?.name || 'User'}
                    </h2>
                    <p className="text-[#B0B3B8] font-black text-xs uppercase tracking-[4px] mb-6">
                        {creationCountStr} CREATIONS
                    </p>
                    
                    <button 
                        onClick={() => onUseSound(sound)} 
                        className="bg-[#1877F2] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 w-full md:w-fit"
                    >
                        <i className="fas fa-video text-sm"></i> Use this sound
                    </button>
                </div>
            </div>

            {/* Creations Grid */}
            <div className="flex-1 overflow-y-auto px-0.5 mt-4">
                <div className="grid grid-cols-3 gap-0.5">
                    {matchingCreations.map((r: Reel) => (
                        <div key={r.id} onClick={() => onReelClick(r.id)} className="aspect-[9/16] bg-white/5 relative cursor-pointer group overflow-hidden">
                            <video src={r.videoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" muted />
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] font-black drop-shadow-md bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <i className="fas fa-play text-[8px]"></i> 
                                {formatCount(r.shares * 15 + r.reactions.length * 2)} 
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- VIDEOS FEED COMPONENT ---
export const ReelsFeed: React.FC<any> = ({ reels, users, currentUser, onProfileClick, onCreateReelClick, onReact, onComment, onShare, onFollow, onUseSound, isGlobalPaused }) => {
    const [activeReelId, setActiveReelId] = useState<number | null>(reels[0]?.id || null);
    const [playingReelId, setPlayingReelId] = useState<number | null>(null); 
    const [showComments, setShowComments] = useState(false);
    const [selectedSoundData, setSelectedSoundData] = useState<any>(null);
    const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
    const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = Number(entry.target.getAttribute('data-reel-id'));
                    setActiveReelId(id);
                }
            });
        }, { threshold: 0.65 });
        document.querySelectorAll('.reel-container').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [reels]);

    // Robust Phase-Sync Engine for Feed
    useEffect(() => {
        Object.keys(videoRefs.current).forEach((key) => {
            const id = Number(key);
            const video = videoRefs.current[id];
            const audio = audioRefs.current[id];
            const reel = reels.find((r: Reel) => r.id === id);

            if (video) {
                if (id === playingReelId && !isGlobalPaused) {
                    if (video.paused) video.play().catch(() => {});
                    
                    if (audio && reel) { 
                        video.muted = true; 
                        const start = reel.audioStart || 0;
                        const end = reel.audioEnd || 1000000;
                        
                        const handleAudioSync = () => {
                            const expectedAudioTime = video.currentTime + start;
                            
                            // Check for looping
                            if (audio.currentTime >= end || expectedAudioTime >= end) {
                                audio.currentTime = start;
                                video.currentTime = 0;
                                return;
                            }

                            // Professional Sync Threshold (0.5s) to avoid buffering/stuttering
                            const drift = Math.abs(audio.currentTime - expectedAudioTime);
                            if (drift > 0.5) {
                                audio.currentTime = expectedAudioTime;
                            }
                        };

                        audio.addEventListener('timeupdate', handleAudioSync);
                        if (audio.paused) audio.play().catch(() => {});
                        return () => audio.removeEventListener('timeupdate', handleAudioSync);
                    } else {
                        video.muted = false;
                    }
                } else {
                    video.pause(); 
                    if (audio) audio.pause();
                }
            }
        });
    }, [playingReelId, isGlobalPaused, reels]);

    return (
        <div className="w-full h-[calc(100vh-56px)] flex justify-center bg-black overflow-hidden font-sans relative">
            <div className="w-full max-w-[450px] h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                {reels.map((reel: Reel) => {
                    const author = users.find((u: User) => u.id === reel.userId);
                    if (!author) return null;
                    const isFollowing = author && currentUser?.following.includes(author.id);
                    const hasLiked = reel.reactions.some(r => r.userId === currentUser?.id);

                    const soundPayload = { name: reel.songName, url: reel.audioUrl, start: reel.audioStart, end: reel.audioEnd, creator: author };

                    return (
                        <div key={reel.id} data-reel-id={reel.id} className="reel-container w-full h-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
                            <video 
                                ref={el => { if (el) videoRefs.current[reel.id] = el; }} 
                                src={reel.videoUrl} 
                                className="w-full h-full object-cover" 
                                loop 
                                playsInline 
                                onClick={() => setPlayingReelId(playingReelId === reel.id ? null : reel.id)}
                            />
                            {reel.audioUrl && <audio ref={el => { if (el) audioRefs.current[reel.id] = el; }} src={reel.audioUrl} loop={false} />}

                            {playingReelId !== reel.id && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        <i className="fas fa-play text-white text-3xl ml-1"></i>
                                    </div>
                                </div>
                            )}

                            {/* VIDEOS INFO OVERLAY */}
                            <div className="absolute bottom-0 left-0 w-full p-4 z-20 pb-12 bg-gradient-to-t from-black/90 via-transparent to-transparent">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={author.profileImage} className="w-10 h-10 rounded-full border border-white/50 object-cover cursor-pointer" alt="" onClick={() => onProfileClick(author.id)} />
                                                {currentUser?.id !== author.id && !isFollowing && (
                                                    <div onClick={() => onFollow(author.id)} className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1877F2] rounded-full flex items-center justify-center border border-black text-white cursor-pointer">
                                                        <i className="fas fa-plus text-[7px]"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-black text-[15px] drop-shadow-lg cursor-pointer" onClick={() => onProfileClick(author.id)}>{author.name}</span>
                                                    {author.isVerified && <i className="fas fa-check-circle text-[10px] text-[#1877F2]"></i>}
                                                    {!isFollowing && currentUser?.id !== author.id && (
                                                        <button 
                                                            onClick={() => onFollow(author.id)} 
                                                            className="ml-1 bg-[#1877F2] text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg active:scale-95 transition-all"
                                                        >
                                                            FOLLOW
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 px-2">
                                            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => onReact(reel.id, 'love')}>
                                                <i className={`fas fa-heart text-[22px] transition-transform active:scale-125 ${hasLiked ? 'text-[#F3425F]' : 'text-white'}`}></i>
                                                <span className="text-white text-[12px] font-black">{formatCount(reel.reactions.length)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setShowComments(true)}>
                                                <i className="fas fa-comment-dots text-[22px] text-white"></i>
                                                <span className="text-white text-[12px] font-black">{formatCount(reel.comments.length)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => onShare(reel.id)}>
                                                <i className="fas fa-share text-[22px] text-white"></i>
                                                <span className="text-white text-[12px] font-black">{formatCount(reel.shares)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-white text-[14px] font-medium leading-tight drop-shadow-lg line-clamp-2">{reel.caption}</p>
                                    
                                    <div className="flex items-center justify-between w-full">
                                        <div 
                                            className="flex items-center gap-2 text-white/90 text-sm w-44 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 cursor-pointer overflow-hidden group" 
                                            onClick={() => setSelectedSoundData(soundPayload)}
                                        >
                                            <i className="fas fa-music text-[10px]"></i>
                                            <div className="relative flex-1 overflow-hidden whitespace-nowrap">
                                                <div className="inline-block animate-marquee-slow font-bold text-[11px] tracking-tight">
                                                    {reel.songName} — {author.name} Original Sound
                                                </div>
                                            </div>
                                        </div>

                                        <div 
                                            className={`w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center border border-white/20 shadow-2xl cursor-pointer ${playingReelId === reel.id ? 'animate-spin-slow' : ''}`} 
                                            onClick={() => setSelectedSoundData(soundPayload)}
                                        >
                                            <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                                                <i className="fas fa-music text-[8px] text-white/80 animate-pulse"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {activeReelId && <ReelCommentsSheet isOpen={showComments} onClose={() => setShowComments(false)} comments={reels.find((r: any) => r.id === activeReelId)?.comments || []} users={users} currentUser={currentUser} onAddComment={(text: string) => onComment(activeReelId, text)} />}
            
            {/* New Sound Detail View Modal */}
            {selectedSoundData && (
                <SoundDetailView 
                    sound={selectedSoundData} 
                    reels={reels} 
                    onClose={() => setSelectedSoundData(null)}
                    onUseSound={(s) => { onUseSound(s); setSelectedSoundData(null); }}
                    onReelClick={(rid) => { 
                        // Scroll to the reel in the feed
                        const el = document.querySelector(`[data-reel-id="${rid}"]`);
                        el?.scrollIntoView({ behavior: 'smooth' });
                        setActiveReelId(rid);
                        setPlayingReelId(rid);
                        setSelectedSoundData(null);
                    }}
                />
            )}

            {currentUser && !selectedSoundData && (
                <button onClick={onCreateReelClick} className="absolute bottom-6 right-6 w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 border-2 border-black">
                    <i className="fas fa-plus text-2xl"></i>
                </button>
            )}
        </div>
    );
};

const ReelCommentsSheet: React.FC<any> = ({ isOpen, onClose, comments, users, currentUser, onAddComment }) => {
    const [text, setText] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[400] flex items-end justify-center bg-black/60 font-sans" onClick={onClose}>
            <div className="w-full max-w-[450px] h-[65vh] bg-[#121212] rounded-t-[32px] flex flex-col animate-slide-up border-t border-white/10" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-white font-black text-xs ml-4 uppercase tracking-[2px]">{comments.length} Comments</span>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white"><i className="fas fa-times text-xs"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {comments.map((c: any) => {
                        const author = users.find((u: any) => u.id === c.userId);
                        return (
                            <div key={c.id} className="flex gap-3">
                                <img src={author?.profileImage} className="w-9 h-9 rounded-full object-cover border border-white/5" alt="" />
                                <div className="flex-1">
                                    <p className="text-white/40 font-black text-[10px]">{author?.name}</p>
                                    <p className="text-[#E4E6EB] text-sm leading-snug">{c.text}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 pb-8 border-t border-white/5 bg-[#0A0A0A]">
                    <div className="flex gap-2">
                        <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#1877F2]/50" placeholder="Add a comment..." value={text} onChange={e => setText(e.target.value)} />
                        <button onClick={() => { if(text.trim()){ onAddComment(text); setText(''); } }} className="bg-[#1877F2] text-white px-4 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-paper-plane text-xs"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
