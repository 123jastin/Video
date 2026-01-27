
import { Post, User } from '../types';

/**
 * UNERA GROWTH-VELOCITY ENGINE
 * Focus: Anti-monopoly, Viral Discovery, Mutual Follower Strength
 */

const WEIGHTS = {
    SHARE: 10,
    COMMENT: 5,
    REACTION: 2,
    VIEW: 0.1,
    NEW_USER_BOOST: 1.5,
    MICRO_CREATOR_BOOST: 1.3,
    MONOPOLY_PENALTY: 0.7,
    LOCAL_BOOST: 1.4
};

export const calculatePostScore = (post: Post, viewer: User | null, author: User): number => {
    const now = Date.now();
    const ageHours = (now - (post.createdAt || now)) / 3600000;
    
    // 1. BASE ENGAGEMENT
    let engagementScore = 
        (post.shares * WEIGHTS.SHARE) + 
        (post.comments.length * WEIGHTS.COMMENT) + 
        (post.reactions.length * WEIGHTS.REACTION) + 
        ((post.views || 0) * WEIGHTS.VIEW);

    // 2. GROWTH MULTIPLIERS (Anti-Monopoly)
    let multiplier = 1.0;
    
    // New User Boost
    const isNew = (now - new Date(author.joinedDate || now).getTime()) < 2592000000; // 30 days
    if (isNew) multiplier *= WEIGHTS.NEW_USER_BOOST;

    // Small Account Boost vs Monopoly Penalty
    const followerCount = author.followers.length;
    if (followerCount < 500) multiplier *= WEIGHTS.MICRO_CREATOR_BOOST;
    else if (followerCount > 5000) multiplier *= WEIGHTS.MONOPOLY_PENALTY;

    // 3. LOGARITHMIC CLOUT (The equalizer)
    // Formula: log10(followers + 10)
    const cloutFactor = Math.log10(followerCount + 10);

    // 4. RELATIONSHIP (Mutual Follower is core to UNERA)
    let relationshipScore = 1.0;
    if (viewer && viewer.followers.includes(author.id)) {
        relationshipScore = 2.5; // High priority for mutuals
    }

    // 5. LOCAL RELEVANCE
    if (viewer?.location && author.location && viewer.location === author.location) {
        multiplier *= WEIGHTS.LOCAL_BOOST;
    }

    // 6. TIME DECAY (Exponential)
    const decay = Math.pow(ageHours + 2, 1.8);

    // Final Dynamic Visibility Score (DVS)
    return ((engagementScore * multiplier * relationshipScore * cloutFactor) / decay);
};

export const rankFeed = (posts: Post[], viewer: User | null, users: User[]): Post[] => {
    const userMap = new Map(users.map(u => [u.id, u]));
    
    return posts
        .map(post => {
            const author = userMap.get(post.authorId);
            return {
                post,
                score: author ? calculatePostScore(post, viewer, author) : 0
            };
        })
        .sort((a, b) => b.score - a.score)
        .map(item => item.post);
};
