function getNextDay(day) {
  switch(day) {
    case "понедельник":
      return "вторник";
    case "вторник":
      return "среда";
    case "среда":
      return "четверг";
    case "четверг":
      return "пятница";
    case "пятница":
      return "суббота";
    case "суббота":
      return "воскресенье";
  }
}

const fetchData = (url, group, day) => {
  fetch(url).then(function(res) {
  if(!res.ok) throw new Error("fetch failed");
  return res.arrayBuffer();
}).then(function(ab) {
  let data = new Uint8Array(ab);
  let workbook = XLSX.read(data, {type:"array"});
  let sheet = workbook.Sheets[workbook.SheetNames[0]];
  let notes = XlsxService.getUniqueNotesPerGroupAndDay(sheet, group + " группа", day, getNextDay(day));
  const parser = new Parser(sheet, notes)
  const table = drawTable(parser.getClassesMap())
  document.getElementById('main-area').innerHTML = table;
});
}


function handleFile(e) {
  let files = e.target.files, f = files[0];
  let reader = new FileReader();
  reader.onload = function(e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, {type: 'array'});
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    let notes = XlsxService.getUniqueNotesPerGroupAndDay(sheet, '4 группа', 'понедельник', 'вторник');
    const parser = new Parser(sheet, notes)
    parser.clearUnusedInformation()
    console.log(parser.getClassesMap())
    console.log(XlsxService.getNumberOfLastGroup(sheet))
  };
  reader.readAsArrayBuffer(f);
}


// let inp = document.getElementsByTagName('input')[0]
// inp.addEventListener('change', handleFile)
