let countdownInterval;
let colorChangeInterval;
let events = [];

function addEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDateTime = document.getElementById("eventDateTime").value;
    
    if (eventName && eventDateTime) {
        const event = {
            name: eventName,
            dateTime: new Date(eventDateTime).getTime()
        };
        events.push(event);
        saveEvents();
        updateEventsList();
        startCountdown();
    }
}

function updateEventsList() {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";
    events.sort((a, b) => a.dateTime - b.dateTime);
    events.forEach((event, index) => {
        const eventItem = document.createElement("div");
        eventItem.className = "event-item";
        eventItem.innerHTML = `
            <span>${event.name} - ${new Date(event.dateTime).toLocaleString()}</span>
            <button onclick="editEvent(${index})">Edit</button>
            <button onclick="removeEvent(${index})">Remove</button>
        `;
        eventsList.appendChild(eventItem);
    });
}

function removeEvent(index) {
    events.splice(index, 1);
    saveEvents();
    updateEventsList();
    startCountdown();
}

function editEvent(index) {
    const event = events[index];
    const modal = document.createElement("div");
    modal.className = "edit-event-modal";
    modal.innerHTML = `
        <div class="edit-event-content">
            <span class="close">&times;</span>
            <h2>Edit Event</h2>
            <input type="text" id="editEventName" value="${event.name}">
            <input type="datetime-local" id="editEventDateTime" value="${new Date(event.dateTime).toISOString().slice(0, 16)}">
            <button onclick="saveEditedEvent(${index})">Save Changes</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close");
    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.removeChild(modal);
    }
}

function saveEditedEvent(index) {
    const editedName = document.getElementById("editEventName").value;
    const editedDateTime = document.getElementById("editEventDateTime").value;
    
    if (editedName && editedDateTime) {
        events[index] = {
            name: editedName,
            dateTime: new Date(editedDateTime).getTime()
        };
        saveEvents();
        updateEventsList();
        startCountdown();
        const modal = document.querySelector(".edit-event-modal");
        modal.style.display = "none";
        document.body.removeChild(modal);
    }
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function updateCountdown() {
        if (events.length === 0) {
            document.getElementById("countdown").innerHTML = "<h2>No upcoming events</h2>";
            return;
        }

        const now = new Date().getTime();
        const nextEvent = events[0];
        const distance = nextEvent.dateTime - now;

        if (distance < 0) {
            playAlertSound();
            events.shift();
            saveEvents();
            updateEventsList();
            updateCountdown();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdownTitle").textContent = `Countdown to: ${nextEvent.name}`;
        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;

        updateProgressBars(days, hours, minutes, seconds);
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateProgressBars(days, hours, minutes, seconds) {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    const maxSeconds = 30 * 86400; // 30 days

    const daysProgress = (days / 30) * 100;
    const hoursProgress = (hours / 24) * 100;
    const minutesProgress = (minutes / 60) * 100;
    const secondsProgress = (seconds / 60) * 100;

    document.getElementById("daysProgress").innerHTML = `<div class="progress-bar-fill" style="width: ${daysProgress}%"></div>`;
    document.getElementById("hoursProgress").innerHTML = `<div class="progress-bar-fill" style="width: ${hoursProgress}%"></div>`;
    document.getElementById("minutesProgress").innerHTML = `<div class="progress-bar-fill" style="width: ${minutesProgress}%"></div>`;
    document.getElementById("secondsProgress").innerHTML = `<div class="progress-bar-fill" style="width: ${secondsProgress}%"></div>`;
}

function playAlertSound() {
    const audio = document.getElementById("alertSound");
    audio.play();
}

function changeTheme() {
    const color = document.getElementById("themeColor").value;
    document.documentElement.style.setProperty('--theme-color', color);
}

function changeBackgroundImage() {
    const selectedBackground = document.getElementById("backgroundImage").value;
    const backgrounds = {
        default: 'url("default-background.jpg")',
        nature: 'url("nature-background.jpg")',
        city: 'url("city-background.jpg")',
        abstract: 'url("abstract-background.jpg")'
    };
    document.body.style.backgroundImage = backgrounds[selectedBackground];
}

function shareOnWhatsapp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.whatsapp.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this event countdown!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEvents() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
        updateEventsList();
        startCountdown();
    }
}

// Initial setup
loadEvents();
changeTheme();
changeBackgroundImage();