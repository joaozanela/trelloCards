import "dotenv/config";
import axios from "axios";
import { openDB } from "./cardsDB.js";
const db = openDB();

const apiKey = process.env.apiKey_DB;
const apiToken = process.env.apiToken_DB;
const idBoard = process.env.idBoard_DB;
const coluna02 = process.env.coluna02_DB;
const coluna05 = process.env.coluna05_DB;

const trelloApi = axios.create({
  baseURL: "https://api.trello.com/1",
  params: {
    key: apiKey,
    token: apiToken,
  },
});

try {
  const response1 = await trelloApi.get(`/boards/${idBoard}/cards`);
  const cards = response1.data;

  for (const card of cards) {
    const card_id = card.id;
    const card_name = card.name;
    const list_id = card.idList;
    const now = new Date(card.dateLastActivity);
    const period = now.toLocaleString("pt-BR", {
      format: "DD/MM/YYYY HH:mm:ss",
    });

    const response2 = await trelloApi.get(`/cards/${card_id}/actions`);
    const actions = response2.data;

    const startAction = actions.find(
      (action) => action.data.listAfter && action.data.listAfter.id === coluna02
    );
    const endAction = actions.find(
      (action) => action.data.listAfter && action.data.listAfter.id === coluna05
    );

    if (startAction && endAction) {
      const startTime = new Date(startAction.date).getTime();
      const endTime = new Date(endAction.date).getTime();
      const cycleTime = endTime - startTime;

      const cycleTime2 = cycleTime / 1000;
      const cycle_time_secs = cycleTime2.toFixed(2);

      const sql1 = `INSERT INTO cards (period, card_id, card_name, list_id, cycle_time_secs) VALUES (?, ?, ?, ?, ?);`;
      db.run(sql1, [period, card_id, card_name, list_id, cycle_time_secs]);

      const sql2 = `INSERT INTO cards_avg (period, card_id, list_id, cycle_time_secs) VALUES (?, ?, ?, ?);`;
      db.run(sql2, [period, card_id, list_id, cycle_time_secs]);
    }
  }
  db.close((err) => {
    if (err) {
      console.error("Erro ao fechar o banco de dados:", err.message);
    } else {
      console.log("Conexão com o banco de dados encerrada com sucesso.");
    }
  });
} catch (error) {
  console.log(error);
}
