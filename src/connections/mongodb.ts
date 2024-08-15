const { MongoClient } = require('mongodb');

async function fetchMongoDB(uri: string, databaseName: string, collectionName: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db(databaseName);

    const collection = database.collection(collectionName);

    const data = await collection.find({}).toArray();

    return data;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    await client.close();
  }
}

export default fetchMongoDB