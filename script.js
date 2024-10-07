const credentials = {
    USER: "USER",
    ADMIN: "ADMIN"
};

let pollResults = [
    {
        pollName: "Mikä on lempieläimesi?",
        options: [
            { option: "Kissa", votes: 89 },
            { option: "Koira", votes: 54 },
            { option: "Lintu", votes: 20 }
        ]
    },
    {
        pollName: "Mikä on paras ohjelmointikieli?",
        options: [
            { option: "Python", votes: 33 },
            { option: "JavaScript", votes: 12 },
            { option: "C", votes: 83 },
            { option: "Scratch", votes: 96 }
        ]
    },
    {
        pollName: "Aiotko äänestää?",
        options: [
            { option: "Kyllä", votes: 76 },
            { option: "En", votes: 16 },
            { option: "Ehkä", votes: 27 }
        ]
    }
];

let isLoggedIn = false;
let currentRole = null;

// Event Listeners on Window Load
window.onload = function() {
    document.getElementById("logout-button").addEventListener("click", handleLogout);
    document.getElementById("createPollForm").addEventListener("submit", handlePollCreation);
    document.getElementById("create-poll-button").addEventListener("click", showModal); // Show modal
    document.getElementById("login-submit-button").addEventListener("click", handleLogin); // Add login handler
    document.getElementById("login-button").addEventListener("click", showLoginModal); // Show login modal
    displayPolls(); // Display existing polls
};

// Display polls
function displayPolls() {
    const pollsContainer = document.getElementById("polls-container");
    pollsContainer.innerHTML = ''; // Clear existing polls

    pollResults.forEach((poll, pollIndex) => {
        const pollCard = `
            <div class="poll-card">
                <h3>${poll.pollName}</h3>
                <form id="vote-form-${pollIndex}" onsubmit="handleVote(event, ${pollIndex})">
                    ${poll.options.map((option) => `
                        <div>
                            <input type="radio" name="vote-option-${pollIndex}" value="${option.option}" required>
                            <label>${option.option}</label>
                        </div>
                    `).join('')}
                    <button type="submit">Äänestä</button>
                </form>
                <div id="results-${pollIndex}" style="display:none;">
                    Äänet: ${poll.options.map(option => `${option.option}: ${option.votes}`).join(', ')}
                </div>
            </div>
        `;
        pollsContainer.innerHTML += pollCard;
    });
}

// Handle Login
function handleLogin() {
    try {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        console.log("Username:", username); // Debugging
        console.log("Password:", password); // Debugging

        if (credentials[username] && credentials[username] === password) {
            isLoggedIn = true;
            currentRole = username; // Set currentRole to the logged-in user
            document.getElementById("logout-button").style.display = 'block'; // Show logout button
            document.getElementById("login-button").style.display = 'none'; // Hide login button
            closeLoginModal(); // Close the login modal
            updateCreatePollVisibility(); // Update poll creation section visibility
            displayPolls(); // Refresh polls display
            
            // Optional: Clear input fields
            document.getElementById("username").value = '';
            document.getElementById("password").value = '';
        } else {
            alert("Virheellinen käyttäjätunnus tai salasana!");
        }
    } catch (error) {
        console.error("Error handling login:", error);
    }
}

// Handle logout
function handleLogout() {
    isLoggedIn = false;
    currentRole = null; // Reset role on logout
    document.getElementById("logout-button").style.display = 'none'; // Hide logout button
    document.getElementById("login-button").style.display = 'inline-block'; // Show login button
    updateCreatePollVisibility(); // Hide poll creation section
}

// Update visibility of the create poll section based on user role
function updateCreatePollVisibility() {
    // Show the create poll button if the user is ADMIN
    document.getElementById("create-poll-button").style.display = currentRole === "ADMIN" ? 'inline-block' : 'none';
}

// Handle vote submission
function handleVote(event, pollIndex) {
    event.preventDefault();
    if (!isLoggedIn) {
        alert("Sinun on kirjauduttava äänestääksesi!");
        return;
    }

    const selectedOption = document.querySelector(`input[name="vote-option-${pollIndex}"]:checked`);
    pollResults[pollIndex].options.forEach(option => {
        if (option.option === selectedOption.value) {
            option.votes += 1; // Update votes
        }
    });

    displayResults(pollIndex); // Update results display
}

// Display poll results
function displayResults(pollIndex) {
    const resultsContainer = document.getElementById(`results-${pollIndex}`);
    resultsContainer.innerHTML = `Äänet: ${pollResults[pollIndex].options.map(option => `${option.option}: ${option.votes}`).join(', ')}`;
    resultsContainer.style.display = 'block';
}

// Add new poll option
function addPollOption() {
    const optionsContainer = document.getElementById("options-container");
    const newOptionInput = document.createElement('input');
    newOptionInput.setAttribute('type', 'text');
    newOptionInput.setAttribute('placeholder', 'Vaihtoehto');
    newOptionInput.setAttribute('required', 'required');
    optionsContainer.appendChild(newOptionInput);
}

// Handle new poll creation
function handlePollCreation(event) {
    event.preventDefault();
    if (currentRole !== "ADMIN") {
        alert("Sinun on oltava ADMIN, jotta voit luoda uuden äänestyksen!");
        return;
    }

    const pollName = document.getElementById("pollName").value;
    const options = Array.from(document.querySelectorAll('#options-container input')).map(input => input.value);

    const newPoll = {
        pollName,
        options: options.map(option => ({ option, votes: 0 }))
    };
    pollResults.push(newPoll);
    displayPolls(); // Refresh polls display
    closeModal(); // Close the modal after creation
    document.getElementById("createPollForm").reset(); // Reset form
}

// Show the modal
function showModal() {
    const pollModal = new bootstrap.Modal(document.getElementById('poll-modal'));
    pollModal.show(); // Use Bootstrap's modal method to show the modal
}

// Close the modal
function closeModal() {
    const pollModal = bootstrap.Modal.getInstance(document.getElementById('poll-modal'));
    if (pollModal) {
        pollModal.hide(); // Use Bootstrap's modal method to hide the modal
    }
    document.getElementById("options-container").innerHTML = '<input type="text" placeholder="Vaihtoehto" required>'; // Reset options
}

// Show the login modal
function showLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
    loginModal.show(); // Use Bootstrap's modal method to show the modal
}

// Close the login modal
function closeLoginModal() {
    const modalElement = document.getElementById('login-modal');
    const modal = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
    if (modal) {
        modal.hide(); // Hide the modal
    }
}

// Initial load
displayPolls(); // Display existing polls
