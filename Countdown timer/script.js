let countdownInterval;
let colorChangeInterval;
let events = [];

function addEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDateTime = document.getElementById("eventDateTime").value;
    const eventCategory = document.getElementById("eventCategory").value;
    const eventRecurrence = document.getElementById("eventRecurrence").value;
    const eventTimezone = document.getElementById("eventTimezone").value;
    const eventNotes = document.getElementById("eventNotes").value;
    
    if (eventName && eventDateTime) {
        const event = {
            name: eventName,
            dateTime: new Date(eventDateTime).getTime(),
            category: eventCategory,
            recurrence: eventRecurrence,
            timezone: eventTimezone,
            notes: eventNotes
        };
        events.push(event);
        events.sort((a, b) => a.dateTime - b.dateTime);
        updateEventsList();
        startCountdown();
        saveEvents();
    }
}

function updateEventsList() {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";
    events.forEach((event, index) => {
        const eventItem = document.createElement("div");
        eventItem.className = "event-item";
        eventItem.innerHTML = `
            <span>${event.name} - ${new Date(event.dateTime).toLocaleString()} (${event.category})</span>
            <div>
                <button onclick="editEvent(${index})">Edit</button>
                <button onclick="removeEvent(${index})">Remove</button>
            </div>
        `;
        eventsList.appendChild(eventItem);
    });
}

function editEvent(index) {
    const event = events[index];
    document.getElementById("eventName").value = event.name;
    document.getElementById("eventDateTime").value = new Date(event.dateTime).toISOString().slice(0, 16);
    document.getElementById("eventCategory").value = event.category;
    document.getElementById("eventRecurrence").value = event.recurrence;
    document.getElementById("eventTimezone").value = event.timezone;
    document.getElementById("eventNotes").value = event.notes;
    
    events.splice(index, 1);
    
    const addButton = document.querySelector('button');
    addButton.textContent = 'Update Event';
    addButton.onclick = function() {
        addEvent();
        addButton.textContent = 'Add Event';
        addButton.onclick = addEvent;
    };
    
    updateEventsList();
    startCountdown();
    saveEvents();
}

function removeEvent(index) {
    events.splice(index, 1);
    updateEventsList();
    startCountdown();
    saveEvents();
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
            triggerConfetti();
            if (nextEvent.recurrence !== 'none') {
                let newDateTime = new Date(nextEvent.dateTime);
                switch(nextEvent.recurrence) {
                    case 'daily':
                        newDateTime.setDate(newDateTime.getDate() + 1);
                        break;
                    case 'weekly':
                        newDateTime.setDate(newDateTime.getDate() + 7);
                        break;
                    case 'monthly':
                        newDateTime.setMonth(newDateTime.getMonth() + 1);
                        break;
                    case 'yearly':
                        newDateTime.setFullYear(newDateTime.getFullYear() + 1);
                        break;
                }
                nextEvent.dateTime = newDateTime.getTime();
                events.sort((a, b) => a.dateTime - b.dateTime);
            } else {
                events.shift();
            }
            updateEventsList();
            saveEvents();
            updateCountdown();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = `
        <h2>Countdown to: ${nextEvent.name}</h2>
        <div class="countdown-boxes">
            <div class="time-section">
                <span id="days">${days}</span>
                <p>Days</p>
            </div>
            <div class="time-section">
                <span id="hours">${hours}</span>
                <p>Hours</p>
            </div>
            <div class="time-section">
                <span id="minutes">${minutes}</span>
                <p>Minutes</p>
            </div>
            <div class="time-section">
                <span id="seconds">${seconds}</span>
                <p>Seconds</p>
            </div>
        </div>
    `;

        updateProgressBar(distance, nextEvent.dateTime - now);
        updateWeatherForecast(nextEvent);
        updateMotivationalQuote();
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

    startColorChange();
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    const message = document.createElement('div');
    message.textContent = `🎉 ${events[0].name} has arrived! 🎉`;
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.color = 'white';
    message.style.backgroundColor = 'rgba(0,0,0,0.7)';
    message.style.padding = '20px';
    message.style.borderRadius = '10px';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.zIndex = '1000';
    document.body.appendChild(message);

    setTimeout(() => {
        document.body.removeChild(message);
    }, 5000);

    playAlertSound();
}

function startColorChange() {
    if (colorChangeInterval) {
        clearInterval(colorChangeInterval);
    }
    
    colorChangeInterval = setInterval(function() {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        document.querySelectorAll('.time-section').forEach(el => {
            el.style.backgroundColor = "#" + randomColor;
        });
    }, 1000);
}

function changeTheme() {
    const color = document.getElementById("themeColor").value;
    document.documentElement.style.setProperty('--theme-color', color);
    localStorage.setItem('themeColor', color);
}

const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

const backgroundImages = [
    'https://picsum.photos/1920/1080?random=1',
    'https://picsum.photos/1920/1080?random=2',
    'https://picsum.photos/1920/1080?random=3',
    'https://picsum.photos/1920/1080?random=4',
    'https://picsum.photos/1920/1080?random=5'
];

let currentImageIndex = 0;

function changeBackgroundImage() {
    const now = new Date();
    const minutes = now.getMinutes();
    const imageIndex = minutes % backgroundImages.length;
    const imageUrl = backgroundImages[imageIndex];
    
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    console.log('Background image set to:', imageUrl);

    // Set timeout for next minute change
    const secondsUntilNextMinute = 60 - now.getSeconds();
    setTimeout(changeBackgroundImage, secondsUntilNextMinute * 1000);
}

// Initial call to set the background and start the cycle
changeBackgroundImage();

document.querySelectorAll('.time-section').forEach(el => {
    el.style.transition = 'transform 0.3s, background-color 0.3s';
});