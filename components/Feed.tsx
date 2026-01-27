
import React, { useState, useRef } from 'react';
import { User, Post as PostType, ReactionType } from '../types';

export const ReactionButton: React.FC<{ currentUserReactions: ReactionType | undefined, onReact: (type: ReactionType) => void, isGuest?: boolean }> = ({ currentUserReactions, onReact, isGuest }) => {
    const [showDock, setShowDock] = useState(false);
    const timerRef = useRef<any>(null);
    const reactionConfig = [
        { type: 'like', icon: '👍', color: '#1877F2' },
        { type: 'love', icon: '❤️', color: '#F3425F' },
        { type: 'haha', icon: '😆', color: '#F7B928' },
        { type: 'wow', icon: '😮', color: '#F7B928' },
        { type: 'sad', icon: '😢', color: '#F7B928' },
        { type: 'angry', icon: '😡', color: '#E41E3F' },
    ] as const;
    const activeReaction = currentUserReactions ? reactionConfig.find(r => r.type === currentUserReactions) : null;
    return (
        <div className="flex-1 relative group" onMouseEnter={() => !isGuest && (timerRef.current = setTimeout(() => setShowDock(true), 500))} onMouseLeave={() => { clearTimeout(timerRef.current); setShowDock(false); }}>
            {showDock && (
                <div className="absolute -top-12 left-0 bg-[#242526] rounded-full shadow-xl p-1.5 flex gap-2 animate-fade-in border border-[#3E4042] z-50">
                    {reactionConfig.map(r => <div key={r.type} className="text-2xl hover:scale-125 transition-transform cursor-pointer hover:-translate-y-2 duration-200" onClick={() => { onReact(r.type); setShowDock(false); }}>{r.icon}</div>)}
                </div>
            )}
            <button onClick={() => isGuest ? alert("Login to react") : onReact('like')} className="w-full flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors">
                {activeReaction ? <><span className="text-[20px]">{activeReaction.icon}</span><span className="text-sm font-semibold" style={{ color: activeReaction.color }}>{activeReaction.type.charAt(0).toUpperCase() + activeReaction.type.slice(1)}</span></> : <><i className="far fa-thumbs-up text-[20px] text-[#B0B3B8]"></i><span className="text-sm font-semibold text-[#B0B3B8]">Like</span></>}
            </button>
        </div>
    );
};

export const CreatePost: React.FC<{ currentUser: User | null, onClick: () => void }> = ({ currentUser, onClick }) => {
    return (
        <div className="bg-gradient-to-r from-[#242526] to-[#2a2b2d] rounded-xl p-4 mb-4 shadow-xl border border-[#3E4042] flex flex-col gap-4">
            <div className="flex gap-3 items-center cursor-pointer" onClick={onClick}>
                <img src={currentUser?.profileImage} className="w-11 h-11 rounded-full bg-[#3A3B3C] object-cover border-2 border-[#1877F2]" alt="" />
                <div className="flex-1 bg-[#3A3B3C]/50 hover:bg-[#4E4F50]/50 transition-colors rounded-full px-5 py-2.5 border border-[#3E4042]">
                    <span className="text-[#B0B3B8] text-[17px]">What's on your mind, {currentUser?.name?.split(' ')[0] || 'friend'}?</span>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#3E4042] pt-3 px-2">
                <button onClick={onClick} className="flex items-center gap-2 hover:bg-[#3A3B3C] px-4 py-2 rounded-lg transition-colors">
                    <i className="fas fa-video text-[#F3425F] text-xl"></i>
                    <span className="text-[#B0B3B8] font-bold text-sm">Live Video</span>
                </button>
                <button onClick={onClick} className="flex items-center gap-2 hover:bg-[#3A3B3C] px-4 py-2 rounded-lg transition-colors">
                    <i className="fas fa-images text-[#45BD62] text-xl"></i>
                    <span className="text-[#B0B3B8] font-bold text-sm">Photo/Video</span>
                </button>
                <button onClick={onClick} className="flex items-center gap-2 hover:bg-[#3A3B3C] px-4 py-2 rounded-lg transition-colors">
                    <i className="fas fa-smile text-[#F7B928] text-xl"></i>
                    <span className="text-[#B0B3B8] font-bold text-sm">Feeling</span>
                </button>
            </div>
        </div>
    );
};

interface PostProps {
    post: PostType;
    author: User;
    currentUser: User | null;
    onProfileClick: (id: number) => void;
    onReact: (postId: number, type: ReactionType) => void;
    onShare: (postId: number) => void;
    onViewImage: (url: string) => void;
    onOpenComments: (postId: number) => void;
    onFollow?: (id: number) => void;
    className?: string;
    isGroupPost?: boolean;
    isAdminBadge?: boolean;
}

