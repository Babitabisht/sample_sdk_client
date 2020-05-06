# Hyperledger Fabric network setup with 3 Peer and 1 Orderer and a Node SDK Client 

Pre Requisite - Hyperledger Binaries and HLF Pre-Requisites software are installed

# Following are the steps to run the setup
1. create a working folder, change directory to working folder
2. git clone https://github.com/ashwanihlf/sample_sdk_client.git
3. sudo chmod -R 755 sample_sdk_client/
4. cd sample_sdk_client
5. sudo chmod 755 -R app
6. cd app
7. sudo npm install 
-- Make sure you do not get any error here --
-- your sample_3PeerNetwork should be up and running --
-- Also check the private key path and file name in initCar.js and readCar.js, if required change that --
8. sudo node ./initCar.js Ashwani BMW Blue
9. sudo node ./readCar.js Ashwani


-- Additional commands in case you see errors --
sudo chmod 777 node_modules
sudo npm install --force -g node-gyp