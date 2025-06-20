import { v4 as uuidv4 } from 'uuid';

const relay_url = "wss://relay.nostr.watch/"
const filter = {
    kinds:[30166],
    // from: Date.now() - (60 * 60 * 24),
    limit: 10,
}
console.log("filter")
console.log(JSON.stringify(filter))

const wsListen = new WebSocket(relay_url)
wsListen.addEventListener('open', async (event) => {
    console.log("EVENT_EVENT_EVENT")
    console.log(event)
    let filter_uuid = String(uuidv4())
    let filter_data = `["REQ","${filter_uuid}",${ JSON.stringify(filter) }]`
    console.log("filter_data")
    console.log(filter_data)
    wsListen.send(filter_data)
})
wsListen.addEventListener('message', async (event) => {
    console.log(event.data)
    // console.log(JSON.stringify(JSON.parse(event.data), null, 2) + "\n\n")
})
