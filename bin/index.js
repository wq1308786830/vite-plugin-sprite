#!/usr/bin/env node

const sprite = require("../lib/sprite");
const { MSG, Log} = require("../lib/utils");

const args = process.argv.slice(2)
async function main() {
  Log(MSG.start, { source: args[0], scale: args[1] })
  await sprite({ source: args[0], scale: +args[1] })
  Log(MSG.success)
}

main()
