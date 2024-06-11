const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })

    const client = await auth.getClient();

    // Conexão com o google sheets
    const googleSheets = google.sheets({
        version: "v4",
        auth: client,
    });

    const spreadsheetId = '1ns87fsrOGXw755udA-nL9L4X8awcU606IafyG1UJBDg';

    return {auth, client, googleSheets, spreadsheetId}
}

// Obtendo acesso a planilha
app.get("/metadata", async (req, res) => {
    try {
        const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

        const metadata = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId
        })

        res.send(metadata.data);
    } catch (error) {
        console.error('Erro ao obter metadados:', error);
        res.status(500).send('Erro ao obter metadados');
    }
})

// Obtendo os valores das linhas
app.get("/getRows", async (req, res) => {
    try {
        const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "Página1",
            valueRenderOption: "UNFORMATTED_VALUE",
            dateTimeRenderOption: "FORMATTED_STRING",
        })

        res.send(getRows.data);
    } catch (error) {
        console.error('Erro ao obter metadados:', error);
        res.status(500).send('Erro ao obter metadados');
    }

})

// Enviando dados 
app.post("/addRow", async (req, res) => { 
    try {
        const {googleSheets, auth, spreadsheetId } = await getAuthSheets();
        const { values } = req.body;

        const row = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Página1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: values,
            },
        })

        res.send(row.data);
    } catch (error) {
        console.error('Erro ao adicionar valores:', error);
        res.status(500).send('Erro ao adicionar valores'); 
    }
})

// Atualizando dados
app.put("/updateValue", async (req, res) => {
    try {
        const {googleSheets, auth, spreadsheetId } = await getAuthSheets();
        const { rowIndex, startColumn, endColumn, values } = req.body;
        
        const updateValue = await googleSheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Página1!${startColumn}${rowIndex}:${endColumn}${rowIndex}`,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: values,
            },
        });

        res.send(updateValue.data);

    } catch (error) {
        console.error('Erro ao atualizar os valores:', error);
        res.status(500).send('Erro ao atualizar os valores'); 
    }
});

// Deletando dados
app.delete("/deleteValue", async (req, res) => {
    try {
        const { googleSheets, spreadsheetId} = await getAuthSheets();
        const { range } = req.body;

        const clear = await googleSheets.spreadsheets.values.clear({
            spreadsheetId,
            range,
        });

        res.send(clear.data);
    } catch (error) {
        console.error('Erro ao deletar os valores:', error);
        res.status(500).send('Erro ao deletar os valores'); 
    }
})


app.listen(3001, () => console.log("rodando na porta 3001"));
 