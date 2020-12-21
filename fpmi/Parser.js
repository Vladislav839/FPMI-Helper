class Parser {
    constructor(sheet, notes) {
        this.sheet = sheet;
        this.notes = notes;
    }

    clearUnusedInformation() {
        for(let i = 0; i < this.notes.length; i++) {
            if(this.notes[i].v === 'Физическая культура' && this.notes[i].t === 'лекция') {
                this.notes.splice(i, 1);
                i--;
            }
        }
    }
    getTime(row) {
        let col = XlsxService.findCell(this.sheet, '8.15-9.35').c;
        let i = row;
        if(this.sheet[XLSX.utils.encode_cell({ c: col, r: i })]) {
            return this.sheet[XLSX.utils.encode_cell({ c: col, r: i })].v
        } else {
            while(!this.sheet[XLSX.utils.encode_cell({ c: col, r: i })]) {
                i--
            }
            return this.sheet[XLSX.utils.encode_cell({ c: col, r: i })].v
        }
    }
    getClassesMap() {
        this.clearUnusedInformation()
        const map = new Map()
        for(let item of this.notes) {
            if(!map.has(this.getTime(item.r))) {
                map.set(this.getTime(item.r), [item])
            } else {
                map.get(this.getTime(item.r)).push(item)
            }
        }
        return map
    }
}