const { MongoClient } = require('mongodb');

async function removeUsernameIndex() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('test');
    const collection = db.collection('users');
    
    await collection.dropIndex('username_1');
    console.log('Successfully dropped username index');
  } catch (error) {
    if (error.code === 27) {
      console.log('Index does not exist - this is fine');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await client.close();
  }
}

removeUsernameIndex();
