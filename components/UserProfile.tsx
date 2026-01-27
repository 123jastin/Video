import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Post as PostType, ReactionType, Reel, AudioTrack, Song, Episode, Group, Brand } from '../types';
import { Post, CreatePostModal, CreatePost } from './Feed';
import { INITIAL_GROUPS, INITIAL_BRANDS } from '../constants';

interface UserProfileProps {
    user: User;
    currentUser: User | null;
    users: User[];
    posts: PostType[];
    reels?: Reel[]; 
    songs: Song[];
    episodes: Episode[];
    onProfileClick: (id: number) => void;
    onFollow: (id: number) => void;
    onReact: (postId: number, type: ReactionType) => void;
    onComment: (postId: number, text: string) => void;
    onShare: (postId: number) => void;
    onMessage: (id: number) => void;
    onCreatePost: (text: string, file: File | null, type: any, visibility: any) => void;
    onUpdateProfileImage: (file: File) => void;
    // Fix: Remove duplicate onUpdateCoverImage definition
    onUpdateCoverImage: (file: File) => void;
    onUpdateUserDetails: (data: Partial<User>) => void;
    onDeletePost: (postId: number) => void;
    onEditPost: (postId: number, content: string) => void;
    getCommentAuthor: (id: number) => User | undefined;
    onViewImage: (url: string) => void;
    onOpenComments: (postId: number) => void;
    onVideoClick: (post: PostType) => void;
    onPlayAudio?: (track: AudioTrack) => void; 
    onTagClick?: (tag: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
    user, currentUser, users, posts, reels = [], songs = [], episodes = [], 
    onProfileClick, onFollow, onReact, onComment, onShare, onMessage, 
    onCreatePost, onUpdateProfileImage, onUpdateCoverImage, onUpdateUserDetails, 
    // Fix: Remove duplicate onUpdateCoverImage from props destructuring
    onDeletePost, onEditPost, getCommentAuthor, onViewImage, onOpenComments, onVideoClick, onPlayAudio, onTagClick 
}) => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const isCurrentUser = currentUser && user.id === currentUser.id;
    const isFollowing = currentUser ? user.followers.includes(currentUser.id) : false;

    const userPosts = posts.filter(post => post.authorId === user.id);

    return (
        <div className="w-full bg-[#18191A] min-h-screen font-sans">
            <div className="bg-[#242526] shadow-md border-b border-[#3E4042]">
                <div className="max-w-[1095px] mx-auto w-full relative">
                    <div className="h-[200px] md:h-[350px] w-full bg-gray-800 relative md:rounded-b-xl overflow-hidden">
                        {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover" alt="" />}
                    </div>

                    <div className="px-4 pb-0">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-[84px] md:-mt-[30px] relative z-10 mb-4">
                            <div className="relative">
                                <div className="w-[168px] h-[168px] rounded-full border-[6px] border-[#242526] bg-[#242526] overflow-hidden">
                                    <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>
                            <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left md:mb-4">
                                <h1 className="text-[32px] font-black text-[#E4E6EB] leading-tight">
                                    {user.name} {user.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-[20px]"></i>}
                                </h1>
                                <span className="text-[#B0B3B8] font-bold text-[17px] mt-1">{user.followers.length} Followers</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0 md:mb-6">
                                {isCurrentUser ? (
                                    <button className="bg-[#1877F2] text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg"><i className="fas fa-plus-circle"></i> Add to Story</button>
                                ) : (
                                    <button onClick={() => onFollow(user.id)} className={`${isFollowing ? 'bg-[#3A3B3C] text-[#E4E6EB]' : 'bg-[#1877F2] text-white'} px-8 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95`}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                                <button onClick={() => onMessage(user.id)} className="bg-[#3A3B3C] text-[#E4E6EB] px-3 py-2 rounded-lg font-bold"><i className="fab fa-facebook-messenger"></i></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 pt-1 overflow-x-auto scrollbar-hide border-t border-[#3E4042]">
                            {['Posts', 'About', 'Friends', 'Photos', 'Videos'].map(tab => (
                                <div key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3.5 cursor-pointer whitespace-nowrap text-[16px] font-bold border-b-[3px] transition-colors ${activeTab === tab ? 'text-[#1877F2] border-[#1877F2]' : 'text-[#B0B3B8] border-transparent hover:bg-[#3A3B3C] rounded-t-lg'}`}>{tab}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1095px] mx-auto w-full flex flex-col md:flex-row gap-4 py-4">
                <div className="w-full md:w-[380px] flex-shrink-0 space-y-4 px-4 md:px-0">
                    <div className="bg-[#242526] rounded-xl p-4 border border-[#3E4042] shadow-sm">
                        <h2 className="text-xl font-bold text-[#E4E6EB] mb-4">Intro</h2>
                        <p className="text-center text-[17px] leading-relaxed mb-4">{user.bio || 'Professional account on UNERA.'}</p>
                        <div className="space-y-3 text-[#E4E6EB]">
                           {user.location && <div className="flex items-center gap-3"><i className="fas fa-home text-[#B0B3B8] w-5 text-center"></i><span>Lives in <span className="font-bold">{user.location}</span></span></div>}
                           <div className="flex items-center gap-3"><i className="fas fa-rss text-[#B0B3B8] w-5 text-center"></i><span>Followed by <span className="font-bold">{user.followers.length} people</span></span></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                    {activeTab === 'Posts' && (
                        <>
                            {isCurrentUser && <div className="mx-4 md:mx-0"><CreatePost currentUser={currentUser} onProfileClick={onProfileClick} onClick={() => setShowCreatePostModal(true)} /></div>}
                            {userPosts.length > 0 ? userPosts.map(post => (
                                <Post 
                                    key={post.id} 
                                    post={post} 
                                    author={user} 
                                    currentUser={currentUser} 
                                    users={users} 
                                    onProfileClick={onProfileClick} 
                                    onReact={onReact} 
                                    onShare={onShare} 
                                    onDelete={onDeletePost} 
                                    onViewImage={onViewImage} 
                                    onOpenComments={onOpenComments} 
                                    onVideoClick={onVideoClick} 
                                    onTagClick={onTagClick} 
                                    onFollow={onFollow} 
                                />
                            )) : (
                                <div className="bg-[#242526] rounded-xl p-12 text-center border border-[#3E4042]">
                                    <p className="text-[#B0B3B8] text-lg">No posts yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {showCreatePostModal && <CreatePostModal currentUser={currentUser!} users={users} onClose={() => setShowCreatePostModal(false)} onCreatePost={onCreatePost} />}
        </div>
    );
};