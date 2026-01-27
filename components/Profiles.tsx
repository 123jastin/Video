import React, { useState, useMemo } from 'react';
import { User, Group, Brand } from '../types';

interface ProfilesPageProps {
    currentUser: User | null;
    users: User[];
    groups: Group[];
    brands: Brand[];
    onFollowUser: (id: number) => void;
    onJoinGroup: (id: string) => void;
    onFollowBrand: (id: number) => void;
    onProfileClick: (id: number) => void;
    onGroupClick: (group: Group) => void;
    onBrandClick: (brandId: number) => void;
}

export const ProfilesPage: React.FC<ProfilesPageProps> = ({
    currentUser, users, groups, brands,
    onFollowUser, onJoinGroup, onFollowBrand,
    onProfileClick, onGroupClick, onBrandClick
}) => {
    const [activeSection, setActiveSection] = useState<'all' | 'people' | 'groups' | 'pages'>('all');

    const recommendedPeople = useMemo(() => {
        if (!currentUser) return users.slice(0, 12);
        return users.filter(u => 
            u.id !== currentUser.id && 
            !currentUser.following.includes(u.id)
        ).sort(() => Math.random() - 0.5);
    }, [users, currentUser]);

    const recommendedGroups = useMemo(() => {
        if (!currentUser) return groups.slice(0, 8);
        return groups.filter(g => 
            !g.members.includes(currentUser.id) && 
            g.adminId !== currentUser.id
        ).sort(() => Math.random() - 0.5);
    }, [groups, currentUser]);

    const recommendedPages = useMemo(() => {
        if (!currentUser) return brands.slice(0, 8);
        return brands.filter(b => 
            !b.followers.includes(currentUser.id) && 
            b.adminId !== currentUser.id
        ).sort(() => Math.random() - 0.5);
    }, [brands, currentUser]);

    const SectionHeader = ({ title, count, onSeeAll }: { title: string, count: number, onSeeAll?: () => void }) => (
        <div className="flex justify-between items-end mb-4 px-1">
            <div>
                <h3 className="text-xl font-black text-[#E4E6EB] tracking-tight">{title}</h3>
                <p className="text-[#B0B3B8] text-xs font-bold uppercase tracking-widest">{count} Suggestions for you</p>
            </div>
            {onSeeAll && <button onClick={onSeeAll} className="text-[#1877F2] font-bold text-sm hover:underline">See All</button>}
        </div>
    );

    return (
        <div className="w-full max-w-[1100px] mx-auto p-4 font-sans pb-24 animate-fade-in">
            <div className="bg-[#242526] p-6 rounded-3xl border border-[#3E4042] shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#1877F2]/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-[#E4E6EB] mb-2 tracking-tighter">Discovery Center</h1>
                    <p className="text-[#B0B3B8] text-lg font-medium max-w-xl">Find the people, communities, and businesses that matter to you.</p>
                </div>

                <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'all', label: 'Everything', icon: 'fa-compass' },
                        { id: 'people', label: 'People', icon: 'fa-user-plus' },
                        { id: 'groups', label: 'Groups', icon: 'fa-users' },
                        { id: 'pages', label: 'Pages', icon: 'fa-award' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all whitespace-nowrap border ${
                                activeSection === tab.id 
                                ? 'bg-[#1877F2] border-[#1877F2] text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-[#3A3B3C] border-transparent text-[#E4E6EB] hover:bg-[#4E4F50]'
                            }`}
                        >
                            <i className={`fas ${tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                {(activeSection === 'all' || activeSection === 'people') && recommendedPeople.length > 0 && (
                    <section>
                        <SectionHeader title="People You May Know" count={recommendedPeople.length} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {recommendedPeople.slice(0, activeSection === 'all' ? 10 : 20).map(user => (
                                <div key={user.id} className="bg-[#242526] rounded-2xl border border-[#3E4042] overflow-hidden group hover:border-[#1877F2]/50 transition-all shadow-md">
                                    <div className="h-24 bg-gradient-to-br from-[#1877F2]/20 to-[#3A3B3C] relative cursor-pointer" onClick={() => onProfileClick(user.id)}>
                                        <img src={user.coverImage || user.profileImage} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="" />
                                    </div>
                                    <div className="px-3 pb-4 -mt-10 relative text-center">
                                        <div className="w-20 h-20 rounded-full border-4 border-[#242526] overflow-hidden mx-auto bg-[#3A3B3C] shadow-lg cursor-pointer" onClick={() => onProfileClick(user.id)}>
                                            <img src={user.profileImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                        </div>
                                        <h4 className="font-bold text-[#E4E6EB] text-[15px] mt-2 line-clamp-1 hover:underline cursor-pointer" onClick={() => onProfileClick(user.id)}>{user.name}</h4>
                                        <p className="text-[#B0B3B8] text-[11px] font-bold mb-3">{user.followers.length} mutual friends</p>
                                        <button 
                                            onClick={() => onFollowUser(user.id)}
                                            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all"
                                        >
                                            Follow
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {(activeSection === 'all' || activeSection === 'groups') && recommendedGroups.length > 0 && (
                    <section>
                        <SectionHeader title="Communities for You" count={recommendedGroups.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedGroups.slice(0, activeSection === 'all' ? 6 : 15).map(group => (
                                <div key={group.id} className="bg-[#242526] rounded-2xl border border-[#3E4042] flex overflow-hidden group hover:bg-[#2a2b2d] transition-colors shadow-lg">
                                    <div className="w-28 h-28 flex-shrink-0 cursor-pointer" onClick={() => onGroupClick(group)}>
                                        <img src={group.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                    </div>
                                    <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="font-bold text-[#E4E6EB] text-[17px] truncate group-hover:text-[#1877F2] transition-colors cursor-pointer" onClick={() => onGroupClick(group)}>{group.name}</h4>
                                        <p className="text-[#B0B3B8] text-xs font-bold mb-3">{group.members.length.toLocaleString()} members</p>
                                        <button 
                                            onClick={() => onJoinGroup(group.id)}
                                            className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] py-1.5 px-4 rounded-xl font-black text-xs w-fit transition-all active:scale-95"
                                        >
                                            Join Group
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {(activeSection === 'all' || activeSection === 'pages') && recommendedPages.length > 0 && (
                    <section>
                        <SectionHeader title="Top Pages & Brands" count={recommendedPages.length} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recommendedPages.slice(0, activeSection === 'all' ? 4 : 12).map(brand => (
                                <div key={brand.id} className="bg-[#242526] rounded-3xl border border-[#3E4042] p-5 shadow-lg group hover:shadow-2xl transition-all flex flex-col items-center text-center">
                                    <div className="relative mb-4 cursor-pointer" onClick={() => onBrandClick(brand.id)}>
                                        <img src={brand.profileImage} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#1877F2]/30 group-hover:border-[#1877F2] transition-colors" alt="" />
                                        {brand.isVerified && (
                                            <div className="absolute -bottom-1 -right-1 bg-[#1877F2] w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#242526]">
                                                <i className="fas fa-check text-white text-[10px]"></i>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-black text-[#E4E6EB] text-lg leading-tight mb-1 hover:underline cursor-pointer" onClick={() => onBrandClick(brand.id)}>{brand.name}</h4>
                                    <p className="text-[#1877F2] text-[11px] font-black uppercase tracking-widest mb-4">{brand.category}</p>
                                    <button 
                                        onClick={() => onFollowBrand(brand.id)}
                                        className="mt-auto w-full bg-[#3A3B3C] hover:bg-[#263951] hover:text-[#2D88FF] text-[#E4E6EB] py-2.5 rounded-2xl font-black text-xs transition-all border border-transparent hover:border-[#2D88FF]/30"
                                    >
                                        Like Page
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {recommendedPeople.length === 0 && recommendedGroups.length === 0 && recommendedPages.length === 0 && (
                    <div className="p-20 text-center bg-[#242526] rounded-3xl border border-[#3E4042]">
                        <div className="w-24 h-24 bg-[#18191A] rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-check-circle text-[#45BD62] text-5xl"></i>
                        </div>
                        <h3 className="text-2xl font-black text-[#E4E6EB] mb-2">You're All Caught Up!</h3>
                        <p className="text-[#B0B3B8] font-medium max-w-sm mx-auto">You've followed all suggested profiles and joined every active group in your area. Check back later for more.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
