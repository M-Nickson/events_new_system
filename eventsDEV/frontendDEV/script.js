// Base URL for backend API
const API_BASE_URL = "http://localhost:5000";

// Helper function to make API calls
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred.");
    }

    return await response.json();
  } catch (err) {
    alert(err.message);
    throw err;
  }
}

// Login Form Submission
document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the access token if login is successful
      localStorage.setItem("access_token", data.access_token);
      
      // Redirect based on whether the user is ADMIN
      window.location.href = username === "ADMIN" ? "admin-dashboard.html" : "user-dashboard.html";
    } else {
      // Handle errors based on the response message
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred during login. Please try again.");
  }
});

// Registration Form Submission
document.getElementById("registerForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await fetchData(`${API_BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    alert(data.message);
    window.location.href = "authentification.html";
  } catch (err) {
    console.error(err);
  }
});

// Forgot Password Form Submission
document.getElementById("forgotPasswordForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const data = await fetchData(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    alert(data.message);
    window.location.href = "authentification.html";
  } catch (err) {
    console.error(err);
  }
});

// Logout Function
function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "authentification.html";
}

// Display Upcoming Events (User Dashboard)
async function displayUpcomingEvents() {
  try {
    const events = await fetchData(`${API_BASE_URL}/events`);
    const upcomingEventsList = document.getElementById("upcomingEvents");
    upcomingEventsList.innerHTML = "";

    events.forEach((event) => {
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date} at ${event.location}`;

      const buyTicketButton = document.createElement("button");
      buyTicketButton.textContent = "Buy Ticket";
      buyTicketButton.onclick = () => buyTicket(event.id);

      li.appendChild(buyTicketButton);
      upcomingEventsList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// Buy Ticket Function
async function buyTicket(eventId) {
  const paymentMethod = prompt("Enter payment method (e.g., Credit Card, PayPal):");
  if (!paymentMethod) return;

  try {
    const data = await fetchData(`${API_BASE_URL}/events/${eventId}/buy-ticket`, {
      method: "POST",
      body: JSON.stringify({ paymentMethod }),
    });

    alert(data.message);
    displayUpcomingEvents(); // Refresh the event list
  } catch (err) {
    console.error(err);
  }
}

// Display Registered Events (User Dashboard)
async function displayRegisteredEvents() {
  try {
    const events = await fetchData(`${API_BASE_URL}/events/registered`);
    const registeredEventsList = document.getElementById("registeredEvents");
    registeredEventsList.innerHTML = "";

    events.forEach((event) => {
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date} at ${event.location}`;
      registeredEventsList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// Display All Events (Admin Dashboard)
async function displayAllEvents() {
  try {
    const events = await fetchData(`${API_BASE_URL}/events`);
    const allEventsList = document.getElementById("allEvents");
    allEventsList.innerHTML = "";

    events.forEach((event) => {
      const li = document.createElement("li");
      li.textContent = `${event.name} - ${event.date} at ${event.location}`;
      allEventsList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// Create New Event (Admin Dashboard)
document.getElementById("createEventForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const eventName = document.getElementById("eventName").value;
  const eventDate = document.getElementById("eventDate").value;
  const eventLocation = document.getElementById("eventLocation").value;

  try {
    const data = await fetchData(`${API_BASE_URL}/events`, {
      method: "POST",
      body: JSON.stringify({ name: eventName, date: eventDate, location: eventLocation }),
    });

    alert(data.message);
    displayAllEvents(); // Refresh the event list
  } catch (err) {
    console.error(err);
  }
});

// Delete an Event (Admin Dashboard)
document.getElementById("deleteEventForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const eventId = document.getElementById("deleteEventName").value;

  try {
    const data = await fetchData(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
    });

    alert(data.message);
    displayAllEvents(); // Refresh the event list
  } catch (err) {
    console.error(err);
  }
});

// Display All Users (Admin Dashboard)
async function displayAllUsers() {
  try {
    const users = await fetchData(`${API_BASE_URL}/users`);
    const allUsersList = document.getElementById("allUsers");
    allUsersList.innerHTML = "";

    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.username} - ${user.email}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete User";
      deleteButton.onclick = () => deleteUser(user.id);

      li.appendChild(deleteButton);
      allUsersList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// Delete User Function
async function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      const data = await fetchData(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
      });

      alert(data.message);
      displayAllUsers(); // Refresh the user list
    } catch (err) {
      console.error(err);
    }
  }
}

// Call functions when the dashboard loads
if (window.location.pathname.includes("user-dashboard.html")) {
  displayUpcomingEvents();
  displayRegisteredEvents();
}

if (window.location.pathname.includes("admin-dashboard.html")) {
  displayAllEvents();
  displayAllUsers();
}

// the events display routes :
document.addEventListener("DOMContentLoaded", function() {
  fetch('/get_users')
      .then(response => response.json())
      .then(data => {
          const userList = document.getElementById('allUsers');
          userList.innerHTML = '';
          data.forEach(user => {
              const li = document.createElement('li');
              li.textContent = user.username; // Adjust as needed
              userList.appendChild(li);
          });
      })
      .catch(error => console.error('Error fetching users:', error));
});
