const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    command: "dl",
    description: "Download files from URLs",
    category: "downloader",

    execute: async (sock, m, { args, reply }) => {
        if (!args.length)
            return reply("❗ *Give URLs to download*\nExample: dl https://example.com/file.mp4");

        let urls = args;

        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const thumbUrl =
            "https://raw.githubusercontent.com/deneth-hansaka-keerthirathna/DENETH-Media/refs/heads/main/main2.jpg";

        let thumbBuffer;
        try {
            const t = await axios.get(thumbUrl, { responseType: "arraybuffer" });
            thumbBuffer = t.data;
        } catch {
            thumbBuffer = null;
        }

        for (let url of urls) {
            try {
                await sock.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

                const tempName = Date.now() + "-" + Math.random().toString(36).slice(3);
                const tempPath = path.join(tempDir, tempName);

                const response = await axios({
                    method: "GET",
                    url,
                    responseType: "arraybuffer"
                });

                const headers = response.headers;
                const type = headers["content-type"] || "";
                let ext = ".bin";

                if (type.includes("video")) ext = ".mp4";
                else if (type.includes("image")) ext = ".jpg";
                else if (type.includes("audio")) ext = ".mp3";
                else if (type.includes("pdf")) ext = ".pdf";

                // ⭐ READ filename from Content-Disposition
                let originalName = "Unknown_File" + ext;

                if (headers["content-disposition"]) {
                    const match = headers["content-disposition"].match(/filename="(.+)"/);
                    if (match && match[1]) originalName = match[1];
                } else {
                    // fallback → get from URL
                    let extracted = url.split("/").pop().split("?")[0];
                    if (extracted) originalName = extracted;
                }

                // Remove weird characters
                originalName = originalName.replace(/[^a-zA-Z0-9.\-_ ]/g, "_");

                if (!originalName.includes(".")) originalName += ext;

                const finalFileName = `ᴅᴇɴᴇᴛʜ-ᴍᴅ | ${originalName}`;

                const fullPath = tempPath + ext;

                fs.writeFileSync(fullPath, response.data);

                await sock.sendMessage(m.chat, { react: { text: "⬆️", key: m.key } });

                await sock.sendMessage(
                    m.chat,
                    {
                        document: fs.readFileSync(fullPath),
                        fileName: finalFileName,
                        mimetype: type,
                        jpegThumbnail: thumbBuffer || undefined,
                        caption: `*Your File Has Been Downloaded! ✅*\n> 𝔇𝔢𝔳𝔢𝔩𝔬𝔭𝔢𝔡 𝔟𝔶 𝔇𝔢𝔫𝔢𝔱𝔥𝔇𝔢𝔳®`,
                    },
                    { quoted: m }
                );

                fs.unlinkSync(fullPath);

                await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

            } catch (err) {
                console.log("Download Error:", err);
                await reply(`❌ Failed to download:\n${url}`);
                await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            }
        }
    }
};
