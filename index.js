const express = require('express');
const {Web3}  = require('web3');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; // Vous pouvez utiliser un port différent si nécessaire.

// Utilisation de body-parser pour analyser les données du corps des requêtes
app.use(bodyParser.json()); // Analyser les données au format JSON
app.use(bodyParser.urlencoded({ extended: true })); 
const { ethers } = require('ethers');

async function decodeTransactionInput(transactionHash, contractABI) {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Replace with your Ethereum node URL
    try {
        const transaction = await provider.getTransaction(transactionHash);

        if (transaction) {
            const inputData = transaction.data;
            const functionSignature = inputData.slice(0, 10); // Extract the function signature (first 4 bytes)

            // Iterate through the contract ABI to find a matching function
            for (const abiItem of contractABI) {
                if (abiItem.type === 'function') {
                    const fullFunctionSignature = ethers.utils.hexlify(ethers.utils.id(abiItem.name + '(' + abiItem.inputs.map(i => i.type).join(',') + ')')).slice(0, 10);
                   
                    if (fullFunctionSignature === functionSignature) {
                        const functionInterface = new ethers.utils.Interface([abiItem]);
                        const parsedFunction = functionInterface.parseTransaction({ data: inputData });

                        //const parsedData = functionInterface.decodeFunctionData(abiItem.name, inputData.slice(10));
                        const parsedData = functionInterface.decodeFunctionData(abiItem.name, inputData);
                        const { _pHStatus, _temperature} = parsedData;

                        const bigNumberValue = ethers.BigNumber.from(_temperature);
                        const temperature = bigNumberValue.toNumber();
                        
                        //console.log('Decoded data :', { _pHStatus, temperature});
                        //res.status(200).json({ _pHStatus, temperature});
                        return { _pHStatus, temperature};
                    }
                }
            }
            console.log('No matching function ABI found for the provided function signature.');
            return null;
        } else {
            console.log('Transaction not found.');
            return null;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}




app.get('/transactionData', async (req, res) => {
  console.log("req body : ", req.body);
  const transactionHash = req.body.transactionHash;
  //const contractABI = req.body.contractABI;
  // Example usage
//const transactionHash = '0x215fcb0e2e4c5d50becfad97e511748cbfb31269d9ebbd773f201c370df1d5da'; // Replace with the actual transaction hash
const contractABI = [{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Moulage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Emballage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"elementIndex","type":"uint256"},{"name":"processInstance","type":"address"}],"name":"workItemsFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"processInstanceFor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Salage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Distribution_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Salage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Depotage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Distribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"},{"name":"temperature","type":"uint256"}],"name":"Control_Point_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Egoutage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Tamisage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Tamisage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Egoutage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Caillage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"elementIndexFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"},{"name":"_pHStatus","type":"bool"},{"name":"_temperature","type":"uint256"}],"name":"Control_Point","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Caillage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_runtimeRegistry","type":"address"}],"name":"updateRuntimeRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"workitemId","type":"uint256"}],"name":"Depotage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Emballage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"elementIndex","type":"uint256"}],"name":"Moulage_start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"uint256"}],"name":"Control_Point_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Tamisage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Depotage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Caillage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Moulage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Egoutage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Salage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Emballage_Requested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Distribution_Requested","type":"event"}];
  const donnees = await decodeTransactionInput(transactionHash, contractABI)
  console.log("donnees : ", donnees);
  res.status(200).json(donnees);
  
}); 

app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
