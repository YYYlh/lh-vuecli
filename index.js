#!/usr/bin/env node

const { program } = require('commander')
const download = require('./src/download')

program
  .version('0.1.0')
  

program
  .command('create <projectName>')
  .description('初始化项目')
  .action(function(projectName){
    // 从git上拉取代码模板
    download(projectName, (err) => {
        console.log(err);
    })
  })

program.parse(process.argv)