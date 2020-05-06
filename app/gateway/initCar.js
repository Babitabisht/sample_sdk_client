/**
 * Demonstrates the use of fabric node sdk for chaincode interaction
 */

const fs = require('fs');
const yaml = require('js-yaml');
// Import fabric-network classes
const { Gateway, FileSystemWallet,X509WalletMixin, DefaultEventHandlerStrategies, Transaction  } = require('fabric-network');

const CONNECTION_PROFILE_PATH = '../profiles/connection.yaml'
// Identity context used
const USER_ID = 'Admin@org1.example.com'
// Channel name
const NETWORK_NAME = 'mychannel'
// Chaincode
const CONTRACT_ID = "samplecc"

// Create an instance of the file system wallet
const wallet = new FileSystemWallet('./wallet');
const gateway = new Gateway();
var myArgs = process.argv.slice(2)
//console.log(myArgs)
if (myArgs.length !=3) {
	console.log("Enter three Arguments 'Name' 'Colour' 'Model'")
	process.exit(1)
} 	
main()

/**
 * Executes the functions for query & invoke
 */
async function main() {
    
	await addIdentityToWallet()
	await setupGateway()
    	let network = await gateway.getNetwork(NETWORK_NAME)
	const contract = await network.getContract(CONTRACT_ID);
	await submitTxnContract(contract)
}

/**
 * Queries the chaincode
 * @param {object} contract 
 */
async function addIdentityToWallet() {

    try {
        // hard coded path to read cert and key of Admin from sample_3PeerNetwork
		// check for private key file name, your generate command might have generated with a different name
		var certPath = "../../../sample_3PeerNetwork/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
        var cert = fs.readFileSync(certPath).toString();
        var keyPath = "../../../sample_3PeerNetwork/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ea5ef499a069aaa04cba3aa54e00917f3985687a1cc8384f280714d3b83b2176_sk"
		var key = fs.readFileSync(keyPath).toString();

    } catch (e) {
        console.log("Error reading certificate or key!!! ")
        process.exit(1)
    }

    let mspId = "Org1MSP"
    const identity = X509WalletMixin.createIdentity(mspId, cert, key);
    await wallet.import("Admin@org1.example.com", identity);
}

/**
 * Submit the transaction
 * @param {object} contract 
 */
async function submitTxnContract(contract){
    try{
        // Submit the transaction
        let response = await contract.submitTransaction('initCar', myArgs[0],myArgs[1],myArgs[2])
        console.log("Response= ",response.toString())
    } catch(e){
        // fabric-network.TimeoutError
        console.log(e)
    }
}

/**
 * Function for setting up the gateway
 * It does not actually connect to any peer/orderer
 */
async function setupGateway() {
    
    let connectionProfile = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
    const wallet = new FileSystemWallet('./wallet')
    let connectionOptions = {
        identity: USER_ID,
        wallet: wallet,
        discovery: { enabled: false, asLocalhost: true }
         , eventHandlerOptions: {
             strategy: null
         } 
    }
    await gateway.connect(connectionProfile, connectionOptions)
}




