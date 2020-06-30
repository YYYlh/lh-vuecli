#!/usr/bin/env node

const { program } = require('commander')
const download = require('./src/gitclone/download')
const fetchSwagger = require('./src/swagger')
const process = require('process')

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

program
  .command('fetch <serverUrl>')
  .description('获取swagger服务数据')
  .action(function(serverUrl, { args }){
    
    const argsLen = args.length
    let needTags = []
    if (argsLen > 1) {
      needTags = args.slice(1)
    } else {
      needTags = null
    }
    fetchSwagger(serverUrl, needTags)
  })

program.parse(process.argv)