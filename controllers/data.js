import getAuthSheets from "../planilhas.js";

// Obtendo acesso a planilha
export const metedata = async (req, res) => {
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
}

// Obtendo os valores das linhas
export const getRows = async (req, res) => {
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

}

// Enviando dados 
export const addRow = async (req, res) => { 
    try {
        const {googleSheets, auth, spreadsheetId } = await getAuthSheets();
        const { values } = req.body;

        const row = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Página1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [values],
            },
        })

        res.send(row.data);
    } catch (error) {
        console.error('Erro ao adicionar valores:', error);
        res.status(500).send('Erro ao adicionar valores'); 
    }
}

// Atualizando dados
export const updateValue = async (req, res) => {
    try {
        const {googleSheets, auth, spreadsheetId } = await getAuthSheets();
        const { rowIndex, startColumn, endColumn, values } = req.body;
        
        const range = `Página1!${startColumn}${rowIndex}:${endColumn}${rowIndex}`;
        console.log(`Atualizando valores na planilha: ${spreadsheetId}, range: ${range}, valores: ${JSON.stringify(values)}`);

        const updateValue = await googleSheets.spreadsheets.values.update({
            auth,
            spreadsheetId,
            range: range,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [values],
            },
        });

        res.send(updateValue.data);

    } catch (error) {
        console.error('Erro ao atualizar os valores:', error);
        res.status(500).send('Erro ao atualizar os valores'); 
    }
}

// Deletando dados
export const deleteValue = async (req, res) => {
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
}
