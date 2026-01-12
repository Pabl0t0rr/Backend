//Import variables Utils
import {port, urlMongo, dbName, trainersCollection, secret, pokemonsCollection, ownedPokemonsCollection} from "./utils";

export const checkEnvVars = () => {
  const requiredEnvs = {
    port: port,
    urlMongo: urlMongo,
    dbName: dbName,
    trainersCollection: trainersCollection,
    secret: secret,
    //Add exam variables
    pokemonsCollection : pokemonsCollection,
    ownedPokemonsCollection : ownedPokemonsCollection


  };

  const missingVars = Object.entries(requiredEnvs)
    .filter(([_, value]) => !value || value.toString().trim() === "")
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("Missing environment variables:");
    missingVars.forEach(v => console.error(`   - ${v}`));
    process.exit(1); //1 is for errors and 0 for success
  }

  console.log(" All environment variables loaded successfully");
};
