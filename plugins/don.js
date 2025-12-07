const axios = require("axios");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

module.exports = {
    command: "down",
    description: "Download URLs and send as ZIP",
    category: "downloader",

    execute: async (sock, m, { args, reply }) => {
        if (!args.length)
            return reply("❗ *Give URLs to download*\nExample: down https://example.com/file.mp4");

        let urls = args;

        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const zipName = `DENETH-MD-Downloads-${Date.now()}.zip`;
        const zipPath = path.join(tempDir, zipName);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip");

        archive.pipe(output);

        await sock.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

        for (let url of urls) {
            try {
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

                let filename = "Unknown" + ext;

                if (headers["content-disposition"]) {
                    const match = headers["content-disposition"].match(/filename="(.+)"/);
                    if (match && match[1]) filename = match[1];
                } else {
                    let fallback = url.split("/").pop().split("?")[0];
                    if (fallback) filename = fallback;
                }

                filename = filename.replace(/[^a-zA-Z0-9.\-_ ]/g, "_");
                if (!filename.includes(".")) filename += ext;

                // Add file to ZIP
                archive.append(response.data, { name: filename });

            } catch (err) {
                console.log("Download Error:", err);
                await reply(`❌ Failed to download:\n${url}`);
            }
        }

        await archive.finalize();

        output.on("close", async () => {
            await sock.sendMessage(m.chat, { react: { text: "⬆️", key: m.key } });

            await sock.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync(zipPath),
                    fileName: "DENETH-MD-Downloads.zip",
                    mimetype: "application/zip",
                    caption: `*📦 All Files Downloaded & Zipped!*\n> 𝔇𝔢𝔳𝔢𝔩𝔬𝔭𝔢𝔡 𝔟𝔶 𝔇𝔢𝔫𝔢𝔱𝔥𝔇𝔢𝔳®`
                },
                { quoted: m }
            );

            fs.unlinkSync(zipPath);

            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        });
    }
};
