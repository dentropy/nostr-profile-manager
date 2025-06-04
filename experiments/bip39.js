import bip39 from 'bip39'

console.log(bip39.wordlists.english);

console.log(bip39.wordlists.english.includes(bip39.wordlists.english[0]))

console.log(bip39.wordlists.english.includes("FUCK"))

import fs from 'fs';
fs.writeFileSync('bip39-english.json', JSON.stringify(bip39.wordlists.english));