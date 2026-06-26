import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Override Node's DNS servers to resolve querySrv ECONNREFUSED on local networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('[DNS Warning] Failed to set public DNS servers:', e.message);
}


const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acowale-crm';
    
    // Set strictQuery to prepare for Mongoose upgrades
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Error: ${error.message}`);
    // Do not crash the process in development/production if DB is temporarily down,
    // let mongoose attempt reconnections, but print error.
    process.exit(1);
  }
};

export default connectDB;
