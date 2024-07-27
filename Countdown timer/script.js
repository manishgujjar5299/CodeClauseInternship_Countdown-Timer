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
        events.sort((a, b) => a.dateTime - b.dateTime); // Sort events by date
        updateEventsList();
        startCountdown();
    }
}

function updateEventsList() {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";
    events.forEach((event, index) => {
        const eventItem = document.createElement("div");
        eventItem.className = "event-item";
        eventItem.innerHTML = `
            <span>${event.name} - ${new Date(event.dateTime).toLocaleString()}</span>
            <button onclick="removeEvent(${index})">Remove</button>
        `;
        eventsList.appendChild(eventItem);
    });
}

function removeEvent(index) {
    events.splice(index, 1);
    updateEventsList();
    startCountdown();
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
        const nextEvent = events[0]; // The next event is always the first one after sorting
        const distance = nextEvent.dateTime - now;

        if (distance < 0) {
            // Event has ended, remove it and start countdown for the next one
            events.shift();
            updateEventsList();
            updateCountdown(); // Recursively call to start next event countdown
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
    }

    updateCountdown(); // Initial call
    countdownInterval = setInterval(updateCountdown, 1000);

    startColorChange();
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
    }, 1000); // Change color every second
}

function changeTheme() {
    const color = document.getElementById("themeColor").value;
    document.querySelector('button').style.backgroundColor = color;
}

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