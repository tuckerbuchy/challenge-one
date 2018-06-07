#!/usr/bin/env node
'use strict';
const program = require('commander');

program
  .version('0.0.1');

program
  .command('add <mykey> <myvalue>')
  .description('command description')
  .action(function(mykey, myvalue){
    console.log('User passed %s %s', mykey, myvalue);
  });

program
  .command('list')
  .description('command description')
  .action(function(){
  	console.log("list command");
  });

program
  .command('get <mykey>')
  .description('command description')
  .action(function(mykey){
  	console.log("get %s", mykey);
  });

program
  .command('remove <mykey>')
  .description('command description')
  .action(function(mykey){
  	console.log("remove %s", mykey);
  });

program.parse(process.argv); // notice that we have to parse in a new statement.