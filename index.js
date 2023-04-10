// Import the API
const {ApiPromise, WsProvider} = require('@polkadot/api');
const fs = require('fs');

async function main() {
    const provider = new WsProvider("wss://rpc.polkadot.io");
    // Create our API with a default connection to the local node
    const api = await ApiPromise.create({ provider });

    // Subscribe to system events via storage
    await api.query.system.events((events) => {
        const event_length = `\nReceived ${events.length} events:`
        console.log(event_length);

        fs.writeFile('events.txt', event_length, {flag: 'a+'}, err => {
            if (err) {
                console.error(err);
            }
        });

        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
            // Extract the phase, event and the event types
            const {event, phase} = record;
            const types = event.typeDef;

            // Show what we are busy with
            const event_section = `\t${event.section}:${event.method}:: (phase=${phase.toString()})`
            const event_docs = `\t\t${event.meta.docs.toString()}`
            console.log(event_section);
            console.log(event_docs);

            fs.writeFile('events.txt', event_section, {flag: 'a+'}, err => {
                if (err) {
                    console.error(err);
                }
            });

            fs.writeFile('events.txt', event_docs, {flag: 'a+'}, err => {
                if (err) {
                    console.error(err);
                }
            });

            // Loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
                const event_types = `\t\t\t${types[index].type}: ${data.toString()}`;
                console.log(event_types);

                fs.writeFile('events.txt', event_types, {flag: 'a+'}, err => {
                    if (err) {
                        console.error(err);
                    }
                });

                const end_event = "\n\n\n====================================\n\n\n"
                fs.writeFile('events.txt', end_event, {flag: 'a+'}, err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        });
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(-1);
});