import Client from 'bitcore-wallet-client';
import fs from 'fs';

const BWS_INSTANCE_URL = 'http://localhost:3232/bws/api';

var client = new Client({
  baseUrl: BWS_INSTANCE_URL,
  verbose: false,
});

export default class WalletService {
  static dependencies = [];

  start(callback) {
    setImmediate(callback);
  }
  stop(callback) {
    setImmediate(callback);
  }
  setupRoutes(app, express) { 
    app.get('/get_new_wallet', (req, res, next) => { 
      let name = 'Irene';

      client.createWallet("My Wallet", name, 2, 2, {network: 'testnet'}, function(err, secret) {
        if (err) {
          console.log('error: ',err);
          return;
        };
        console.log('Wallet Created. Share this secret with your copayers: ' + secret);
        fs.writeFileSync('./' + name + '.dat', client.export());
      	res.status(200).send(secret);
      });
    });

    app.get('/open_wallet', (req, res, next) => {
      let text = fs.readFileSync('Irene.dat','utf8')

      client.import(text);

      client.openWallet((error, result) => {
        console.log(error);
        console.log(result);
	res.send(result);
      });
    });

    app.get('/get_new_address', (req, res, next) => { 
      let text = fs.readFileSync('Irene.dat','utf8')
	      console.log('-'.repeat(100))
      console.log (text)
      client.import(text);

      client.openWallet((error, result) => {
	      console.log('-'.repeat(100))
        console.error(error);
        console.log(result);

        client.createAddress({}, (err, address) => {
		console.error(err);
	      console.log('-'.repeat(100))
		      console.log('created')
	  console.log(address);
      	  res.status(200).send(address);
        });
      });
    });
  }
  getRoutePrefix() { 
    return 'wallet-service';
  }
  getAPIMethods() {
    return [];
  }
  getPublishEvents() {
    return [];
  }
}

