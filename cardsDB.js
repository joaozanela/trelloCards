import sqlite3 from "sqlite3";

let db;

export function openDB() {
  // Crie uma conexão com o banco de dados SQLite3
  const db = new sqlite3.Database("cardsDB.db");

  // Crie a tabela cards
  const sql1 = `CREATE TABLE IF NOT EXISTS cards (
    card_id STRING PRIMARY KEY,
    card_name TEXT,
    period DATETIME,
    list_id TEXT,
    cycle_time_secs INTEGER DEFAULT 0
  );`;
  db.exec(sql1);

  // Crie a tabela cards_avg
  const sql2 = `CREATE TABLE IF NOT EXISTS cards_avg (
    card_id STRING PRIMARY KEY,
    period DATETIME,
    list_id TEXT,
    cycle_time_secs INTEGER DEFAULT 0
  );`;
  db.exec(sql2);

  return db;
}
