const crypto = require("crypto");

    module.exports = async (req, res) => {
        const { username, message } = req.body; // Ambil username dan message dari request body
        let counter = 0;

        try {
            const date = new Date();
            const minutes = date.getMinutes();
            const hours = date.getHours();
            const formattedDate = `${hours}:${minutes}`;

            const deviceId = crypto.randomBytes(21).toString("hex");
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
                console.log(`[${formattedDate}] [Err] Ratelimited`);
                res.status(500).send(`Ratelimited`); // Kirim response ke client
            } else {
                counter++;
                console.log(`[${formattedDate}] [Msg] Sent: ${counter}`);
                res.status(200).send(`Sent: ${counter}`); // Kirim response ke client
            }
        } catch (error) {
            console.error(`[${formattedDate}] [Err] ${error}`);
            res.status(500).send(`Error: ${error}`); // Kirim response ke client
        }
    };
