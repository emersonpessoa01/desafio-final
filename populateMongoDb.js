import mongoose from "mongoose"
import { promises} from "fs"
import dotenv from "dotenv"
dotenv.config();

const { readFile} = promises
const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Criando um arquivo .env na raiz da pasta 'utils' e
 * preencha os valores conforme o arquivo de
 * exemplo "".env.example"
 *
 * DB_CONNECTION
 */

console.log('Iniciando conexão ao MongoDB...');
(async () => {
  const { DB_CONNECTION } = process.env;
  try {
    await mongoose.connect(
      DB_CONNECTION,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Conectado ao MongoDb Atlas");
  } catch (err) {
    console.log("Erro ao conectar no MongoDB");
  }
})();

const { connection } = mongoose;

connection.once('open', () => {
  // console.log('Conectado ao MongoDB');
  recreateCollections();
});

const recreateCollections=async()=> {
  console.log('Eliminando as collections...');
  await dropCollections();

  console.log('Recriando as collections...');
  await createCollections();

  console.log('Preenchendo os documentos das collections...');
  await populateCollections();

  connection.close();
  console.log('Processamento finalizado!');
}

async function dropCollections(){
  const promiseTransactions = new Promise((resolve, reject) => {
    connection.db
      .dropCollection(TRANSACTIONS_COLLECTION)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        if (err.code === 26) {
          resolve();
          return;
        }

        reject(err);
      });
  });

  await Promise.all([promiseTransactions]);
}

async function createCollections() {
  const promiseTransactions = new Promise((resolve, reject) => {
    connection.db
      .createCollection(TRANSACTIONS_COLLECTION)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  await Promise.all([promiseTransactions]);
}

async function populateCollections() {
  const promiseTransactions = new Promise(async (resolve, reject) => {
    const stringArrayTransactions = await readFile(
      './official-db/transactionsArray.json',
      'utf-8'
    );

    const transactions = JSON.parse(stringArrayTransactions);

    connection.db
      .collection(TRANSACTIONS_COLLECTION)
      .insertMany(transactions)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  await Promise.all([promiseTransactions]);
}
