// app.js - Final Working React App for CDN Environment (Day 20: Project Conclusion)

// --- THEME CONFIGURATION (unchanged) ---
const THEME_CONFIG = {
  name: 'light',
  colors: {
    primary: '#1A237E', // Deep Navy Blue
    secondary: '#4FC3F7', // Electric Blue
    success: '#69F0AE', // Verified Green
    textOnPrimary: 'white',
    textOnSecondary: '#1A237E', 
    neutralBg: 'white',
    border: '#e5e7eb', // gray-200
  }
};

const DARK_THEME_CONFIG = {
  name: 'dark',
  colors: {
    primary: '#BBDEFB', // Light Blue for contrast
    secondary: '#00B0FF', // Sky Blue
    success: '#69F0AE',
    textOnPrimary: '#1A237E', 
    textOnSecondary: '#1A237E',
    neutralBg: '#212121', // Dark Gray background
    border: '#424242', // Darker border
  }
};

// --- Theme Context Setup (unchanged) ---
const ThemeContext = React.createContext(THEME_CONFIG.colors);
const useTheme = () => React.useContext(ThemeContext);


// --- MOCK API DATA (unchanged) ---
const MOCK_PROFILE_DATA_BASE = {
  name: "Jane Doe (React Dev)",
  title: "Senior Software Architect",
  memberSince: "July 2024",
  lastVetted: "2025-10-21",
};

const MOCK_INITIAL_CLAIMS = [
    { id: 1, text: "Certified AWS Solutions Architect (2023)", status: "VERIFIED" },
    { id: 2, text: "Led Microservices Migration Project (3 years experience)", status: "PENDING" },
    { id: 3, text: "Contributed to Linux Kernel (2022)", status: "REJECTED" },
];

const MOCK_SEARCH_RESULTS = [
    { id: 101, name: "Michael Johnson", title: "DevOps Engineer", score: 9.6, skills: ["Kubernetes", "Terraform", "AWS"], verificationSource: "CNCF" },
    { id: 102, name: "Sarah Chen", title: "Senior Data Scientist", score: 8.9, skills: ["Python", "TensorFlow", "Spark"], verificationSource: "Project A-Z" },
    { id: 103, name: "Alex Vlasov", title: "Cybersecurity Analyst", score: 8.5, skills: ["CISSP", "Penetration Testing", "SIEM"], verificationSource: "ISC²" },
];

const MOCK_API_KEYS = [
    { id: 1, name: "Recruiter Search API", key: "tt-rec-ab1c-d2e3-f4g5", active: true, usage: 1240, limit: 5000 },
    { id: 2, name: "Automated Vetting Hook", key: "tt-vet-h6i7-j8k9-l0m1", active: false, usage: 0, limit: 10000 },
];

// --- ROADMAP DATA (Day 20) ---
const PROJECT_MODULES = [
    { id: 'm1', name: 'M1: Professional & Recruiter UX', status: 'Complete', date: 'Day 10', description: 'Built the core profile and search dashboards.' },
    { id: 'm2', name: 'M2: Centralized State & Auth', status: 'Complete', date: 'Day 15', description: 'Implemented the global state management system and user authentication.' },
    { id: 'm3', name: 'M3: AI & Verification Loop', status: 'Complete', date: 'Day 18', description: 'Established claim submission, verifier console, and score updates.' },
    { id: 'm4', name: 'M4: Enterprise API Service', status: 'Complete', date: 'Day 19', description: 'Mocked the API Key Management dashboard for enterprise integration.' },
];


// ====================================================================
// 1. Header Component (Updated for new nav item)
// ====================================================================

