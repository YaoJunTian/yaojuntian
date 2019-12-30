const shell = require('shelljs');
const Rsync = require('rsync');
const chalk = require('chalk');
const argv = require('yargs').argv;
const {
  join
} = require('path');

function WXmessage(message) {
  shell.exec(`curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b0d94e6f-208f-43e5-afac-8f135dd34676' -H 'Content-Type: application/json' -d '{"msgtype": "text","text": {"content": "${message}"}}'`)
}
const [host_name] = argv._;
const host_map = {
  yaojuntian: 'yaojuntian:/projects/html/',
  yaojuntian25: 'yaojuntian25:/projects/html/'
}
if (!host_name || !host_map[host_name]) {
  console.log(`${chalk.bgRed('Error')} ${chalk.red('未查找到您想部署的服务器')}`)
  console.log(chalk.blue('服务器列表：'));
  console.log(Object.keys(host_map))
  shell.exit(1);
}

//发通知
WXmessage(`正在构建项目到${host_name}`)
//安装依赖
console.log(`${chalk.blue(' 🚄 开始安装依赖')}`)
if (shell.exec('yarn').code !== 0) {
  console.log(`${chalk.bgRed('Error')} ${chalk.red('阿欧~安装依赖失败,请检查yarn命令或网络环境！')}`)
  shell.exit(1);
} else {
  console.log(`${chalk.green(' 😎 安装依赖成功')}`)
}
// //测试
// if (shell.exec('yarn run test').code !== 0) {
//   shell.echo('阿欧~测试未通过,请检查您的代码！');
//   shell.exit(1);
// }
//构建
console.log(`${chalk.blue(' 📂 开始构建')}`)
if (shell.exec('yarn run prod').code !== 0) {
  console.log(`${chalk.bgRed('Error')} ${chalk.red('阿欧~构建失败，请检查构建相关配置！')}`)
  shell.exit(1);
} else {
  console.log(`${chalk.green(' 😎 构建成功')}`)
}
//部署
console.log(`${chalk.blue(' 📤 开始部署')}`)
const rsync = Rsync.build({
  source: join(__dirname, '../dist/*'),
  destination: host_map[host_name],
  flags: 'avz',
  shell: 'ssh'
});
rsync.execute((error, code, cmd) => {
  if (code) {
    console.log(`${chalk.bgRed('Error')} ${chalk.red('阿欧~部署到服务器失败，请检查网络与服务器配置！')}`)
  } else {
    console.log(`${chalk.green(' 😎 部署成功')}`)
    WXmessage(`${host_name}已完成部署`)
  }
});