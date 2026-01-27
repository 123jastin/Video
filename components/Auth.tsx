
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '../types';

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
                    className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2.5 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#1877F2]" 
                    placeholder="Search city or country..." 
                    value={query} 
                    onChange={handleChange}
                    onFocus={() => setShowResults(true)}
                    required
                />
                {loading && <i className="fas fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-[#1877F2]"></i>}
            </div>
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-[60] mt-1 bg-[#242526] border border-[#3E4042] rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
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

// --- PASSWORD RESTORATION FLOW ---
export const RestorePassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'sent' | 'reset'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');

    const handleSendLink = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('sent');
        }, 1500);
    };

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            alert("Password has been restored successfully!");
            onBack();
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#18191A] flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#242526] p-8 rounded-3xl shadow-2xl w-full max-w-[448px] border border-[#3E4042] text-center">
                {step === 'email' && (
                    <>
                        <div className="w-20 h-20 bg-[#1877F2]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-lock-open text-3xl text-[#1877F2]"></i>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Restore Password</h2>
                        <p className="text-[#B0B3B8] mb-6">Enter your registered email and we'll send you a professional link to reset your access.</p>
                        <form onSubmit={handleSendLink} className="space-y-4 text-left">
                            <input type="email" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#1877F2]" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
                            <button type="submit" disabled={isLoading} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-3.5 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Send Restoration Link'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'sent' && (
                    <>
                        <div className="w-20 h-20 bg-[#45BD62]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-paper-plane text-3xl text-[#45BD62]"></i>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Link Sent!</h2>
                        <p className="text-[#B0B3B8] mb-8">We've sent a professional restoration link to <span className="text-white font-bold">{email}</span>. Click the button below to simulate receiving the email.</p>
                        <button onClick={() => setStep('reset')} className="w-full bg-[#3A3B3C] text-white py-3.5 rounded-xl font-bold mb-4">Open Received Link</button>
                    </>
                )}

                {step === 'reset' && (
                    <>
                        <h2 className="text-2xl font-black text-white mb-6">Reset Your Password</h2>
                        <form onSubmit={handleReset} className="space-y-4 text-left">
                            <input type="password" minLength={6} className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#1877F2]" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required />
                            <input type="password" minLength={6} className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#1877F2]" placeholder="Confirm New Password" required />
                            <button type="submit" className="w-full bg-[#1877F2] text-white py-3.5 rounded-xl font-black text-lg">Update Password</button>
                        </form>
                    </>
                )}

                <button onClick={onBack} className="mt-6 text-[#1877F2] font-bold hover:underline">Back to Login</button>
            </div>
        </div>
    );
};

interface AuthProps {
    onLogin: (email: string, pass: string) => void;
    onRegister: (newUser: Partial<User>) => void;
    onClose: () => void;
    loginError: string;
}

