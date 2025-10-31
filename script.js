const startButton = document.getElementById("startButton");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const statusDiv = document.getElementById("status");

let counter = 0;
let isRunning = false;

// Fungsi buat generate deviceId (pengganti crypto.randomBytes)
function generateDeviceId() {
    const randomBytes = new Uint8Array(21);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

const sendMessage = async (username, message) => {
    while (isRunning) {
        try {
            const date = new Date();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const formattedDate = `${hours}:${minutes}`;

            const deviceId = generateDeviceId(); // Pake fungsi yang baru
            const url = "https://ngl.link/api/submit";
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Referer": `https://ngl.link/${username}`,
                "Origin": "https://ngl.link"
            };
            const body = `username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;

            const response = await fetch(url, {
                method: "POST",
                headers,
                body,
                mode: "cors",
                credentials: "include"
            });

            if (response.status !== 200) {
                statusDiv.textContent = `[${formattedDate}] [Err] Ratelimited`;
                await new Promise(resolve => setTimeout(resolve, 25000));
            } else {
                counter++;
                statusDiv.textContent = `[${formattedDate}] [Msg] Sent: ${counter}`;
            }
        } catch (error) {
            statusDiv.textContent = `[${formattedDate}] [Err] ${error}`;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

startButton.addEventListener("click", () => {
    if (!isRunning) {
        const username = usernameInput.value;
        const message = messageInput.value;

        if (username && message) {
            isRunning = true;
            statusDiv.textContent = "Mulai Menge-spam...";
            sendMessage(username, message);
            startButton.textContent = "Stop Spam!";
        } else {
            statusDiv.textContent = "Isi semua kolom dulu, goblok!";
        }
    } else {
        isRunning = false;
        statusDiv.textContent = "Spam Dihentikan.";
        startButton.textContent = "Mulai Spam!";
    }
});
