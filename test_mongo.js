const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db('trackar');
        await db.command({ ping: 1 });
        console.log('Database ping successful');
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await client.close();
    }
}

main();
