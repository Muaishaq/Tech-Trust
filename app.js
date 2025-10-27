
        document.addEventListener('DOMContentLoaded', () => {
            const appContainer = document.getElementById('app-content-container');
            
            // --- Navigation Elements ---
            const profileLink = document.getElementById('nav-profile');
            const jobsLink = document.getElementById('nav-jobs');
            const authBtn = document.getElementById('auth-btn');

            // --- View Elements ---
            const loginView = document.getElementById('login-view');
            const profileView = document.getElementById('profile-view');
            const recruiterView = document.getElementById('recruiter-view');
            
            // --- Authentication Form Elements (Day 2 Logic) ---
            const loginTab = document.getElementById('login-tab');
            const registerTab = document.getElementById('register-tab');
            const loginContent = document.getElementById('login-form-content');
            const registerContent = document.getElementById('register-form-content');

            // --- Core View Switching Logic ---
            const showView = (viewId) => {
                // Hide all main views
                document.querySelectorAll('.app-view').forEach(view => {
                    view.classList.add('hidden');
                });
                
                // Show the target view
                const targetView = document.getElementById(viewId);
                if (targetView) {
                    targetView.classList.remove('hidden');
                }

                // Adjust main container flex properties for centering the login form
                if (viewId === 'login-view') {
                     appContainer.classList.add('items-center', 'justify-center');
                } else {
                     appContainer.classList.remove('items-center', 'justify-center');
                }
            };
            
            // --- Event Listeners for Navigation ---
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                showView('profile-view');
            });

            jobsLink.addEventListener('click', (e) => {
                e.preventDefault();
                showView('recruiter-view');
            });
            
            authBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // For now, this button always takes us back to the login screen
                showView('login-view');
            });

            // --- Event Listeners for Login/Register Tab Switching ---
            const switchForm = (isLogin) => {
                if (isLogin) {
                    // Show Login, Hide Register
                    loginContent.classList.remove('hidden');
                    registerContent.classList.add('hidden');
                    
                    // Style Tabs
                    loginTab.classList.add('text-navy-blue', 'border-navy-blue');
                    loginTab.classList.remove('text-gray-500', 'border-transparent');
                    
                    registerTab.classList.remove('text-navy-blue', 'border-navy-blue');
                    registerTab.classList.add('text-gray-500', 'border-transparent');

                } else {
                    // Show Register, Hide Login
                    registerContent.classList.remove('hidden');
                    loginContent.classList.add('hidden');
                    
                    // Style Tabs
                    registerTab.classList.add('text-navy-blue', 'border-navy-blue');
                    registerTab.classList.remove('text-gray-500', 'border-transparent');
                    
                    loginTab.classList.remove('text-navy-blue', 'border-navy-blue');
                    loginTab.classList.add('text-gray-500', 'border-transparent');
                }
            };

            loginTab.addEventListener('click', () => switchForm(true));
            registerTab.addEventListener('click', () => switchForm(false));
            
            // --- Initial Load ---
            // Start on the login view
            showView('login-view');
        });