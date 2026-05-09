const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const { run } = require("./agents/newsAgent");

run();
