saveAsFile(data) {
  var FileSaver = require('file-saver');
  var content = JSON.stringify(data);
  var blob = new Blob([content], {
    type: "text/plain;charset=utf-8"
  });
  FileSaver.saveAs(blob, "hello world.json");
}