const Header = ({ currentView, setView, toggleTheme, themeMode }) => {
  const { primary, secondary, textOnPrimary } = useTheme(); 
  const isLoggedIn = currentView !== 'login' && currentView !== 'roadmap'; 
  const isVerifier = currentView === 'verifier';
  const isRecruiter = currentView === 'recruiter' || currentView === 'api'; 

  const handleLogout = () => {
    localStorage.clear(); 
    setView('login');
  };

  return (
    <header className={`bg-[${primary}] text-[${textOnPrimary}] shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wider">TechTrust</div>
        <nav className="space-x-6 hidden sm:flex">
          {/* 🚨 Day 20: New Roadmap link */}
          <a href="#" onClick={() => setView('roadmap')} className="font-medium hover:text-blue-300 transition-colors">Roadmap</a>
          
          {isLoggedIn && (
            <>
              <a href="#" onClick={() => setView('profile')} className="font-medium hover:text-blue-300 transition-colors">Profile</a>
              <a href="#" onClick={() => setView('recruiter')} className="font-medium hover:text-blue-300 transition-colors">Job Board</a>
              
              {isVerifier && 
                <a href="#" onClick={() => setView('verifier')} className="font-medium text-yellow-300 hover:text-yellow-100 transition-colors">Verifier Console</a>
              }
              {isRecruiter &&
                <a href="#" onClick={() => setView('api')} className="font-medium text-purple-300 hover:text-purple-100 transition-colors">API Management</a>
              }
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-white hover:text-blue-300 transition-colors p-2 rounded-full hover:bg-white/10" title="Toggle Theme">
                {themeMode === 'light' ? '🌙' : '☀️'}
            </button>
            <button 
                onClick={() => isLoggedIn ? handleLogout() : setView('login')} 
                className={`font-semibold px-4 py-1.5 rounded-full transition-colors text-sm 
                            ${isLoggedIn ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : `bg-[${secondary}] text-[${primary}] hover:bg-blue-300`}`}
            >
                {isLoggedIn ? 'Logout' : 'Sign In'}
            </button>
        </div>
      </div>
    </header>
  );
};

// ====================================================================
// 2. Authentication View (unchanged)
// ====================================================================

const AuthView = ({ setView }) => {
  const { primary, secondary, textOnSecondary, neutralBg } = useTheme(); 
  const [isLogin, setIsLogin] = React.useState(true);
  
  const [userType, setUserType] = React.useState('professional');

  const handleAuth = (e, type) => {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.email || !data.password) {
        alert('Please fill in required fields.');
        return;
    }

    const finalUserType = isLogin ? userType : (data.user_type || 'professional');
    
    localStorage.setItem('techtust_user_type', finalUserType); 
    localStorage.setItem('techtust_token', 'mock-jwt-token');

    if (type === 'register') {
        alert(`Registration successful! Account type: ${finalUserType}. Please log in.`);
        setIsLogin(true); 
        return;
    }

    alert(`Login successful as a ${finalUserType}!`);

    // Route to correct view
    if (finalUserType === 'recruiter') {
      setView('recruiter');
    } else if (finalUserType === 'verifier') {
      setView('verifier');
    } else {
      setView('profile');
    }
  };

  return (
    <div className={`w-full max-w-lg bg-[${neutralBg}] p-8 rounded-lg shadow-xl border border-gray-200`}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-lg font-semibold border-b-2 transition-colors ${isLogin ? `text-[${primary}] border-[${primary}]` : 'text-gray-500 border-transparent'}`}>
          Log In
        </button>
        <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-lg font-semibold border-b-2 transition-colors ${!isLogin ? `text-[${primary}] border-[${primary}]` : 'text-gray-500 border-transparent'}`}>
          Register
        </button>
      </div>

      <form onSubmit={(e) => handleAuth(e, isLogin ? 'login' : 'register')} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {!isLogin && (
            <input type="hidden" name="user_type" value="professional" /> 
        )}

        {isLogin && (
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Log In As</label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input type="radio" name="login_type" value="professional" checked={userType === 'professional'} onChange={() => setUserType('professional')} className={`form-radio text-[${primary}] focus:ring-[${secondary}]`} />
                        <span className="ml-2 text-gray-700">Tech Professional</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" name="login_type" value="recruiter" checked={userType === 'recruiter'} onChange={() => setUserType('recruiter')} className={`form-radio text-[${primary}] focus:ring-[${secondary}]`} />
                        <span className="ml-2 text-gray-700">Recruiter</span>
                    </label>
                     <label className="inline-flex items-center">
                        <input type="radio" name="login_type" value="verifier" checked={userType === 'verifier'} onChange={() => setUserType('verifier')} className={`form-radio text-[${primary}] focus:ring-[${secondary}]`} />
                        <span className="ml-2 text-gray-700">Verifier</span>
                    </label>
                </div>
            </div>
        )}
        
        <div>
          <label htmlFor={`${isLogin ? 'login' : 'register'}-email`} className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id={`${isLogin ? 'login' : 'register'}-email`} name="email" className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[${secondary}] focus:border-[${secondary}]`} required />
        </div>
        
        <div>
          <label htmlFor={`${isLogin ? 'login' : 'register'}-password`} className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id={`${isLogin ? 'login' : 'register'}-password`} name="password" className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[${secondary}] focus:border-[${secondary}]`} required />
        </div>
        
        {!isLogin && (
             <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" name="user_type" value="professional" defaultChecked className={`form-radio text-[${primary}] focus:ring-[${secondary}]`} />
                <span className="ml-2 text-gray-700">Tech Professional (Default)</span>
              </label>
            </div>
        )}

        <button type="submit" className={`w-full py-2 rounded-md font-semibold transition-colors 
            ${isLogin 
                ? `bg-[${primary}] text-white hover:bg-indigo-900` 
                : `bg-[${secondary}] text-[${textOnSecondary}] hover:bg-blue-300`}`}
        >
          {isLogin ? 'Log In' : 'Register Account'}
        </button>
      </form>
    </div>
  );
};

// ====================================================================
// 3. Add Claim Modal (unchanged)
// ====================================================================

const AddClaimModal = ({ isOpen, onClose, onClaimSubmitted }) => {
    const { primary, secondary, neutralBg } = useTheme(); 
    if (!isOpen) return null; 
    
    const [isLoading, setIsLoading] = React.useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);

        const form = e.target.closest('form');
        const formData = new FormData(form);
        const title = formData.get('claim-title');
        
        try {
            // Mock API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const isMockSuccess = Math.random() > 0.1;

            if (isMockSuccess) {
                onClaimSubmitted(title); 

                alert("✅ Claim Submitted! It is now PENDING verification by M3's AI.");
                
            } else {
                throw new Error("API Error: Claim too vague or failed initial validation.");
            }

        } catch (error) {
            console.error('Claim submission failed:', error.message);
            alert(`❌ Submission Failed: ${error.message}`);
        } finally {
            setIsLoading(false);
            onClose(); 
        }
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            
            {/* Modal Content */}
            <div className={`bg-[${neutralBg}] rounded-lg shadow-2xl w-full max-w-xl p-6 relative`}>
                <h2 className={`text-2xl font-bold text-[${primary}] mb-4 border-b pb-2`}>Submit New Verifiable Claim</h2>
                
                {/* Close Button */}
                <button onClick={onClose} 
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label htmlFor="claim-title" className="block text-sm font-medium text-gray-700">Claim Title / Certification Name</label>
                        <input type="text" id="claim-title" name="claim-title" required 
                            disabled={isLoading}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[${secondary}] focus:border-[${secondary}] disabled:opacity-50`}
                            placeholder="e.g., Certified Kubernetes Administrator"
                        />
                    </div>

                    <div>
                        <label htmlFor="claim-details" className="block text-sm font-medium text-gray-700">Detailed Description / Proof (URL or Text)</label>
                        <textarea id="claim-details" name="claim-details" rows="4" required 
                            disabled={isLoading}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[${secondary}] focus:border-[${secondary}] disabled:opacity-50`}
                            placeholder="Provide link to certificate, GitHub repo, or detailed project summary (Max 500 chars for AI vetting)"
                        ></textarea>
                    </div>

                    <p className="text-sm text-gray-500 italic pt-2">
                        Note: Submitting this claim initiates an AI-powered verification process which will update your Trust Score.
                    </p>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} 
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button type="submit" 
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white bg-[${primary}] rounded-md hover:bg-indigo-900 transition-colors disabled:opacity-50`}
                        >
                            {isLoading ? 'Submitting...' : 'Submit for Verification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ====================================================================
// 4. Profile View (unchanged from Day 18)
// ====================================================================

const ProfileView = ({ claims, trustScore, newlyVerifiedId, onClaimSubmitted, onClaimAction, onAlertDismissed }) => {
  const { primary, secondary, success, neutralBg } = useTheme(); 
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false); 
  
  // State for the temporary success alert
  const [showAlert, setShowAlert] = React.useState(false);
  const newlyVerifiedClaim = claims.find(c => c.id === newlyVerifiedId);


  // Fetch static profile data (name, etc.) once
  React.useEffect(() => {
    const fetchProfileData = () => {
      setLoading(true);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(MOCK_PROFILE_DATA_BASE); 
        }, 1000); 
      });
    };

    fetchProfileData().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);
  
  // Show alert when a claim is verified
  React.useEffect(() => {
      if (newlyVerifiedId && newlyVerifiedClaim) {
          setShowAlert(true);
          // Auto-dismiss the alert after 8 seconds
          const timer = setTimeout(() => {
              handleDismiss();
          }, 8000); 
          return () => clearTimeout(timer);
      }
  }, [newlyVerifiedId]);


  const handleDeleteClaim = (claimId) => {
    if (window.confirm("Are you sure you want to delete this claim? This action cannot be undone.")) {
      onClaimAction(claimId); // Call the centralized removeClaim function
      alert('Claim successfully deleted.');
    }
  };
  
  const handleDismiss = () => {
      setShowAlert(false);
      onAlertDismissed(); // Call the central function to clear the ID
  };


  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-600">Loading Profile Data...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-xl text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      
      {/* Verification Success Alert (Conditional) */}
      {showAlert && newlyVerifiedClaim && (
          <div className="lg:col-span-3 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex justify-between items-center mb-4">
              <div className='flex items-center space-x-3'>
                <span className="text-2xl">🎉</span>
                <p className="font-bold">
                    Claim Verified! 
                    <span className="font-normal block text-sm">"{newlyVerifiedClaim.text}" was successfully verified. Your Trust Score has been updated!</span>
                </p>
              </div>
              <button onClick={handleDismiss} className="text-green-700 hover:text-green-900 font-bold text-lg">
                  &times;
              </button>
          </div>
      )}

      {/* LEFT COLUMN */}
      <div className="lg:col-span-1 space-y-6">
        <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border-t-4 border-[${success}]`}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Verification Status</h3>
          <div className="text-center">
            {/* Dynamic Trust Score */}
            <p className={`text-6xl font-extrabold text-[${primary}]`}>{trustScore.toFixed(1)}</p>
            <p className={`text-lg font-semibold text-[${success}] mt-1`}>AI Trust Score</p>
            <p className="text-sm text-gray-500 mt-2">Last Vetted: {profile.lastVetted}</p>
          </div>
          <button className={`mt-6 w-full bg-[${secondary}] text-[${primary}] py-2 rounded-md font-semibold hover:bg-blue-300 transition-colors`}>
            Submit Claims for AI Vetting
          </button>
        </div>
        
        <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border border-gray-200`}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Details</h3>
          <p className="text-gray-700"><span className="font-semibold">Name:</span> {profile.name}</p>
          <p className="text-gray-700 mt-1"><span className="font-semibold">Title:</span> {profile.title}</p>
          <p className="text-gray-700 mt-1"><span className="font-semibold">Member Since:</span> {profile.memberSince}</p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-2 space-y-6">
        <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border border-gray-200`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Verifiable Claims</h3>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className={`text-sm text-[${primary}] font-medium hover:text-[${secondary}]`}
                >
                    + Add New Claim
                </button>
            </div>
          
          {claims.map(claim => (
            <div key={claim.id} className="border-b py-3 flex justify-between items-start last:border-b-0">
              {/* Left side: Text and Status */}
              <div className="flex-grow pr-4"> 
                <p className="font-semibold text-lg text-gray-700">{claim.text}</p>
                {/* Status Tag */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block 
                  ${claim.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 
                    claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {claim.status}
                </span>
              </div>
              
              {/* Right side: Action Buttons */}
              <div className="flex space-x-3 text-sm pt-1">
                <button 
                  onClick={() => alert(`Editing Claim ID ${claim.id}: Functionality mocked.`)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit Claim"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClaim(claim.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete Claim"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AddClaimModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onClaimSubmitted={onClaimSubmitted}
      />
    </div>
  );
};

// ====================================================================
// 5. Recruiter View (unchanged)
// ====================================================================

const RecruiterView = () => {
    const { primary, secondary, success, neutralBg } = useTheme(); 
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState(MOCK_SEARCH_RESULTS);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            alert('Please enter a search term.');
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            const query = searchQuery.toLowerCase();
            const results = MOCK_SEARCH_RESULTS.filter(candidate => 
                candidate.title.toLowerCase().includes(query) || 
                candidate.skills.some(skill => skill.toLowerCase().includes(query))
            );

            if (results.length === 0) {
                setSearchResults(MOCK_SEARCH_RESULTS);
                alert(`No perfect matches found for "${searchQuery}". Showing featured candidates instead.`);
            } else {
                setSearchResults(results);
            }

        } catch (error) {
            console.error('Search failed:', error);
            alert('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h1 className={`text-3xl font-bold text-[${primary}] mb-6`}>Recruiter Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT COLUMN: Metrics & Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    
                    <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border-t-4 border-[${secondary}]`}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <button className={`w-full bg-[${secondary}] text-[${primary}] py-2 rounded-md font-semibold hover:bg-blue-300 transition-colors mb-3`}>
                            + Post New Job
                        </button>
                        <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors">
                            View My Postings (5)
                        </button>
                    </div>

                    <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border border-gray-200`}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Account Metrics</h3>
                        <div className="space-y-3">
                            <p className="flex justify-between text-gray-700"><span className="font-semibold">Vetted Candidates Saved:</span> <span className={`text-[${primary}] font-bold`}>12</span></p>
                            <p className="flex justify-between text-gray-700"><span className="font-semibold">Verification Searches Today:</span> <span className={`text-[${primary}] font-bold`}>4</span></p>
                            <p className="flex justify-between text-gray-700"><span className="font-semibold">API Search Limit:</span> <span className="text-green-600 font-bold">100 / Day</span></p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Search & Results */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className={`bg-[${neutralBg}] p-4 rounded-lg shadow-xl border border-gray-200 flex items-center space-x-3`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search for professionals by skill, role, or certification (e.g., 'Kubernetes' or 'Data Scientist')..." 
                            className="flex-grow border-none focus:ring-0 text-lg py-1.5"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={isLoading}
                        />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`bg-[${primary}] text-white px-5 py-2 rounded-md font-semibold transition-colors disabled:opacity-50 hover:bg-indigo-900`}
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {/* Dynamic Results List */}
                    <div className={`bg-[${neutralBg}] rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-200`}>
                        <h3 className="text-xl font-bold text-gray-800 p-4 border-b">
                            Search Results ({searchResults.length})
                        </h3>

                        {isLoading && (
                            <div className="p-4 text-center text-gray-500">
                                Fetching candidates...
                            </div>
                        )}

                        {!isLoading && searchResults.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No candidates matched your search criteria. Try "Kubernetes" or "Data Scientist".
                            </div>
                        )}

                        {!isLoading && searchResults.map(candidate => (
                            <div key={candidate.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className={`text-xl font-semibold text-[${primary}]`}>{candidate.name}</p>
                                        
                                        <div className="mt-1 flex items-center space-x-3">
                                            <p className="text-gray-600">{candidate.title}</p>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block bg-indigo-100 text-indigo-800`}>
                                                Verified by: {candidate.verificationSource}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-sm space-x-3">
                                            {candidate.skills.map(skill => (
                                                <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-4xl font-extrabold text-[${success}]`}>{candidate.score.toFixed(1)}</p>
                                        <p className="text-sm text-gray-500">Trust Score</p>
                                        <button className={`mt-2 text-sm text-[${secondary}] hover:text-blue-300 font-medium`}>View Profile</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// 6. Verifier View (unchanged)
// ====================================================================

const VerifierView = ({ allClaims, updateClaimStatus }) => {
    const { primary, success, secondary, neutralBg } = useTheme();
    
    // Calculate the queue by filtering the global claims list
    const queue = allClaims.filter(c => c.status === 'PENDING');

    const handleVerification = (claimId, result) => {
        const newStatus = result === 'approve' ? 'VERIFIED' : 'REJECTED';
        const shouldUpdateScore = newStatus === 'VERIFIED'; // Only update score on approval
        
        updateClaimStatus(claimId, newStatus, shouldUpdateScore); 

        if (newStatus === 'VERIFIED') {
            alert(`✅ Claim ${claimId} Approved! Trust Score updated for claimant.`);
        } else {
            alert(`❌ Claim ${claimId} Rejected! Claimant will be notified.`);
        }
    };

    return (
        <div className="w-full max-w-4xl">
            <h1 className={`text-3xl font-bold text-[${primary}] mb-6`}>M3: AI Vetting Console</h1>
            <p className="text-lg text-gray-600 mb-8">Review claims flagged for human oversight after initial AI processing. ({queue.length} claims pending)</p>

            {queue.length === 0 ? (
                <div className={`p-8 text-center border-4 border-dashed border-green-300 rounded-lg bg-green-50`}>
                    <p className="text-2xl font-semibold text-green-700">All caught up! The verification queue is currently empty.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {queue.map(claim => (
                        <div key={claim.id} className={`bg-[${neutralBg}] p-6 rounded-lg shadow-lg border-l-4 border-yellow-500`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">CLAIM ID: {claim.id}</p>
                                    <p className={`text-xl font-bold text-gray-800 mt-1`}>{claim.text}</p>
                                    <p className="text-gray-600 mt-1">Claimant: <span className="font-semibold text-[${primary}]">Jane Doe</span></p>
                                </div>
                                <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-3 py-1 rounded-full">PENDING REVIEW</span>
                            </div>
                            
                            <p className="text-sm text-gray-700 mt-2">Proof/Details: *Details sent to AI for review*</p>

                            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleVerification(claim.id, 'reject')}
                                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    Reject Claim
                                </button>
                                <button
                                    onClick={() => handleVerification(claim.id, 'approve')}
                                    className={`px-4 py-2 text-sm font-medium text-white bg-[${success}] rounded-md hover:bg-green-600 transition-colors`}
                                >
                                    Approve & Verify
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ====================================================================
// 7. Enterprise API View (unchanged)
// ====================================================================
const EnterpriseAPIView = () => {
    const { primary, secondary, neutralBg } = useTheme(); 
    const [apiKeys, setApiKeys] = React.useState(MOCK_API_KEYS);
    
    const toggleKeyStatus = (keyId) => {
        setApiKeys(prevKeys => prevKeys.map(key => 
            key.id === keyId ? { ...key, active: !key.active } : key
        ));
    };
    
    const generateNewKey = () => {
        alert('New API Key Generated! (Mock Functionality)');
        const newKey = {
            id: Date.now(),
            name: "New Custom Integration Key",
            key: "tt-new-" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6),
            active: true,
            usage: 0,
            limit: 1000,
        };
        setApiKeys(prevKeys => [...prevKeys, newKey]);
    };

    return (
        <div className="w-full max-w-6xl">
            <h1 className={`text-3xl font-bold text-[${primary}] mb-6`}>M4: Enterprise API Management</h1>
            <p className="text-lg text-gray-600 mb-8">Manage API keys and integration limits for seamless access to the TechTrust Verification and Search services.</p>

            <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border border-gray-200`}>
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Your Active API Keys</h3>
                    <button 
                        onClick={generateNewKey}
                        className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors`}
                    >
                        + Generate New Key
                    </button>
                </div>
                
                <div className="space-y-4">
                    {apiKeys.map(key => (
                        <div key={key.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1 min-w-0 pr-4">
                                <p className="text-lg font-semibold text-gray-800">{key.name}</p>
                                <div className="flex items-center space-x-3 mt-1">
                                    <code className={`text-sm font-mono p-1 rounded ${key.active ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                                        {key.key}
                                    </code>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${key.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {key.active ? 'Active' : 'Revoked'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-sm text-right w-40">
                                <p className="font-semibold text-gray-700">{key.usage} / {key.limit}</p>
                                <p className="text-gray-500">Requests Used</p>
                            </div>
                            
                            <button
                                onClick={() => toggleKeyStatus(key.id)}
                                className={`ml-6 px-4 py-2 text-sm font-medium rounded-md transition-colors 
                                    ${key.active ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                            >
                                {key.active ? 'Revoke' : 'Activate'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// 8. NEW: Project Roadmap View (Day 20)
// ====================================================================

const RoadmapView = ({ setView }) => {
    const { primary, secondary, success, neutralBg } = useTheme(); 

    const handleLoginClick = (userType) => {
        // Mock setting local storage to redirect after login
        localStorage.setItem('techtust_user_type', userType);
        localStorage.setItem('techtust_token', 'mock-jwt-token');
        setView(userType);
        alert(`Logged in as ${userType.charAt(0).toUpperCase() + userType.slice(1)}!`);
    };

    return (
        <div className="w-full max-w-6xl">
            <h1 className={`text-4xl font-extrabold text-[${primary}] mb-2`}>TechTrust Project Completion</h1>
            <p className="text-xl text-gray-600 mb-10">All four core modules have been designed and mocked.</p>

            <div className={`bg-[${neutralBg}] p-8 rounded-lg shadow-2xl border-t-8 border-[${secondary}]`}>
                
                <h2 className={`text-3xl font-bold text-gray-800 mb-6 flex items-center`}>
                    Project Milestones (4/4 Complete) <span className={`ml-3 text-3xl text-[${success}]`}>✅</span>
                </h2>

                <div className="space-y-6">
                    {PROJECT_MODULES.map(module => (
                        <div key={module.id} className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500 flex justify-between items-center">
                            <div className="flex-1 min-w-0">
                                <p className="text-xl font-semibold text-green-800">{module.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                            </div>
                            <div className="text-right ml-4">
                                <span className={`text-sm font-bold text-white px-3 py-1 rounded-full bg-[${success}]`}>
                                    {module.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">Completed: {module.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <h2 className={`text-2xl font-bold text-gray-800 mt-10 mb-5`}>Launch the Demo App</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => handleLoginClick('profile')}
                    className={`p-6 bg-[${primary}] text-white rounded-lg shadow-lg hover:bg-indigo-900 transition-transform transform hover:scale-[1.02]`}
                >
                    <p className="text-xl font-bold">Tech Professional (Jane Doe)</p>
                    <p className="text-sm opacity-80 mt-1">View Profile, Claims & Score</p>
                </button>
                <button
                    onClick={() => handleLoginClick('recruiter')}
                    className={`p-6 bg-[${secondary}] text-[${primary}] rounded-lg shadow-lg hover:bg-blue-300 transition-transform transform hover:scale-[1.02]`}
                >
                    <p className="text-xl font-bold">Enterprise Recruiter</p>
                    <p className="text-sm opacity-90 mt-1">Search Candidates & Manage API</p>
                </button>
                <button
                    onClick={() => handleLoginClick('verifier')}
                    className={`p-6 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-transform transform hover:scale-[1.02]`}
                >
                    <p className="text-xl font-bold">M3 Verifier Console</p>
                    <p className="text-sm opacity-90 mt-1">Review Pending Vetting Claims</p>
                </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-6">
                Or, click "Sign In" in the header to access the full login/registration page.
            </p>
            
        </div>
    );
};


// ====================================================================
// 9. App Component (The Main Router) - Final Update
// ====================================================================

const App = () => {
  // 🚨 Day 20: Changed initial view to 'roadmap' unless a token/user type exists
  const [currentView, setCurrentView] = React.useState('roadmap'); 
  const [themeMode, setThemeMode] = React.useState('light'); 
  
  // Central State Management (Trust Score & Claims)
  const [trustScore, setTrustScore] = React.useState(9.2); 
  const [newlyVerifiedId, setNewlyVerifiedId] = React.useState(null); 
  const [allClaims, setAllClaims] = React.useState(MOCK_INITIAL_CLAIMS); 
  
  // --- State Manipulation Functions (unchanged) ---
  const updateClaimStatus = React.useCallback((claimId, newStatus, shouldUpdateScore) => {
      setAllClaims(prevClaims => prevClaims.map(claim =>
          claim.id === claimId ? { ...claim, status: newStatus } : claim
      ));

      if (shouldUpdateScore) {
          setTrustScore(prevScore => Math.min(10.0, prevScore + 0.1)); 
          setNewlyVerifiedId(claimId);
      }
  }, []);

  const addClaim = React.useCallback((newClaimText) => {
      const newMockClaim = {
          id: Date.now(),
          text: newClaimText,
          status: 'PENDING'
      };
      setAllClaims(prevClaims => [newMockClaim, ...prevClaims]); 
  }, []);

  const removeClaim = React.useCallback((claimId) => {
      setAllClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
  }, []);
  
  const handleAlertDismissed = React.useCallback(() => {
      setNewlyVerifiedId(null);
  }, []);
  // ------------------------------------


  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const activeTheme = themeMode === 'light' ? THEME_CONFIG : DARK_THEME_CONFIG;
  const { secondary } = activeTheme.colors;

  React.useEffect(() => {
    const userType = localStorage.getItem('techtust_user_type');
    const token = localStorage.getItem('techtust_token');
    
    // 🚨 Day 20: If logged in, go to user type view. Otherwise, show roadmap.
    if (token && userType) {
      setCurrentView(userType); 
    } else {
      setCurrentView('roadmap');
    }
  }, []);

  let content;
  let mainClass = "flex-grow max-w-7xl mx-auto w-full p-4 sm:p-8 "; 

  // Simple Router Logic
  switch (currentView) {
    case 'roadmap':
        content = <RoadmapView setView={setCurrentView} />;
        break;
    case 'login':
      content = <AuthView setView={setCurrentView} />;
      break;
    case 'profile':
      content = <ProfileView 
        claims={allClaims} 
        trustScore={trustScore}
        newlyVerifiedId={newlyVerifiedId}
        onClaimSubmitted={addClaim} 
        onClaimAction={removeClaim}
        onAlertDismissed={handleAlertDismissed}
      />;
      break;
    case 'recruiter':
      content = <RecruiterView />;
      break;
    case 'verifier':
        content = <VerifierView allClaims={allClaims} updateClaimStatus={updateClaimStatus} />;
        break;
    case 'api':
        content = <EnterpriseAPIView />;
        break;
    default:
      content = <RoadmapView setView={setCurrentView} />;
  }

  return (
    <ThemeContext.Provider value={activeTheme.colors}>
      <div className={`min-h-screen flex flex-col ${themeMode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <Header 
            currentView={currentView} 
            setView={setCurrentView} 
            toggleTheme={toggleTheme} 
            themeMode={themeMode} 
        />
        
        <main className={mainClass + " flex"}>
          <div className={`w-full h-full flex ${currentView === 'login' || currentView === 'roadmap' ? 'items-center justify-center' : 'items-start justify-center'}`}>
            {content}
          </div>
        </main>

        <footer className="bg-gray-800 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm">
            &copy; 2025 TechTrust. All rights reserved. | 
            <a href="#" className={`text-[${secondary}] hover:text-blue-300 transition-colors`}>Terms & Privacy</a>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
};

// ====================================================================
// 10. REACT MOUNTING LOGIC (Browser Entry Point)
// ====================================================================

const rootElement = document.getElementById('root');

if (rootElement && typeof ReactDOM !== 'undefined') {
    const root = ReactDOM.createRoot(rootElement); 
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("React mounting failed. Ensure the React/ReactDOM/Babel CDNs are loaded and <div id='root'> exists.");
}