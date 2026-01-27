
export interface User {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    profileImage: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    isOnline: boolean;
    followers: number[];
    following: number[];
    email?: string;
    password?: string;
    birthDate?: string;
    gender?: string;
    isVerified?: boolean;
    role?: 'admin' | 'moderator' | 'user';
    joinedDate?: string; 
    interests?: string[];
    work?: string;
    education?: string;
    nationality?: string;
    isMusician?: boolean;
}

export interface Comment {
    id: number;
    userId: number;
    text: string;
    timestamp: string;
    likes: number;
    replies?: Comment[];
}

export interface Post {
    id: number;
    authorId: number;
    content?: string;
    image?: string;
    video?: string;
    timestamp: string; 
    createdAt: number; 
    reactions: Reaction[]; 
    comments: Comment[];
    shares: number;
    views: number;
    type: 'text' | 'image' | 'video' | 'event' | 'product' | 'audio';
    visibility: 'Public' | 'Friends' | 'Only Me';
    location?: string;
    background?: string;
    category?: string;
    tags?: string[];
    audioTrack?: AudioTrack;
}

export interface GroupPost extends Post {
    groupId: string;
}

export interface Reaction {
    userId: number;
    type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
}

export type ReactionType = Reaction['type'];

export interface Story {
    id: number;
    userId: number;
    type: 'image' | 'text';
    image?: string;
    text?: string;
    background?: string;
    user?: User;
    createdAt: number;
    music?: { url: string; title: string; artist: string; cover?: string };
    reactions?: Reaction[];
}

export interface Reel {
    id: number;
    userId: number;
    videoUrl: string;
    caption: string;
    songName: string;
    audioUrl?: string;
    audioStart?: number;
    audioEnd?: number;
    reactions: Reaction[]; 
    comments: Comment[];
    shares: number;
    isCompressed?: boolean;
    effectName?: string;
}

export interface Notification {
    id: number;
    userId: number;
    senderId: number;
    type: string;
    content: string;
    postId?: number;
    timestamp: number;
    read: boolean;
}

export interface Product {
    id: number;
    title: string;
    mainPrice: number;
    images: string[];
    address: string;
    category?: string;
    country?: string;
    description?: string;
    sellerAvatar?: string;
    sellerName?: string;
    sellerId?: number;
    phoneNumber?: string;
    soldCount?: number;
    status?: string;
    quantity?: number;
    ratings?: any[];
    comments?: any[];
}

export interface Group {
    id: string;
    name: string;
    image: string;
    coverImage: string;
    members: number[];
    posts: GroupPost[];
    type: 'public' | 'private';
    adminId: number;
    createdDate: number;
    description: string;
    restrictedMembers?: number[];
    isReadOnly?: boolean;
    events?: Event[];
}

export interface Brand {
    id: number;
    name: string;
    followers: number[];
    profileImage: string;
    coverImage: string;
    isVerified: boolean;
    category?: string;
    description?: string;
    location?: string;
    adminId?: number;
    website?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    cover: string;
    uploaderId?: number;
    stats: { plays: number; downloads: number; shares: number; likes: number; reelsUse: number };
    album?: string;
    duration?: string;
    isLocal?: boolean;
}

export interface Episode {
    id: string;
    title: string;
    audioUrl: string;
    thumbnail: string;
    host?: string;
    stats: { plays: number; downloads: number; shares: number; likes: number; reelsUse: number };
    podcastId?: string;
    description?: string;
    date?: string;
    duration?: string;
    uploaderId?: number;
}

export interface AudioTrack {
    id: string;
    url: string;
    title: string;
    artist: string; 
    uploaderId?: number; 
    cover: string;
    type: 'music' | 'podcast';
    isVerified?: boolean; 
}

export interface Event {
    id: number;
    title: string;
    image: string;
    date: string;
    attendees: number[];
    interestedIds: number[];
    organizerId: number;
    description?: string;
    time?: string;
    location?: string;
}

export interface LocationData {
    name: string;
    flag: string;
}

export interface Album {
    id: string;
    title: string;
    artist: string;
    year: string;
    cover: string;
    songs: string[];
}

export interface Podcast {
    id: string;
    title: string;
    host: string;
    category: string;
    followers: number;
    description: string;
    cover: string;
}

export interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    type?: 'text' | 'group_invite';
    stickerUrl?: string;
    groupId?: string;
}

export interface LinkPreview {
    url: string;
    title: string;
    description: string;
    image: string;
}
