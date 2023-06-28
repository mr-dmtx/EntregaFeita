import SQLITE from 'react-native-sqlite-storage';

export const db = SQLITE.openDatabase(
  {
    name: 'entregas.db',
    location: 'default',
  },
  () => {createTable()},
  error => {
    console.error('Erro abrir db', error);
  }
);

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS  entrega (
        id	INTEGER,
        lat	REAL,
        lon	REAL,
        distancia	REAL,
        horario	STRING,
        endereco	TEXT,
        PRIMARY KEY(id AUTOINCREMENT)
      )`, [],
      (tx, result) => {
        console.log('Tabela criada!')
      },
      error => {
        console.log('error ao cria', error)
      }
    );
  })
};
