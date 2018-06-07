#!/usr/bin/env node
'use strict';
const program = require('commander');
const path = require('path');
const fs = require('fs');

class KeyStore{
	_buildFilePath(filename){
		var dirPath = process.env.KEY_STORE_PATH;
		if (!dirPath){
			return console.log("Set the KEY_STORE_PATH environment variable.");
		}
		return path.join(dirPath, filename);
	}

	_buildKeyStore(keyStoreFilePath){
		var keyStoreObj = null;
		if (!fs.existsSync(keyStoreFilePath)) {
			fs.writeFileSync(keyStoreFilePath, "{}");
		}
		return JSON.parse(fs.readFileSync(keyStoreFilePath, 'utf8'));
	}

	constructor() {
	    this.id = 'id_1';
	    this.filePath = this._buildFilePath('keystore.json');
	    this.keyStoreObj = this._buildKeyStore(this.filePath);
  	}

  	_write(){
  		fs.writeFileSync(this.filePath, JSON.stringify(this.keyStoreObj));
  	}

  	_inferType(myvalue){
  		try {
        	return typeof JSON.parse(myvalue);
	    } catch (e) {
	        return 'string';
	    }
  	}

	add(mykey, myvalue){
		var type = this._inferType(myvalue);
		this.keyStoreObj[mykey] = {
			"type": type,
			"value": myvalue
		};
		this._write();
		return true;
	}

	list(){
		return this.keyStoreObj;
	}

	get(mykey){
		if (this.keyStoreObj[mykey]){
			return this.keyStoreObj[mykey]['value'];
		}
	}

	remove(mykey){
		if (this.keyStoreObj[mykey]){
			delete this.keyStoreObj[mykey];
			this._write();
			return true;
		} else {
			return false;
		}
	}

}

program
  .version('0.0.1');

program
  .command('add <mykey> <myvalue>')
  .description('Add a key/value pair to the key/value store.')
  .action(function(mykey, myvalue){
    console.log((new KeyStore()).add(mykey, myvalue));
  });

program
  .command('list')
  .description('List the key/value store.')
  .action(function(){
  	console.log((new KeyStore()).list());
  });

program
  .command('get <mykey>')
  .description('Get a value by its key.')
  .action(function(mykey){
  	console.log((new KeyStore()).get(mykey));
  });

program
  .command('remove <mykey>')
  .description('Remove a key from the key/value store.')
  .action(function(mykey){
  	console.log((new KeyStore()).remove(mykey));
  });

program.parse(process.argv); // notice that we have to parse in a new statement.

