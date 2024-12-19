document.addEventListener('DOMContentLoaded', () => {
    const signUpContainer = document.getElementById('signUpContainer');
    const signInContainer = document.getElementById('signInContainer');
    const toSignInLink = document.getElementById('toSignIn');
    const toSignUpLink = document.getElementById('toSignUp');

    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');

    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');

    const showLoading = (button) => {
        button.classList.add('loading');
    };

    const hideLoading = (button) => {
        button.classList.remove('loading');
    };

    toSignInLink.addEventListener('click', () => {
        signUpContainer.classList.remove('active');
        signInContainer.classList.add('active');
    });

    toSignUpLink.addEventListener('click', () => {
        signInContainer.classList.remove('active');
        signUpContainer.classList.add('active');
    });

    if (signUpForm) {
        signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading(signUpButton);

            setTimeout(() => {
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const signUpMessage = document.getElementById('signUpMessage');

                if (password !== confirmPassword) {
                    signUpMessage.textContent = 'Passwords do not match!';
                    hideLoading(signUpButton);
                    return;
                }

                const userData = {
                    username: username,
                    email: email,
                    password: password
                };

                let users = JSON.parse(localStorage.getItem('users')) || [];
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));

                signUpMessage.textContent = 'Sign up successful!';
                signUpMessage.style.color = 'green';

                // Switch to sign in
                setTimeout(() => {
                    hideLoading(signUpButton);
                    signUpContainer.classList.remove('active');
                    signInContainer.classList.add('active');
                }, 1000);
            }, 1000); // Simulate network delay
        });
    }

    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading(signInButton);

            setTimeout(() => {
                const username = document.getElementById('signInUsername').value;
                const password = document.getElementById('signInPassword').value;
                const signInMessage = document.getElementById('signInMessage');

                let users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(user => user.username === username && user.password === password);

                if (user) {
                    signInMessage.textContent = 'Sign in successful!';
                    signInMessage.style.color = 'green';
                    // Redirect to the Dashboard
                    setTimeout(() => {
                        hideLoading(signInButton);
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    signInMessage.textContent = 'Invalid username or password';
                    signInMessage.style.color = 'red';
                    hideLoading(signInButton);
                }
            }, 500); // Simulate network delay
        });
    }
});
