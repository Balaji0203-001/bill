document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.getElementById('signInForm');
    const signInButton = document.getElementById('signInButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const signInMessage = document.getElementById('signInMessage');

    // Fetch the JSON file with user data
    const fetchUsersData = () => {
        return fetch('users.json')
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching users data:', error);
                return [];
            });
    };

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Show loading state
        signInButton.disabled = true;  // Disable the button
        loadingSpinner.style.display = 'inline-block';  // Show the spinner

        // Clear previous message and reset styles
        signInMessage.textContent = '';
        signInMessage.classList.remove('success', 'error');

        // Validate user credentials
        fetchUsersData().then(users => {
            const user = users.find(user => user.username === username && user.password === password);
            
            if (user) {
                signInMessage.textContent = 'Sign in successful!';
                signInMessage.classList.add('success'); // Apply success style and animation
                // Redirect to a new page after successful sign-in
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Redirect to your dashboard page
                }, 1000);
            } else {
                signInMessage.textContent = 'Invalid username or password';
                signInMessage.classList.add('error'); // Apply error style and animation
            }
            
            // Reset button and spinner after attempt
            signInButton.disabled = false;
            loadingSpinner.style.display = 'none';  // Hide the spinner
        });
    });
});
