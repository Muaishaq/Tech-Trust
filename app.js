// app.js - Final Working React App for CDN Environment (Day 16: Mock Claim Verifier)

// --- THEME CONFIGURATION ---
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

// --- Theme Context Setup ---
const ThemeContext = React.createContext(THEME_CONFIG.colors);
const useTheme = () => React.useContext(ThemeContext);


// --- MOCK API DATA (UPDATED for Day 16) ---
const MOCK_PROFILE_DATA = {
  name: "Jane Doe (React Dev)",
  title: "Senior Software Architect",
  memberSince: "July 2024",
  trustScore: 9.2,
  lastVetted: "2025-10-21",
  claims: [
    { id: 1, text: "Certified AWS Solutions Architect (2023)", status: "VERIFIED" },
    { id: 2, text: "Led Microservices Migration Project (3 years experience)", status: "PENDING" },
  ]
};

const MOCK_SEARCH_RESULTS = [
    { id: 101, name: "Michael Johnson", title: "DevOps Engineer", score: 9.6, skills: ["Kubernetes", "Terraform", "AWS"], verificationSource: "CNCF" },
    { id: 102, name: "Sarah Chen", title: "Senior Data Scientist", score: 8.9, skills: ["Python", "TensorFlow", "Spark"], verificationSource: "Project A-Z" },
    { id: 103, name: "Alex Vlasov", title: "Cybersecurity Analyst", score: 8.5, skills: ["CISSP", "Penetration Testing", "SIEM"], verificationSource: "ISC²" },
];

// 🚨 Day 16: New Mock Data for the Verifier Queue
const MOCK_VERIFICATION_QUEUE = [
    { id: 201, claimant: "Jane Doe", claimText: "Successfully deployed serverless authentication flow using Cognito.", proofUrl: "https://github.com/janedoe/auth-project-v2", submitted: "2 hours ago" },
    { id: 202, claimant: "John Smith", claimText: "Completed 'Advanced Data Structures' course from Coursera.", proofUrl: "https://coursera.org/cert/johnsmith123", submitted: "1 day ago" },
    { id: 203, claimant: "Pat Lee", claimText: "Wrote a custom Kubernetes operator in Go.", proofUrl: "https://github.com/patlee/k8s-operator", submitted: "2 days ago" },
];


// ====================================================================
// 1. Header Component
// ====================================================================

