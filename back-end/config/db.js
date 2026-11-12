import "dotenv/config";
import mysql from "mysql2";

const obrigatorias = ["DB_HOST", "DB_USER", "DB_NAME"];
const ausentes = obrigatorias.filter((chave) => !process.env[chave]);

if (ausentes.length) {
    throw new Error(`Configure as variáveis no arquivo .env: ${ausentes.join(", ")}`);
}

const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    charset: "utf8mb4"
});

export default conexao;
