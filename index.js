#!/usr/bin/env node

/*
A simple keystore CLI application that uses a JSON file on disk to store the data.

Remember to set the KEY_STORE_PATH environment variable.

Installation:
npm install -g

Example usage: 

KEY_STORE_PATH=/home/tucker/dev/challenge-one/ store list
KEY_STORE_PATH=/home/tucker/dev/challenge-one/ store add hello [1,2,3,4]
KEY_STORE_PATH=/home/tucker/dev/challenge-one/ store get hello 
KEY_STORE_PATH=/home/tucker/dev/challenge-one/ store remove hello 

Author: Tucker Buchy
*/


'use strict';
const program = require('commander');
const path = require('path');
const fs = require('fs');

class KeyStore{
	/*
	A KeyStore class used to represent a KeyStore. 
	This one is backed by a JSON file that is defined through the environment 
	variable KEY_STORE_PATH. 
	*/

	_buildFilePath(filename){
		/*
		Builds the file path for where the key/store JSON file is stored.
		@param {string} filename: The name of the file.
		@return {string} The full path of the key/store file.
		*/
		var dirPath = process.env.KEY_STORE_PATH;
		if (!dirPath){
			throw new Error("Set the KEY_STORE_PATH environment variable.");
		}
		return path.join(dirPath, filename);
	}

	_buildKeyStore(keyStoreFilePath){
		/*
		Builds the key/store object from the file path.
		@param {string} keyStoreFilePath: The path to the key/store file.
		@return {object} The JSON object representing the key/store.
		*/
		var keyStoreObj = null;
		if (!fs.existsSync(keyStoreFilePath)) {
			fs.writeFileSync(keyStoreFilePath, "{}");
		}
		return JSON.parse(fs.readFileSync(keyStoreFilePath, 'utf8'));
	}

	constructor() {
	    this.filePath = this._buildFilePath('keystore.json');
	    this.keyStoreObj = this._buildKeyStore(this.filePath);
  	}

  	_write(){
		/*
		Helper function to write changes in the key/store to the disk.
		*/
  		fs.writeFileSync(this.filePath, JSON.stringify(this.keyStoreObj));
  	}

  	_inferType(myvalue){
  		/*
		Helper function to infer the type of the value passed in.
		@param myvalue: The value we want to determine the type of.
		@return {string}: The NodeJS type.
  		*/
  		try {
        	return typeof JSON.parse(myvalue);
	    } catch (e) {
	        return 'string';
	    }
  	}

	add(mykey, myvalue){
		/*
		Add a key/value pair to the key/store and persist the change.

		If the key is already in the store, overwrite it.
		@param mykey: The key we are storing
		@param myvalue: The associated value.
		@return {boolean} True on success.
		*/
		var type = this._inferType(myvalue);
		this.keyStoreObj[mykey] = {
			"type": type,
			"value": myvalue
		};
		this._write();
		return true;
	}

	list(){
		/*
		List all key/values in the keystore. 

		@return the string-version of the key/store.
		*/
		return JSON.stringify(this.keyStoreObj);
	}

	get(mykey){
		/*
		Gets a value based on the key from the keystore.

		@param mykey: The key we want the value for.
		@return The value associated with the key, or undefined if the key does not exist.
		*/
		if (this.keyStoreObj[mykey]){
			return this.keyStoreObj[mykey]['value'];
		}
	}

	remove(mykey){
		/*
		Removes a key/value pair from the keystore, and persists the change.

		@param mykey: The key we wish to remove.
		@return {boolean} True if the remove was successful, False if the key does not exist.
		*/
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

program.parse(process.argv); 
if (program.args.length === 0) program.help();