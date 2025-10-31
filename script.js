const startButton = document.getElementById("startButton");
    const usernameInput = document.getElementById("username");
    const messageInput = document.getElementById("message");
    const statusDiv = document.getElementById("status");

    let counter = 0;
    let isRunning = false;

    const sendMessage = async (username, message) => {
        try {
            const response = await fetch("/api/ngl", { // Panggil serverless function
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, message }) // Kirim username dan message ke backend
            });

            const data = await response.text(); // Ambil response dari backend

            if (response.status !== 200) {
                statusDiv.textContent = `[Err] ${data}`; // Tampilkan error dari backend
            } else {
                counter++;
                statusDiv.textContent = `[Msg] ${data}`; // Tampilkan pesan sukses dari backend
            }
        } catch (error) {
            statusDiv.textContent = `[Err] ${error}`;
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
