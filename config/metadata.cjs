const { author, version, description } = require('../package.json')

/**
 * This is the tampermonkey headers used to match which webpage to run the script on
 */

module.exports = {
    name: 'Open with VRCX',
    namespace: 'Violentmonkey Scripts',
    description: description,
    version: version,
    author: author,
    match: [
        "https://vrchat.com/home/*",
        "https://vrclist.com/*",
    ],
    require: [
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"
    ],
    'run-at': 'document-start'
}