const Header = ({ currentView, setView, toggleTheme, themeMode }) => {
  const { primary, secondary, textOnPrimary } = useTheme(); 
  const isLoggedIn = currentView !== 'login'; 
  const isVerifier = currentView === 'verifier';

  const handleLogout = () => {
    localStorage.clear(); 
    setView('login');
  };

  return (
    <header className={`bg-[${primary}] text-[${textOnPrimary}] shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wider">TechTrust</div>
        <nav className="space-x-6 hidden sm:flex">
          <a href="#" onClick={() => setView('profile')} className="font-medium hover:text-blue-300 transition-colors">Profile</a>
          <a href="#" onClick={() => setView('recruiter')} className="font-medium hover:text-blue-300 transition-colors">Job Board</a>
          {/* 🚨 Day 16: Verifier Link */}
          {isVerifier && 
            <a href="#" onClick={() => setView('verifier')} className="font-medium text-yellow-300 hover:text-yellow-100 transition-colors">Verifier Console</a>
          }
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
// 2. Authentication View (Updated for Verifier)
// ====================================================================

const AuthView = ({ setView }) => {
  const { primary, secondary, textOnSecondary, neutralBg } = useTheme(); 
  const [isLogin, setIsLogin] = React.useState(true);
  
  // 🚨 Day 16: Added Verifier Type
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
            // Registration fields (unchanged)
            // ...
            <input type="hidden" name="user_type" value="professional" /> // Simple registration defaults to professional
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
        
        {/* Simplified registration to default to professional, login handles type selection */}
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
        const details = formData.get('claim-details');
        
        const claimPayload = {
            claim: title,
            details: details,
            user_id: 123, 
            submission_date: new Date().toISOString()
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const isMockSuccess = Math.random() > 0.1;

            if (isMockSuccess) {
                console.log('Claim submission successful:', claimPayload);
                alert("✅ Claim Submitted! It is now PENDING verification by M3's AI.");
                
                if (onClaimSubmitted) {
                    onClaimSubmitted(claimPayload);
                }
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
// 4. Profile View (unchanged)
// ====================================================================

const ProfileView = () => {
  const { primary, secondary, success, neutralBg } = useTheme(); 
  const [profile, setProfile] = React.useState(null);
  const [claims, setClaims] = React.useState([]); 
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false); 

  React.useEffect(() => {
    const fetchProfileData = () => {
      setLoading(true);
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(MOCK_PROFILE_DATA); 
        }, 1000); 
      });
    };

    fetchProfileData().then(data => {
      setProfile(data);
      setClaims(data.claims); 
      setLoading(false);
    });
  }, []);

  const handleClaimSubmitted = (newClaim) => {
      const newMockClaim = {
          id: Date.now(),
          text: newClaim.claim,
          status: 'PENDING'
      };
      setClaims(prevClaims => [newMockClaim, ...prevClaims]);
  };

  const handleClaimAction = (claimId, action) => {
    if (action === 'delete') {
      if (window.confirm("Are you sure you want to delete this claim? This action cannot be undone.")) {
        setClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
        alert('Claim successfully deleted.');
      }
    } else if (action === 'edit') {
      alert(`Editing Claim ID ${claimId}: Functionality mocked. A real app would open an Edit Modal here.`);
    }
  };


  if (loading) {
    return <div className="text-center py-10 text-xl text-gray-600">Loading Profile Data...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-xl text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-1 space-y-6">
        <div className={`bg-[${neutralBg}] p-6 rounded-lg shadow-xl border-t-4 border-[${success}]`}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Verification Status</h3>
          <div className="text-center">
            <p className={`text-6xl font-extrabold text-[${primary}]`}>{profile.trustScore.toFixed(1)}</p>
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
                <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block 
                  ${claim.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {claim.status}
                </span>
              </div>
              
              {/* Right side: Action Buttons */}
              <div className="flex space-x-3 text-sm pt-1">
                <button 
                  onClick={() => handleClaimAction(claim.id, 'edit')}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit Claim"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleClaimAction(claim.id, 'delete')}
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
          onClaimSubmitted={handleClaimSubmitted}
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
                                        
                                        {/* Day 15: Verification Source Tag */}
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
// 6. Verifier View (NEW for Day 16)
// ====================================================================

const VerifierView = () => {
    const { primary, success, secondary, neutralBg } = useTheme();
    const [queue, setQueue] = React.useState(MOCK_VERIFICATION_QUEUE);

    const handleVerification = (claimId, result) => {
        setQueue(prevQueue => prevQueue.filter(claim => claim.id !== claimId));

        if (result === 'approve') {
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
                                    <p className={`text-xl font-bold text-gray-800 mt-1`}>{claim.claimText}</p>
                                    <p className="text-gray-600 mt-1">Claimant: <span className="font-semibold text-[${primary}]">{claim.claimant}</span></p>
                                </div>
                                <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-3 py-1 rounded-full">PENDING REVIEW</span>
                            </div>
                            
                            <p className="text-sm text-gray-700 mt-2">Proof/Details: <a href={claim.proofUrl} target="_blank" className={`text-[${secondary}] hover:underline`}>{claim.proofUrl.length > 50 ? claim.proofUrl.substring(0, 50) + '...' : claim.proofUrl}</a></p>

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
// 7. App Component (The Main Router) - Updated for Verifier View
// ====================================================================

const App = () => {
  const [currentView, setCurrentView] = React.useState('login'); 
  const [themeMode, setThemeMode] = React.useState('light'); 

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const activeTheme = themeMode === 'light' ? THEME_CONFIG : DARK_THEME_CONFIG;
  const { secondary } = activeTheme.colors;

  React.useEffect(() => {
    const userType = localStorage.getItem('techtust_user_type');
    const token = localStorage.getItem('techtust_token');
    if (token && userType) {
      setCurrentView(userType); // Use stored userType directly as the view name
    } else {
      setCurrentView('login');
    }
  }, []);

  let content;
  let mainClass = "flex-grow max-w-7xl mx-auto w-full p-4 sm:p-8 "; 

  // Simple Router Logic
  switch (currentView) {
    case 'login':
      content = <AuthView setView={setCurrentView} />;
      break;
    case 'profile':
      content = <ProfileView />;
      break;
    case 'recruiter':
      content = <RecruiterView />;
      break;
    // 🚨 Day 16: New Verifier Route
    case 'verifier':
        content = <VerifierView />;
        break;
    default:
      content = <AuthView setView={setCurrentView} />;
  }

  return (
    <ThemeContext.Provider value={activeTheme.colors}>
      {/* Set the main application background based on theme mode */}
      <div className={`min-h-screen flex flex-col ${themeMode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <Header 
            currentView={currentView} 
            setView={setCurrentView} 
            toggleTheme={toggleTheme} 
            themeMode={themeMode} 
        />
        
        <main className={mainClass + " flex"}>
          {/* Center content horizontally and vertically only for AuthView */}
          <div className={`w-full h-full flex ${currentView === 'login' ? 'items-center justify-center' : 'items-start justify-center'}`}>
            {content}
          </div>
        </main>

        {/* Footer Component */}
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
// 8. REACT MOUNTING LOGIC (Browser Entry Point)
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