// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");
const HtmlReporter = require("protractor-beautiful-reporter");

exports.config = {
  allScriptsTimeout: 35000,
  specs: ["./e2e/**/*.e2e-spec.ts"],
   capabilities: {
    browserName: "chrome",
    chromeOptions: {
      binary: process.env.CHROME_BIN,
    },
  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function () {},
  },
  onPrepare() {
    require("ts-node").register({
      project: "e2e/tsconfig.e2e.json",
    });
    jasmine
      .getEnv()
      .addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "e2e/Reports/screenshots",
      }).getJasmine2Reporter()
    );
  },
};
