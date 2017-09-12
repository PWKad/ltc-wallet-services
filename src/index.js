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
          console.error('error: ',err);
          return;
        };
        console.log('Wallet Created. Share this secret with your copayers: ' + secret);
        fs.writeFileSync('./' + name + '.dat', client.export());
        res.status(200).send(secret);
      });
    });

    app.get('/open_wallet', (req, res, next) => {
      let text = fs.readFileSync('Irene.dat','utf8')
      let json = JSON.parse(text);

      try {
        client.import(text);
      } catch (e) {
        console.error('Corrupt wallet file - ', e);
      };

      client.openWallet((err, returnValue) => {
        if (err) throw err;
        res.send(returnValue);
      });
    }

    app.get('/get_new_address', (req, res, next) => {
      let text = fs.readFileSync('Irene.dat','utf8')
      client.import(text);

      try {
        client.import(text);
      } catch (e) {
        console.error('Corrupt wallet file - ', e);
      };

      client.openWallet((error, result) => {
        if (result.wallet.status == 'complete') {
          client.createAddress({}, (err, addr) => {
            if (err) {
              console.log('error: ', err);
              return;
            };
            res.send(addr);
            console.log('\nReturn:', addr)
          });
        } else {
          console.error('nope didnt work')
        }
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

