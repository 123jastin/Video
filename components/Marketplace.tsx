
import React, { useState, useRef, useEffect } from 'react';
import { User, Product, Comment } from '../types';
import { MARKETPLACE_CATEGORIES } from '../constants';

// --- CURRENCY UTILITY ---
const getCurrencyFromAddress = (address: string) => {
    const addr = address.toLowerCase();
    if (addr.includes('tanzania')) return 'TSh';
    if (addr.includes('kenya')) return 'KSh';
    if (addr.includes('uganda')) return 'USh';
    if (addr.includes('south africa')) return 'R';
    if (addr.includes('nigeria')) return '₦';
    if (addr.includes('ghana')) return 'GH₵';
    if (addr.includes('ethiopia')) return 'Br';
    if (addr.includes('egypt')) return 'E£';
    if (addr.includes('united states') || addr.includes('america') || addr.includes('usa')) return '$';
    if (addr.includes('united kingdom') || addr.includes('britain') || addr.includes('london')) return '£';
    if (addr.includes('china')) return '¥';
    if (addr.includes('india')) return '₹';
    if (addr.includes('emirates') || addr.includes('dubai')) return 'AED';
    return '$'; // Fallback
};

// --- LOCATION SEARCH COMPONENT (OpenStreetMap Nominatim) ---
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
                    className="w-full bg-[#1a1a1a] p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-[#FF4747] text-sm pl-10" 
                    placeholder="Search city, region or country..." 
                    value={query} 
                    onChange={handleChange}
                    onFocus={() => setShowResults(true)}
                />
                <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                {loading && <i className="fas fa-spinner fa-spin absolute right-4 top-1/2 -translate-y-1/2 text-[#FF4747]"></i>}
            </div>
            {showResults && results.length > 0 && (
                <div className="absolute bottom-full md:top-full left-0 right-0 z-50 mb-2 md:mt-2 bg-[#242526] border border-[#333] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {results.map((res, i) => (
                        <div 
                            key={i} 
                            className="p-3 hover:bg-[#333] cursor-pointer text-white text-sm border-b border-[#333] last:border-0"
                            onClick={() => {
                                onSelect(res.display_name);
                                setQuery(res.display_name);
                                setShowResults(false);
                            }}
                        >
                            <i className="fas fa-location-dot mr-2 text-gray-500"></i>
                            {res.display_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- PRODUCT DETAIL MODAL ---
interface ProductDetailModalProps {
    product: Product;
    currentUser: User | null;
    onClose: () => void;
    onMessage: (sellerId: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, currentUser, onClose, onMessage }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const symbol = getCurrencyFromAddress(product.address);

    return (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-fade-in font-sans">
            <div className="bg-[#121212] w-full max-w-[900px] rounded-none md:rounded-2xl overflow-hidden flex flex-col md:flex-row h-full md:h-[90vh] shadow-2xl border border-[#222]">
                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-[#222] min-h-[300px]">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#111]">
                        <img src={product.images[activeImageIndex]} alt={product.title} className="w-full h-full object-contain" />
                        {product.images.length > 1 && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                                <button onClick={() => setActiveImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)} className="w-10 h-10 bg-black/30 rounded-full text-white pointer-events-auto hover:bg-black/50 transition-colors"><i className="fas fa-chevron-left"></i></button>
                                <button onClick={() => setActiveImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)} className="w-10 h-10 bg-black/30 rounded-full text-white pointer-events-auto hover:bg-black/50 transition-colors"><i className="fas fa-chevron-right"></i></button>
                            </div>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="h-20 flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide bg-[#1a1a1a]">
                            {product.images.map((img, idx) => (
                                <img key={idx} src={img} className={`h-14 w-14 object-cover rounded-lg border-2 transition-all cursor-pointer flex-shrink-0 ${activeImageIndex === idx ? 'border-[#FF4747]' : 'border-transparent'}`} onClick={() => setActiveImageIndex(idx)} alt="" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 flex flex-col bg-[#121212] overflow-hidden">
                    <div className="p-4 border-b border-[#222] flex justify-between items-center hidden md:flex">
                        <h2 className="text-white font-bold uppercase tracking-widest text-xs">Product Details</h2>
                        <i className="fas fa-times text-gray-400 cursor-pointer p-2 hover:bg-[#333] rounded-full" onClick={onClose}></i>
                    </div>
                    <div className="p-5 flex-1 overflow-y-auto space-y-5">
                        <div>
                            <p className="text-[#FF4747] text-3xl font-black">{symbol} {product.mainPrice.toLocaleString()}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-[#FFEB3B] text-black text-[10px] font-black px-1.5 py-0.5 rounded italic">Choice</span>
                                <span className="bg-[#FF4747] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Verified Listing</span>
                            </div>
                            <h1 className="text-xl font-bold text-white mt-4 leading-snug">{product.title}</h1>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                             <div className="flex items-center gap-1">
                                <i className="fas fa-star text-[#FFB400]"></i>
                                <span>4.9</span>
                             </div>
                             <span>{product.soldCount || '1.2k'} sold</span>
                        </div>

                        <div className="pt-4 border-t border-[#222]">
                            <div className="flex items-start gap-3 text-gray-300 text-sm mb-4">
                                <i className="fas fa-map-marker-alt text-[#FF4747] mt-1"></i>
                                <span className="flex-1 leading-tight">{product.address}</span>
                            </div>
                            <h3 className="text-white font-bold mb-2">Item Description</h3>
                            <p className="text-gray-400 text-[15px] whitespace-pre-wrap leading-relaxed">{product.description}</p>
                        </div>
                        
                        <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={product.sellerAvatar} className="w-10 h-10 rounded-full object-cover border border-[#333]" alt="" />
                                <div>
                                    <p className="text-white font-bold text-sm">{product.sellerName}</p>
                                    <p className="text-gray-500 text-[10px]">Active Local Seller</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-[#222] bg-[#1a1a1a] flex gap-2">
                        <button onClick={() => onMessage(product.sellerId)} className="flex-1 bg-[#222] hover:bg-[#333] text-white font-black py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                            <i className="fab fa-facebook-messenger"></i> Chat
                        </button>
                        <a 
                            href={`tel:${product.phoneNumber}`}
                            className="flex-[2] bg-gradient-to-r from-[#FF9000] to-[#FF4747] text-white font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition-all text-sm text-center flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-phone-alt"></i> Call Seller
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const MarketplacePage: React.FC<any> = ({ currentUser, products, onNavigateHome, onCreateProduct, onViewProduct }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSellModal, setShowSellModal] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [desc, setDesc] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) setImages(prev => [...prev, ev.target!.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSellSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || images.length === 0 || !address || !price || !phone) return alert("Please fill all required fields and add at least one image.");
        
        onCreateProduct({
            title, category, description: desc, address,
            mainPrice: parseFloat(price), quantity: 1, phoneNumber: phone, images,
            status: 'active', views: 0, ratings: [], comments: [], soldCount: 0,
            country: address.split(',').pop()?.trim() || 'Global'
        });
        setShowSellModal(false);
        setTitle(''); setDesc(''); setPrice(''); setAddress(''); setImages([]); setPhone('');
    };

    // Geographic filtering: prioritize local items
    const filteredProducts = products.filter((p: Product) => {
        const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        
        // Strict location filtering for Tanzania users
        if (currentUser?.nationality === 'Tanzania') {
            return matchesSearch && matchesCategory && (p.address.toLowerCase().includes('tanzania') || p.country === 'TZ');
        }
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full bg-black min-h-screen font-sans pb-24 animate-fade-in">
            {/* Header & Local Filters */}
            <div className="sticky top-14 z-40 bg-black/80 backdrop-blur-xl border-b border-[#1a1a1a] px-4 py-3">
                <div className="max-w-[1200px] mx-auto flex gap-3 items-center">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Find products in your city..." 
                            className="w-full bg-[#1a1a1a] border-none text-white rounded-full py-2.5 pl-10 pr-4 outline-none text-sm focus:ring-1 focus:ring-[#FF4747]" 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                        />
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                    </div>
                    {currentUser && (
                        <button onClick={() => setShowSellModal(true)} className="bg-[#FF4747] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform flex-shrink-0">
                            <i className="fas fa-plus text-sm"></i>
                        </button>
                    )}
                </div>
                <div className="max-w-[1200px] mx-auto mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {MARKETPLACE_CATEGORIES.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setSelectedCategory(c.id)}
                            className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${selectedCategory === c.id ? 'bg-[#FF4747] text-white' : 'bg-[#1a1a1a] text-gray-400'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
                {currentUser?.nationality === 'Tanzania' && (
                    <div className="max-w-[1200px] mx-auto mt-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#45BD62] animate-pulse"></div>
                        <span className="text-[11px] font-bold text-gray-500 tracking-wide uppercase">Local Tanzanian Feed Active</span>
                    </div>
                )}
            </div>

            {/* Marketplace Grid */}
            <div className="max-w-[1200px] mx-auto p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {filteredProducts.map((product: Product) => (
                        <div key={product.id} className="bg-[#121212] rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all group flex flex-col h-full border border-[#1a1a1a]" onClick={() => onViewProduct(product)}>
                            <div className="aspect-square relative overflow-hidden">
                                <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    <span className="bg-[#FFEB3B] text-black text-[8px] font-black px-1.5 py-0.5 rounded italic w-fit shadow-md uppercase">Choice</span>
                                </div>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <span className="text-[#FF4747] font-black text-lg">
                                    {getCurrencyFromAddress(product.address)} {product.mainPrice.toLocaleString()}
                                </span>
                                <h3 className="text-gray-200 font-bold text-[13px] line-clamp-2 leading-snug mt-1 mb-2 flex-1">{product.title}</h3>
                                
                                <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                        <i className="fas fa-star text-[#FFB400]"></i>
                                        <span>4.9</span>
                                        <span className="mx-0.5 opacity-30">|</span>
                                        <span>1k+ sold</span>
                                    </div>
                                </div>
                                <div className="mt-1.5 text-[9px] text-gray-500 font-bold flex items-center gap-1 opacity-80 uppercase tracking-tighter">
                                    <i className="fas fa-location-dot text-[#FF4747]"></i>
                                    <span className="truncate">{product.address.split(',')[0]}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-24 text-gray-600 px-6">
                        <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#222]">
                            <i className="fas fa-search-location text-3xl opacity-20"></i>
                        </div>
                        <p className="font-black text-white text-xl">No matches found locally</p>
                        <p className="text-sm mt-1">Try broadening your search or choosing a different category.</p>
                    </div>
                )}
            </div>

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-fade-in backdrop-blur-md">
                    <div className="bg-[#121212] w-full max-w-[600px] rounded-none md:rounded-3xl border border-[#222] shadow-2xl flex flex-col h-full md:h-auto md:max-h-[90vh]">
                        <div className="p-5 border-b border-[#222] flex justify-between items-center">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Sell Professional</h2>
                            <i className="fas fa-times text-gray-500 cursor-pointer hover:text-white transition-colors p-2" onClick={() => setShowSellModal(false)}></i>
                        </div>
                        <form onSubmit={handleSellSubmit} className="p-6 space-y-6 overflow-y-auto pb-10">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[#888] text-[10px] font-black uppercase tracking-widest mb-2">Product Gallery (4+ images recommended)</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="border-2 border-dashed border-[#333] rounded-2xl p-6 text-center cursor-pointer hover:bg-[#1a1a1a] transition-all group min-h-[160px] flex items-center justify-center"
                                    >
                                        {images.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2 w-full">
                                                {images.map((img, i) => (
                                                    <div key={i} className="relative aspect-square">
                                                        <img src={img} className="w-full h-full object-cover rounded-lg" alt="" />
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, idx) => idx !== i)); }}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px]"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="aspect-square bg-[#222] rounded-lg flex flex-col items-center justify-center text-white border border-[#444] border-dashed">
                                                    <i className="fas fa-plus text-lg"></i>
                                                    <span className="text-[8px] mt-1">Add</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#FF4747]/10 transition-colors">
                                                    <i className="fas fa-images text-xl text-gray-600 group-hover:text-[#FF4747]"></i>
                                                </div>
                                                <p className="text-white font-bold text-sm">Upload Product Images</p>
                                                <p className="text-gray-500 text-[10px] mt-1">High quality photos sell 5x faster</p>
                                            </div>
                                        )}
                                        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[#888] text-[10px] font-black uppercase mb-1.5 ml-1">Product Name</label>
                                        <input 
                                            className="w-full bg-[#1a1a1a] p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-[#FF4747] text-sm" 
                                            placeholder="What are you selling today?" 
                                            value={title} 
                                            onChange={e => setTitle(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[#888] text-[10px] font-black uppercase mb-1.5 ml-1">Price (Automatic Currency)</label>
                                            <input 
                                                className="w-full bg-[#1a1a1a] p-4 rounded-xl text-white outline-none text-sm" 
                                                placeholder="Enter amount" 
                                                type="number" 
                                                value={price} 
                                                onChange={e => setPrice(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[#888] text-[10px] font-black uppercase mb-1.5 ml-1">Category</label>
                                            <select className="w-full bg-[#1a1a1a] p-4 rounded-xl text-white outline-none text-sm appearance-none border-none" value={category} onChange={e => setCategory(e.target.value)} required>
                                                <option value="">Select Category</option>
                                                {MARKETPLACE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[#888] text-[10px] font-black uppercase mb-1.5 ml-1">Full Description</label>
                                        <textarea 
                                            className="w-full bg-[#1a1a1a] p-4 rounded-xl text-white outline-none h-32 resize-none text-sm leading-relaxed" 
                                            placeholder="Condition, specs, reason for selling..." 
                                            value={desc} 
                                            onChange={e => setDesc(e.target.value)} 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[#888] text-[10px] font-black uppercase mb-1.5 ml-1">Location Search (City, Country)</label>
                                        <LocationSearch value={address} onSelect={setAddress} />
                                        {address && <div className="mt-1.5 flex items-center gap-1.5 ml-1"><i className="fas fa-coins text-[#FFB400] text-xs"></i><span className="text-[11px] text-[#45BD62] font-black uppercase tracking-widest">Detected Currency: {getCurrencyFromAddress(address)}</span></div>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[#888] text-[10px] font-black uppercase mb-1.5 ml-1">Contact Number</label>
                                        <div className="relative">
                                            <input 
                                                className="w-full bg-[#1a1a1a] p-4 rounded-xl text-white outline-none text-sm pl-10" 
                                                placeholder="e.g. +255 700 000 000" 
                                                value={phone} 
                                                onChange={e => setPhone(e.target.value)} 
                                                required 
                                            />
                                            <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-[#FF9000] to-[#FF4747] text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all uppercase tracking-tighter"
                                >
                                    Publish Globally
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
