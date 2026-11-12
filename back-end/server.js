import "dotenv/config";
import express from "express";
import cors from "cors";
import conexao from "./config/db.js";
import { textoValido, inteiroPositivo } from "./src/utils/validacoes.js";
import validarId from "./src/middlewares/validarId.js";
import tratarErro from "./src/middlewares/tratarErro.js";
import categoriaRoute from "./src/routes/categoriaRoute.js";
import enderecoRoute from "./src/routes/enderecoRoute.js";
import fornecedorRoute from "./src/routes/fornecedorRoute.js";
import itemPedidoRoute from "./src/routes/itemPedidoRoute.js";
import pagamentoRoute from "./src/routes/pagamentoRoute.js";
import pedidoRoute from "./src/routes/pedidoRoute.js";
import produtoRoute from "./src/routes/produtoRoute.js";
import usuarioRoute from "./src/routes/usuarioRoute.js";

const app = express();
const PORTA = Number(process.env.PORTA || 3000);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "BioStore está online!!" });
});

app.use("/categorias", categoriaRoute);

app.use("/enderecos", enderecoRoute);

app.use("/fornecedor", fornecedorRoute);

app.use("/itensPedido", itemPedidoRoute);

app.use("/pagamento", pagamentoRoute);

app.use("/pedido", pedidoRoute);

app.use("/produto", produtoRoute);

app.use("/usuario", usuarioRoute);



app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});
app.use(tratarErro);

conexao.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco:", erro.code || erro.message);
        process.exit(1);
    }
    console.log("Conectado ao banco biostore");
    const servidor = app.listen(PORTA, () => {
        console.log(`Servidor iniciado em http://localhost:${PORTA}`);
    });
    servidor.on("error", (erro) => {
        console.error("Erro ao iniciar servidor:", erro.code || erro.message);
        conexao.end(() => process.exit(1));
    });
});