export const Post: React.FC<PostProps> = ({ post, author, currentUser, onProfileClick, onReact, onShare, onViewImage, onOpenComments, onFollow, className, isGroupPost, isAdminBadge }) => {
    const myReaction = currentUser ? post.reactions?.find((r: any) => r.userId === currentUser.id)?.type : undefined;
    const isOwner = currentUser?.id === author?.id;
    const isFollowing = currentUser && author?.followers?.includes(currentUser.id);
    
    const containerClasses = className || "bg-[#242526] md:rounded-xl shadow-lg mb-4 animate-fade-in border-y md:border border-[#3E4042] overflow-hidden max-w-[680px] mx-auto w-full";

    return (
        <div className={containerClasses}>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={author?.profileImage} className="w-11 h-11 rounded-full object-cover cursor-pointer border border-[#3E4042]" onClick={() => onProfileClick(author.id)} alt="" />
                    <div>
                        <div className="flex items-center gap-1 leading-tight">
                            <h4 className="font-bold text-[#E4E6EB] text-[18px] cursor-pointer hover:underline" onClick={() => onProfileClick(author.id)}>
                                {author?.name}
                            </h4>
                            {author?.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-[13px]"></i>}
                            {isAdminBadge && (
                                <span className="ml-1 bg-[#1877F2]/10 text-[#1877F2] text-[10px] font-black px-1.5 py-0.5 rounded border border-[#1877F2]/20 uppercase tracking-tighter">Admin</span>
                            )}
                            {!isOwner && !isFollowing && !isGroupPost && <button onClick={() => onFollow?.(author.id)} className="ml-2 text-[#1877F2] font-bold text-[14px] hover:underline">Follow</button>}
                        </div>
                        <div className="flex items-center gap-1 text-[#B0B3B8] text-xs mt-0.5">
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <i className={`fas ${isGroupPost ? 'fa-users' : 'fa-globe-americas'} text-[10px]`}></i>
                        </div>
                    </div>
                </div>
                <i className="fas fa-ellipsis-h text-[#B0B3B8] cursor-pointer p-2 rounded-full hover:bg-[#3A3B3C]"></i>
            </div>
            
            {post.content && <div className="px-4 pb-3 text-[21px] text-[#E4E6EB] leading-tight whitespace-pre-wrap font-medium">{post.content}</div>}
            
            {post.image && <img src={post.image} className="w-full object-cover max-h-[600px] cursor-pointer border-y border-[#3E4042]" onClick={() => onViewImage(post.image)} alt="" />}
            
            {post.video && <div className="relative w-full aspect-video bg-black border-y border-[#3E4042]"><video src={post.video} className="w-full h-full" controls /></div>}
            
            <div className="px-4 py-2 flex items-center justify-between text-[#B0B3B8] text-sm border-b border-[#3E4042]">
                <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1">
                        <div className="bg-[#1877F2] w-5 h-5 rounded-full flex items-center justify-center border border-[#242526] z-10"><i className="fas fa-thumbs-up text-[10px] text-white"></i></div>
                        <div className="bg-[#F3425F] w-5 h-5 rounded-full flex items-center justify-center border border-[#242526] z-0"><i className="fas fa-heart text-[10px] text-white"></i></div>
                    </div>
                    <span>{post.reactions?.length || 0}</span>
                </div>
                <div className="flex gap-3"><span>{post.comments?.length || 0} comments</span><span>{post.shares || 0} shares</span></div>
            </div>
            
            <div className="px-2 py-1 flex justify-between">
                 <ReactionButton currentUserReactions={myReaction} onReact={(type) => onReact(post.id, type)} isGuest={!currentUser}/>
                 <button onClick={() => onOpenComments(post.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors"><i className="far fa-comment-alt text-[20px] text-[#B0B3B8]"></i><span className="text-sm font-semibold text-[#B0B3B8]">Comment</span></button>
                 <button onClick={() => onShare(post.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors"><i className="fas fa-share text-[20px] text-[#B0B3B8]"></i><span className="text-sm font-semibold text-[#B0B3B8]">Share</span></button>
            </div>
        </div>
    );
};

export const CreatePostModal: React.FC<any> = ({ currentUser, onClose, onCreatePost }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handlePost = () => { if (!text.trim() && !file) return; onCreatePost(text, file); };
    return (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-xl font-sans animate-fade-in">
            <div className="bg-[#1C1C1E] w-full max-w-[580px] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                {/* Modern Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#2C2C2E]/30">
                    <h3 className="text-xl font-black text-white tracking-tight">Create Post</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-white/10 transition-all">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img src={currentUser?.profileImage} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#1877F2] shadow-lg shadow-blue-500/10" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#31A24C] rounded-full border-[3px] border-[#1C1C1E]"></div>
                        </div>
                        <div>
                            <p className="font-black text-white text-lg">{currentUser?.name}</p>
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 mt-0.5">
                                <i className="fas fa-globe-americas text-[10px] text-[#8E8E93]"></i>
                                <span className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest">Public</span>
                                <i className="fas fa-caret-down text-[10px] text-[#8E8E93]"></i>
                            </div>
                        </div>
                    </div>

                    <textarea 
                        className="w-full bg-transparent border-none outline-none text-[#E4E6EB] text-[22px] min-h-[160px] resize-none placeholder-white/10 font-medium leading-tight mb-4" 
                        placeholder={`What's on your mind, ${currentUser?.name?.split(' ')[0] || 'friend'}?`} 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                    />

                    {file && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 mt-2 shadow-2xl group">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => setFile(null)} className="bg-red-500 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbox Footer */}
                <div className="p-6 bg-[#2C2C2E]/20 border-t border-white/5">
                    <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-2xl mb-6 shadow-inner">
                        <span className="text-white font-black text-sm ml-3">Add to your post</span>
                        <div className="flex items-center gap-1">
                            {[
                                { icon: 'fa-images', color: '#45BD62', label: 'Photo/Video' },
                                { icon: 'fa-user-tag', color: '#1877F2', label: 'Tag People' },
                                { icon: 'fa-smile', color: '#F7B928', label: 'Feeling/Activity' },
                                { icon: 'fa-location-dot', color: '#F3425F', label: 'Check-in' }
                            ].map((tool, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => tool.label === 'Photo/Video' && fileInputRef.current?.click()}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all group"
                                    title={tool.label}
                                >
                                    <i className={`fas ${tool.icon} text-xl group-hover:scale-110 transition-transform`} style={{ color: tool.color }}></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handlePost} 
                        disabled={!text.trim() && !file} 
                        className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-4 rounded-2xl font-black text-lg disabled:opacity-30 transition-all shadow-xl shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {text.trim() || file ? <i className="fas fa-paper-plane text-sm"></i> : null}
                        Post to Feed
                    </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
        </div>
    );
};