export const AuthContainer: React.FC<AuthProps> = ({ onLogin, onRegister, onClose, loginError }) => {
    const [view, setView] = useState<'login' | 'register' | 'restore'>('login');
    const { t, language, setLanguage } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (view === 'restore') return <RestorePassword onBack={() => setView('login')} />;
    if (view === 'register') return <Register onRegister={onRegister} onBackToLogin={() => setView('login')} />;

    return (
        <div className="min-h-screen bg-[#18191A] flex flex-col justify-center p-4 animate-fade-in">
            <div className="max-w-[1000px] w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
                <div className="text-center lg:text-left max-w-[500px]">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                        <i className="fas fa-globe-americas text-[#1877F2] text-[50px] animate-[spin_10s_linear_infinite]"></i>
                        <h1 className="text-[50px] font-black text-[#1877F2] tracking-tighter">UNERA</h1>
                    </div>
                    <p className="text-[28px] text-[#E4E6EB] font-medium leading-tight">{t('tagline')}</p>
                </div>
                
                <div className="bg-[#242526] p-5 rounded-2xl shadow-2xl w-full max-w-[400px] border border-[#3E4042]">
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="flex flex-col gap-4">
                        {loginError && <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-xl text-center font-bold text-sm">{loginError}</div>}
                        <input type="email" placeholder="Email address" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#1877F2]" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#1877F2]" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit" className="bg-[#1877F2] text-white font-black text-[20px] py-3 rounded-xl hover:bg-[#166FE5] transition-all">Log In</button>
                    </form>
                    <div className="text-center mt-4">
                        <button onClick={() => setView('restore')} className="text-[#1877F2] text-sm font-bold hover:underline">Forgotten password?</button>
                    </div>
                    <hr className="my-5 border-[#3E4042]" />
                    <button onClick={() => setView('register')} className="bg-[#42B72A] hover:bg-[#36A420] text-white font-black text-[17px] px-8 py-3 rounded-xl mx-auto block transition-all shadow-lg active:scale-95">Create new account</button>
                </div>
            </div>
        </div>
    );
};

export const Register: React.FC<{ onRegister: any, onBackToLogin: any }> = ({ onRegister, onBackToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Female');
    
    const [day, setDay] = useState(new Date().getDate());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear() - 20);

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onRegister({ 
            name: `${firstName} ${surname}`, firstName, lastName: surname, email, password, location, gender,
            birthDate: `${year}-${month}-${day}`, profileImage: `https://ui-avatars.com/api/?name=${firstName}+${surname}&background=random`, 
            followers: [], following: [], isOnline: true, joinedDate: new Date().toISOString()
        }); 
    };

    return (
        <div className="min-h-screen bg-[#18191A] flex flex-col items-center justify-center p-4 animate-fade-in">
            <h1 className="text-[50px] font-black text-[#1877F2] mb-8 tracking-tighter">UNERA</h1>
            <div className="bg-[#242526] p-6 rounded-2xl shadow-2xl w-full max-w-[448px] border border-[#3E4042]">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-black text-white">Create Account</h2>
                    <p className="text-[#B0B3B8]">Join our professional community today.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-3">
                        <input type="text" placeholder="First name" className="w-1/2 bg-[#3A3B3C] border border-[#3E4042] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#1877F2]" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        <input type="text" placeholder="Surname" className="w-1/2 bg-[#3A3B3C] border border-[#3E4042] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#1877F2]" value={surname} onChange={e => setSurname(e.target.value)} required />
                    </div>
                    <LocationSearch value={location} onSelect={setLocation} />
                    <input type="email" placeholder="Email address" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg px-4 py-3 text-white outline-none focus:border-[#1877F2]" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="New password (min 6 chars)" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg px-4 py-3 text-white outline-none focus:border-[#1877F2]" value={password} onChange={e => setPassword(e.target.value)} required />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`border border-[#3E4042] rounded-xl p-3 flex justify-between items-center cursor-pointer transition-colors ${gender === 'Female' ? 'bg-[#1877F2]/10 border-[#1877F2]' : 'bg-[#3A3B3C]'}`} onClick={() => setGender('Female')}>
                            <span className="text-white font-bold">Female</span>
                            <input type="radio" name="gender" checked={gender === 'Female'} readOnly />
                        </label>
                        <label className={`border border-[#3E4042] rounded-xl p-3 flex justify-between items-center cursor-pointer transition-colors ${gender === 'Male' ? 'bg-[#1877F2]/10 border-[#1877F2]' : 'bg-[#3A3B3C]'}`} onClick={() => setGender('Male')}>
                            <span className="text-white font-bold">Male</span>
                            <input type="radio" name="gender" checked={gender === 'Male'} readOnly />
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-[#42B72A] hover:bg-[#36A420] text-white py-3.5 rounded-xl font-black text-xl shadow-lg active:scale-95 transition-all">Sign Up</button>
                    <button type="button" onClick={onBackToLogin} className="text-[#1877F2] font-bold hover:underline w-full text-center">Already have an account?</button>
                </form>
            </div>
        </div>
    );
};
