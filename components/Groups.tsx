
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User, Group, Event, Post as PostType, LinkPreview, GroupPost } from '../types';
import { Post, CreatePostModal } from './Feed';
import { CreateEventModal } from './Events';

interface GroupsPageProps {
    currentUser: User | null;
    groups: Group[];
    users: User[];
    onCreateGroup: (group: Partial<Group>) => void;
    onJoinGroup: (groupId: string) => void;
    onLeaveGroup: (groupId: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onUpdateGroupImage: (groupId: string, type: 'cover' | 'profile', file: File) => void;
    onPostToGroup: (groupId: string, text: string, file: File | null, type: any, visibility: any) => void;
    onCreateGroupEvent: (groupId: string, event: Partial<Event>) => void;
    onInviteToGroup: (groupId: string, userIds: number[]) => void;
    onProfileClick: (id: number) => void;
    onLikePost: (groupId: string, postId: number) => void;
    onOpenComments: (groupId: string, postId: number) => void;
    onSharePost: (groupId: string, postId: number) => void;
    onDeleteGroupPost: (postId: number) => void;
    onRemoveMember: (groupId: string, memberId: number) => void;
    onRestrictMember: (groupId: string, memberId: number) => void;
    onUpdateGroupSettings: (groupId: string, settings: Partial<Group>) => void;
    onMessageAuthor?: (id: number) => void;
    initialGroupId?: string | null;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({ 
    currentUser, groups, users, 
    onCreateGroup, onJoinGroup, onLeaveGroup, onDeleteGroup, onUpdateGroupImage,
    onPostToGroup, onCreateGroupEvent, onInviteToGroup, 
    onProfileClick, onLikePost, onOpenComments, onSharePost, onDeleteGroupPost, onRemoveMember, onRestrictMember, onUpdateGroupSettings,
    onMessageAuthor, initialGroupId
}) => {
    const [view, setView] = useState<'feed' | 'detail'>('feed');
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [groupTab, setGroupTab] = useState<'Posts' | 'Announcements' | 'Events' | 'Media'>('Posts');
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showGroupPostModal, setShowGroupPostModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showCreateGroupEventModal, setShowCreateGroupEventModal] = useState(false);

    const groupCoverInputRef = useRef<HTMLInputElement>(null);
    const groupProfileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialGroupId) {
            const group = groups.find(g => g.id === initialGroupId);
            if (group) {
                setActiveGroupId(group.id);
                setView('detail');
            }
        } else {
            setView('feed');
            setActiveGroupId(null);
        }
    }, [initialGroupId, groups]);

    const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || null, [groups, activeGroupId]);
    const isMember = currentUser && activeGroup && (activeGroup.members.includes(currentUser.id) || activeGroup.adminId === currentUser.id);
    const isAdmin = currentUser && activeGroup && activeGroup.adminId === currentUser.id;

    const handleGroupClick = (group: Group) => {
        setActiveGroupId(group.id);
        setView('detail');
        setGroupTab('Posts');
        window.scrollTo(0, 0);
    };

    if (view === 'feed' || !activeGroup) {
        return (
            <div className="w-full max-w-[1000px] mx-auto p-4 font-sans pb-20">
                <div className="flex justify-between items-center mb-6 bg-[#242526] p-6 rounded-2xl border border-[#3E4042] shadow-xl">
                    <div>
                        <h2 className="text-3xl font-black text-[#E4E6EB] tracking-tight">Communities</h2>
                        <p className="text-[#B0B3B8] font-medium">Join conversations that matter to you.</p>
                    </div>
                    {currentUser && (
                        <button onClick={() => setShowCreateModal(true)} className="bg-[#1877F2] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#166FE5] transition-all shadow-lg active:scale-95">
                            <i className="fas fa-plus-circle"></i> <span>Create Group</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="bg-[#242526] rounded-2xl overflow-hidden border border-[#3E4042] flex flex-col hover:shadow-2xl transition-all group cursor-pointer" onClick={() => handleGroupClick(group)}>
                            <div className="h-32 relative">
                                <img src={group.coverImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-black uppercase">{group.type}</div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col relative">
                                <div className="absolute -top-10 left-4 w-16 h-16 rounded-xl border-4 border-[#242526] overflow-hidden bg-[#242526] shadow-xl">
                                    <img src={group.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="mt-6">
                                    <h4 className="font-black text-xl text-[#E4E6EB] group-hover:text-[#1877F2] transition-colors">{group.name}</h4>
                                    <p className="text-[#B0B3B8] text-sm mt-1 line-clamp-2">{group.description}</p>
                                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-[#B0B3B8]">
                                        <i className="fas fa-users"></i>
                                        <span>{group.members.length.toLocaleString()} members</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#18191A] min-h-screen font-sans">
            {/* Immersive Edge-to-Edge Header */}
            <div className="bg-[#242526] shadow-lg">
                <div className="w-full h-[220px] md:h-[400px] relative group overflow-hidden">
                    <img src={activeGroup.coverImage} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    {isAdmin && (
                        <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl cursor-pointer hover:bg-white/20 font-bold text-white text-sm flex items-center gap-2 border border-white/10 transition-all" onClick={() => groupCoverInputRef.current?.click()}>
                            <i className="fas fa-camera"></i> <span>Edit Cover</span>
                        </div>
                    )}
                    <input type="file" ref={groupCoverInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpdateGroupImage(activeGroup.id, 'cover', e.target.files[0])} />
                </div>

                <div className="max-w-[1095px] mx-auto px-4 pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-10 md:-mt-16 relative z-10 gap-6 mb-6">
                        <div className="relative group">
                            <div className="w-[100px] h-[100px] md:w-[168px] md:h-[168px] rounded-3xl border-[6px] border-[#242526] overflow-hidden bg-[#242526] shadow-2xl">
                                <img src={activeGroup.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            {isAdmin && (
                                <div className="absolute bottom-2 right-2 bg-[#3A3B3C] p-2.5 rounded-full cursor-pointer hover:bg-[#4E4F50] border-2 border-[#242526] shadow-lg" onClick={() => groupProfileInputRef.current?.click()}>
                                    <i className="fas fa-camera text-white text-sm"></i>
                                </div>
                            )}
                            <input type="file" ref={groupProfileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpdateGroupImage(activeGroup.id, 'profile', e.target.files[0])} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl md:text-4xl font-black text-[#E4E6EB] leading-none mb-2 tracking-tight">{activeGroup.name}</h1>
                            <div className="flex flex-wrap items-center gap-2 text-[#B0B3B8] text-sm font-bold">
                                <i className={`fas ${activeGroup.type === 'public' ? 'fa-globe-americas' : 'fa-lock'} text-[10px]`}></i>
                                <span className="capitalize">{activeGroup.type} Group</span>
                                <span>•</span>
                                <span className="text-[#E4E6EB]">{activeGroup.members.length.toLocaleString()} members</span>
                            </div>
                            
                            {/* Member Avatars Overlapping */}
                            <div className="flex items-center gap-3 mt-4">
                                <div className="flex -space-x-2">
                                    {activeGroup.members.slice(0, 6).map((id, i) => {
                                        const u = users.find(user => user.id === id);
                                        return u ? <img key={id} src={u.profileImage} className="w-8 h-8 rounded-full border-2 border-[#242526] object-cover" alt="" /> : null;
                                    })}
                                    {activeGroup.members.length > 6 && (
                                        <div className="w-8 h-8 rounded-full bg-[#3A3B3C] border-2 border-[#242526] flex items-center justify-center text-[10px] font-black text-white">
                                            +{activeGroup.members.length - 6}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex gap-2">
                            {isMember ? (
                                <>
                                    <button onClick={() => setShowInviteModal(true)} className="bg-[#1877F2] text-white px-8 py-2.5 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#166FE5] transition-all shadow-lg active:scale-95 flex-1 md:flex-none">
                                        <i className="fas fa-user-plus"></i> Invite
                                    </button>
                                    <button className="bg-[#3A3B3C] text-[#E4E6EB] px-5 py-2.5 rounded-xl font-black text-base hover:bg-[#4E4F50] transition-all flex-1 md:flex-none">Joined</button>
                                </>
                            ) : (
                                <button onClick={() => currentUser ? onJoinGroup(activeGroup.id) : alert("Login to join")} className="bg-[#1877F2] text-white px-10 py-3 rounded-xl font-black text-lg hover:bg-[#166FE5] transition-all shadow-xl active:scale-95 w-full md:w-auto">
                                    Join Group
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs - Sticky Style */}
                    <div className="border-t border-[#3E4042] flex items-center gap-1 pt-1 overflow-x-auto scrollbar-hide sticky top-14 bg-[#242526] z-20">
                        {['Posts', 'Announcements', 'Events', 'Media'].map(tab => (
                            <div 
                                key={tab} 
                                onClick={() => setGroupTab(tab as any)} 
                                className={`px-6 py-4 cursor-pointer font-black text-[16px] border-b-[4px] transition-all whitespace-nowrap ${groupTab === tab ? 'text-[#1877F2] border-[#1877F2]' : 'text-[#B0B3B8] border-transparent hover:bg-[#3A3B3C] rounded-t-xl'}`}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[720px] mx-auto pb-20">
                {groupTab === 'Posts' && (
                    <div className="flex flex-col gap-1 md:mt-4">
                        {/* Membership-Gated Composer */}
                        {isMember && (
                            <div className="bg-[#242526] md:rounded-2xl p-4 mb-4 border-b md:border border-[#3E4042] shadow-xl flex flex-col gap-4">
                                <div className="flex gap-3 items-center cursor-pointer" onClick={() => setShowGroupPostModal(true)}>
                                    <img src={currentUser?.profileImage} className="w-11 h-11 rounded-full bg-[#3A3B3C] object-cover border border-[#3E4042]" alt="" />
                                    <div className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] transition-colors rounded-full px-5 py-2.5">
                                        <span className="text-[#B0B3B8] text-[17px]">Write something, {currentUser?.name.split(' ')[0]}...</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#3E4042] pt-3 px-2">
                                    <button className="flex items-center gap-2 hover:bg-[#3A3B3C] px-4 py-2 rounded-xl transition-colors">
                                        <i className="fas fa-images text-[#45BD62] text-xl"></i>
                                        <span className="text-[#B0B3B8] font-black text-sm">Photos</span>
                                    </button>
                                    <button className="flex items-center gap-2 hover:bg-[#3A3B3C] px-4 py-2 rounded-xl transition-colors">
                                        <i className="fas fa-smile text-[#F7B928] text-xl"></i>
                                        <span className="text-[#B0B3B8] font-black text-sm">Feeling</span>
                                    </button>
                                    <button className="flex items-center gap-2 hover:bg-[#3A3B3C] px-4 py-2 rounded-xl transition-colors">
                                        <i className="fas fa-poll text-[#2ABBA7] text-xl"></i>
                                        <span className="text-[#B0B3B8] font-black text-sm">Poll</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Edge-to-Edge Feed */}
                        <div className="flex flex-col">
                            {activeGroup.posts.length > 0 ? (
                                activeGroup.posts.map(post => (
                                    <div key={post.id} className="w-full">
                                        <Post 
                                            post={{
                                                ...post,
                                                timestamp: 'Just now',
                                                type: post.image ? 'image' : 'text'
                                            }}
                                            author={users.find(u => u.id === post.authorId) || users[0]}
                                            currentUser={currentUser}
                                            users={users}
                                            onProfileClick={onProfileClick}
                                            onReact={() => onLikePost(activeGroup.id, post.id)}
                                            onShare={() => onSharePost(activeGroup.id, post.id)}
                                            onOpenComments={() => onOpenComments(activeGroup.id, post.id)}
                                            onViewImage={() => {}}
                                            // Special styling for Group Posts to be edge-to-edge
                                            className="!rounded-none !shadow-none !mb-1 !border-x-0 !border-b-[#3E4042] !max-w-none"
                                            isGroupPost={true}
                                            isAdminBadge={post.authorId === activeGroup.adminId}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center text-[#B0B3B8]">
                                    <i className="fas fa-comments text-5xl mb-4 opacity-20"></i>
                                    <p className="text-xl font-bold">No discussions yet</p>
                                    <p className="text-sm">Be the first to start a conversation.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {groupTab === 'Events' && (
                    <div className="p-4 flex flex-col gap-4">
                        {isMember && (
                            <button onClick={() => setShowCreateGroupEventModal(true)} className="bg-[#1877F2] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#166FE5] transition-all active:scale-95 mb-4">
                                <i className="fas fa-calendar-plus mr-2"></i> Create Group Event
                            </button>
                        )}
                        {(activeGroup.events || []).length > 0 ? (
                            activeGroup.events?.map(e => (
                                <div key={e.id} className="bg-[#242526] rounded-2xl border border-[#3E4042] overflow-hidden flex gap-4 p-4 hover:bg-[#2A2B2C] transition-colors group cursor-pointer">
                                    <img src={e.image} className="w-24 h-24 rounded-xl object-cover group-hover:scale-105 transition-transform" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-xl truncate mb-1">{e.title}</h4>
                                        <p className="text-[#1877F2] font-black text-sm uppercase tracking-tighter">{new Date(e.date).toLocaleDateString()} • {e.time}</p>
                                        <p className="text-[#B0B3B8] text-[15px] line-clamp-1 mt-1 font-medium">{e.location}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-[#242526] rounded-3xl border border-[#3E4042]">
                                <i className="fas fa-calendar-times text-5xl text-[#3A3B3C] mb-4"></i>
                                <p className="text-[#B0B3B8] font-black text-lg">No upcoming group events</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showGroupPostModal && currentUser && (
                <CreatePostModal 
                    currentUser={currentUser} 
                    onClose={() => setShowGroupPostModal(false)} 
                    onCreatePost={(text: string, file: File | null) => {
                        onPostToGroup(activeGroup.id, text, file, file ? 'image' : 'text', 'Public');
                        setShowGroupPostModal(false);
                    }} 
                />
            )}

            {showInviteModal && currentUser && (
                <div className="fixed inset-0 z-[250] bg-black/90 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-[#242526] w-full max-w-[480px] rounded-3xl border border-[#3E4042] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-[#3E4042] flex justify-between items-center bg-[#2A2B2C]">
                            <h3 className="text-2xl font-black text-[#E4E6EB] tracking-tight">Invite to Group</h3>
                            <div onClick={() => setShowInviteModal(false)} className="w-10 h-10 rounded-full bg-[#3A3B3C] flex items-center justify-center cursor-pointer hover:bg-[#4E4F50] transition-all"><i className="fas fa-times text-white"></i></div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {users.filter(u => currentUser.following.includes(u.id) && !activeGroup.members.includes(u.id)).map(follower => (
                                <div key={follower.id} className="flex items-center justify-between p-3 hover:bg-[#3A3B3C] rounded-2xl transition-all group">
                                    <div className="flex items-center gap-4">
                                        <img src={follower.profileImage} className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-[#1877F2]" alt="" />
                                        <span className="font-black text-white text-lg">{follower.name}</span>
                                    </div>
                                    <button onClick={() => { onInviteToGroup(activeGroup.id, [follower.id]); }} className="bg-[#1877F2] text-white px-6 py-2 rounded-xl font-black text-sm hover:bg-[#166FE5] shadow-md transition-all active:scale-90">Invite</button>
                                </div>
                            ))}
                            {users.filter(u => currentUser.following.includes(u.id) && !activeGroup.members.includes(u.id)).length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-[#B0B3B8] font-bold">All your followers are already here!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
