// Import the API
const {ApiPromise, WsProvider} = require('@polkadot/api');
const fs = require('fs');

async function main() {
    const provider = new WsProvider("wss://polkadot-rpc.dwellir.com");
    const api = await ApiPromise.create({provider});

    const all_events = []
    // Subscribe to system events via storage
    await api.query.system.events((events) => {
        const event_length = `\nReceived ${events.length} events:`
        console.log(event_length);

        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
            // Extract the phase, event and the event types
            const {event, phase} = record;
            const types = event.typeDef;

            const event_section = `${event.section}:${event.method}:: (phase=${phase.toString()})`;
            const event_docs = `${event.meta.docs.toString()}`;
            // console.log(JSON.stringify(event_section));
            // console.log(JSON.stringify(event_docs));

            all_events.push({event_section, event_docs});

            // console.log(`All events docs ${JSON.stringify(all_events)}`);

            // Loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
                const event_types = `${types[index].type}: ${data.toString()}`;
                console.log(event_types);

                all_events.push({event_types})
            });

            try {
                fs.writeFileSync('events.json', JSON.stringify(all_events, null, 2), {flag: 'a+'});
                console.log('Events saved to events.json');
            } catch (err) {
                console.log(err)
            }

        });
    });

    console.log(`All events ${JSON.stringify(all_events)}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(-1);
});