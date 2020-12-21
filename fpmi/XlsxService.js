class XlsxService {
  static pushIfNotExist(array, element) {
    for (let item of array) {
      if(item.v === element.v) {
        return
      }
    }
    array.push(element)
  }
  static compareByCol(cell1, cell2) {
    if (XLSX.utils.encode_cell({ c: cell1.c, r: cell1.r }).length === XLSX.utils.encode_cell({ c: cell2.c, r: cell2.r }).length) {
      if (cell1.c > cell2.c) {
        return 1;
      } else if (cell1.c < cell2.c) {
        return -1;
      } else {
        return 0
      }
    } else {
      if (XLSX.utils.encode_cell({ c: cell1.c, r: cell1.r }).length > XLSX.utils.encode_cell({ c: cell2.c, r: cell2.r }).length) {
        return 1;
      } else {
        return -1;
      }
    }
  }
  static findCell(sheet, string, includes = false) {
    let range = XLSX.utils.decode_range(sheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cellref = XLSX.utils.encode_cell({ c: C, r: R });
        if (!sheet[cellref]) continue;
        if (typeof sheet[cellref].v === 'string') {
          if (includes) {
            if (sheet[cellref].v.includes(string)) {
              return XLSX.utils.decode_cell(cellref)
            }
          }
          if (sheet[cellref].v === string) {
            return XLSX.utils.decode_cell(cellref)
          }
        }
      }
    }
  }
  static findAllCells(sheet, string, includes = false) {
    let range = XLSX.utils.decode_range(sheet['!ref']);
    let cells = []
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cellref = XLSX.utils.encode_cell({ c: C, r: R });
        if (!sheet[cellref]) continue;
        if (typeof sheet[cellref].v === 'string') {
          if (includes) {
            if (sheet[cellref].v.includes(string)) {
              cells.push(XLSX.utils.decode_cell(cellref))
            }
          } else {
            if (sheet[cellref].v === string) {
              cells.push(XLSX.utils.decode_cell(cellref))
            }
          }
        }
      }
    }
    return cells;
  }
  static getSaturdayNotes(sheet, group) {
    const notes = [];
    const htmlService = HtmlService(XLSX.utils.sheet_to_html(sheet, { editable: true }).replace("<table", '<table id="data-table"'))
    let gr = XlsxService.findCell(sheet, group);
    let begin = XlsxService.findCell(sheet, 'суббота');
    let end = XlsxService.findCell(sheet, 'Декан', true);
    const pe = new PE(sheet);
    for (let i = begin.r; i < end.r; i++) {
      if(pe.cellIsPE(XLSX.utils.encode_cell({ c: gr.c, r: i }))) {
        notes.push({
          v: 'Физическая культура',
          r: i,
          t: "практика"
        })
      }
      if (!sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })]) {
        let spec = XlsxService.getGroupSpecialtyNumber(sheet, group)
        let firstGroup = XlsxService.findCell(sheet, XlsxService.getSpecialtyFirstGroup(sheet, spec))
        if (!sheet[XLSX.utils.encode_cell({ c: firstGroup.c, r: i })]) continue;
        if (htmlService.isLecture(XLSX.utils.encode_cell({ c: firstGroup.c, r: i }),
          XlsxService.calculateNumberOfGroupsPerSpecialty(sheet, spec))) {
          notes.push({
            v: sheet[XLSX.utils.encode_cell({ c: firstGroup.c, r: i })].v,
            r: i,
            t: "лекция"
          })
          let regex = /[А-Я].[А-Я]./
          if (regex.test(sheet[XLSX.utils.encode_cell({ c: firstGroup.c, r: i })].v)) {
            let j = firstGroup.c;
            while (!sheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })]) {
              j++;
            }
            notes.push({
              v: sheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })].v,
              r: i + 1,
              t: "лекция"
            })
          }
          continue
        }
      }
      if (!sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })]) continue;
      notes.push({
        v: sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })].v,
        r: i,
        t: "практика"
      })
      if (!sheet[XLSX.utils.encode_cell({ c: gr.c + 1, r: i })]) {
        continue
      }
      notes.push({
        v: sheet[XLSX.utils.encode_cell({ c: gr.c + 1, r: i })].v,
        r: i,
        t: "практика"
      })
    }
    return notes
  }
  static getUniqueNotesPerGroupAndDay(sheet, group, day, nextDay) {
    const notes = [];
    const htmlService = HtmlService(XLSX.utils.sheet_to_html(sheet, { editable: true }).replace("<table", '<table id="data-table"'))
    let gr = XlsxService.findCell(sheet, group);
    let begin = XlsxService.findCell(sheet, day);
    if (day === 'суббота') {
      XlsxService.getSaturdayNotes(sheet, group);
    } else {
      let end = XlsxService.findCell(sheet, nextDay);
      const pe = new PE(sheet);
      for (let i = begin.r; i < end.r; i++) {
        if(pe.cellIsPE(XLSX.utils.encode_cell({ c: gr.c, r: i }))) {
          notes.push({
            v: 'Физическая культура',
            r: i,
            t: "практика"
          })
        }
        if (!sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })]) {
          let spec = XlsxService.getGroupSpecialtyNumber(sheet, group)
          let firstGroup = XlsxService.findCell(sheet, XlsxService.getSpecialtyFirstGroup(sheet, spec))
          if (!sheet[XLSX.utils.encode_cell({ c: firstGroup.c, r: i })]) continue;
          if (htmlService.isLecture(XLSX.utils.encode_cell({ c: firstGroup.c, r: i }))) {
            notes.push({
              v: sheet[XLSX.utils.encode_cell({ c: firstGroup.c, r: i })].v,
              r: i,
              t: "лекция"
            })
            let regex = /[А-Я]\.[А-Я]\./
            if (regex.test(sheet[XLSX.utils.encode_cell({ c: firstGroup.c, r: i })].v)) {
              let j = firstGroup.c;
              while (!sheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })]) {
                j++;
              }
              notes.push({
                v: sheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })].v,
                r: i + 1,
                t: "лекция"
              })
            }
            continue
          }
        }
        if (!sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })]) {
          if (sheet[XLSX.utils.encode_cell({ c: gr.c + 1, r: i })]) {
            notes.push({
              v: sheet[XLSX.utils.encode_cell({ c: gr.c + 1, r: i })].v,
              r: i,
              t: "практика"
            })
          }
          continue
        }
        if(htmlService.isLecture(XLSX.utils.encode_cell({ c: gr.c, r: i }), null)) {
          notes.push({
            v: sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })].v,
            r: i,
            t: "лекция"
          })
          let regex = /[А-Я]\.[А-Я]\./
          if (regex.test(sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })].v)) {
            let j = gr.c;
            while (!sheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })]) {
              j++;
            }
            notes.push({
              v: sheet[XLSX.utils.encode_cell({ c: j, r: i + 1 })].v,
              r: i + 1,
              t: "лекция"
            })
          }
          continue
        }
        notes.push({
          v: sheet[XLSX.utils.encode_cell({ c: gr.c, r: i })].v,
          r: i,
          t: "практика"
        })
        if (!sheet[XLSX.utils.encode_cell({ c: gr.c + 1, r: i })]) continue;
        notes.push({
          v: sheet[XLSX.utils.encode_cell({ c: gr.c + 1, r: i })].v,
          r: i,
          t: "практика"
        })
      }
    }
    return notes
  }
  static getSpecialtyFirstGroup(sheet, specialtyNumber) {
    let begin = XlsxService.findCell(sheet, specialtyNumber + ' поток', true);
    let i = begin.r + 1;
    // while(true) {
    //   i++;
    //   if(sheet[XLSX.utils.encode_cell({ c: begin.c, r: i})]) {
    //     if(sheet[XLSX.utils.encode_cell({ c: begin.c, r: i})].v.includes('группа')) {
    //       return sheet[XLSX.utils.encode_cell({ c: begin.c, r: i})].v
    //     }
    //   }
    // }
    if (sheet[XLSX.utils.encode_cell({ c: begin.c, r: begin.r + 4 })].v.includes('группа')) {
      return sheet[XLSX.utils.encode_cell({ c: begin.c, r: begin.r + 4 })].v
    }
    return sheet[XLSX.utils.encode_cell({ c: begin.c, r: begin.r + 5 })].v
  }
  static calculateNumberOfGroupsPerSpecialty(sheet, specialtNumber) {
    let end = XlsxService.findCell(sheet, specialtNumber + 1 + ' поток', true);
    let firstGroup = XlsxService.findCell(sheet, XlsxService.getSpecialtyFirstGroup(sheet, specialtNumber));
    let counter = 0;
    if (end) {
      for (let i = firstGroup.c; i < end.c; i++) {
        if (!sheet[XLSX.utils.encode_cell({ c: i, r: firstGroup.r })]) continue;
        counter++;
      }
      return counter;
    } else {
      let start = XlsxService.findCell(sheet, XlsxService.getSpecialtyFirstGroup(sheet, 4));
      while (sheet[XLSX.utils.encode_cell({ c: start.c, r: start.r })] ||
        sheet[XLSX.utils.encode_cell({ c: start.c + 1, r: start.r })]) {
        counter += 0.5;
        start.c++;
      }
      return Math.round(counter);
    }
  }
  static getGroupSpecialtyNumber(sheet, group) {
    let groupCell = XlsxService.findCell(sheet, group);
    let cells = XlsxService.findAllCells(sheet, 'поток', true);
    for (let i = cells.length - 1; i >= 0; i--) {
      if (XlsxService.compareByCol(groupCell, cells[i]) == 1 || XlsxService.compareByCol(groupCell, cells[i]) == 0) {
        return Number(sheet[XLSX.utils.encode_cell({ c: cells[i].c, r: cells[i].r })].v.substring(0, 1));
      }
    }
  }
  static getNumberOfLastGroup(sheet) {
    let begin = XlsxService.findCell(sheet, '1 группа')
    let i = begin.c
    while(sheet[XLSX.utils.encode_cell({ c: i, r: begin.r })] ||
    sheet[XLSX.utils.encode_cell({ c: i + 1, r: begin.r })] || 
    sheet[XLSX.utils.encode_cell({ c: i + 2, r: begin.r })] ||
    sheet[XLSX.utils.encode_cell({ c: i + 3, r: begin.r })] ||
    sheet[XLSX.utils.encode_cell({ c: i + 4, r: begin.r })]) {
      i++;
    }
    return sheet[XLSX.utils.encode_cell({ c: i - 1, r: begin.r })].v
  }
}