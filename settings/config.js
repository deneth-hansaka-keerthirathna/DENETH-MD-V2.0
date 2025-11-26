
// 漏 2025 Debraj. All Rights Reserved.
// respect the work, don鈥檛 just copy-paste.

const fs = require('fs')

const config = {
    owner: "Deneth Hansaka®",
    botNumber: "94740672009",
    setPair: "K0MRAID1",
    thumbUrl: "https://raw.githubusercontent.com/deneth-hansaka-keerthirathna/DENETH-Media/refs/heads/main/main2.jpg",
    session: "sessions",
    status: {
        public: true,
        terminal: true,
        reactsw: false
    },
    message: {
        owner: "no, this is for owners only",
        group: "this is for groups only",
        admin: "this command is for admin only",
        private: "this is specifically for private chat"
    },
    mess: {
        owner: 'This command is only for the bot owner!',
        done: 'Mode changed successfully!',
        error: 'Something went wrong!',
        wait: 'Please wait...'
    },
    settings: {
        title: "DENETH-MD V2",
        packname: 'DENETH-MD',
        description: "Developed by DenethDev®",
        author: 'https://github.com/deneth-hansaka-keerthirathna',
        footer: "饾棈饾柧饾梾饾柧饾梹饾棆饾柡饾梿: @official_kango"
    },
    newsletter: {
        name: "DENETH-MD",
        id: "0@newsletter"
    },
    api: {
        baseurl: "https://hector-api.vercel.app/",
        apikey: "hector"
    },
    sticker: {
        packname: "DENETH-MD",
        author: "DENETH-MD"
    }
}

module.exports = config;

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
