import chalk from "chalk";

const log = {
  success(type, ...args) {
    console.log(chalk.green(`[${type}]`), ...args);
  },
  info(type, ...args) {
    console.log(chalk.blue(`[${type}]`), ...args);
  },
  warn(type, ...args) {
    console.log(chalk.yellow(`[${type}]`), ...args);
  },
  error(type, ...args) {
    console.log(chalk.red(`[${type}]`), ...args);
  },
  loading() {
    const P = ["\\", "|", "/", "-"];
    let x = 0;
    const loader = setInterval(() => {
      process.stdout.write(`\r${P[x++]} Processing...`);
      x %= P.length;
    }, 250);
    return () => {
      clearInterval(loader);
      console.log("");
    };
  },
};

export default log;
