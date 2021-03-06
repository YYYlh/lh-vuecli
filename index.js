#!/usr/bin/env node

const { program } = require('commander')
const download = require('./src/gitclone/download')
const fetchSwagger = require('./src/swagger')
const generateVue = require('./src/generate_vue')
const process = require('process')

program
  .version('1.0.2')

program
  .command('create <projectName>')
  .description('初始化项目')
  .action(function(projectName){
    // 从git上拉取代码模板
    download(projectName)
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

program
  .command('g [type] <name>')
  .description('创建vue文件')
  .action(function(type, name){
    generateVue(type, name)
  })

program.parse(process.argv)