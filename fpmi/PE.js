class PE {
    constructor(sheet) {
        this.sheet = sheet;
        this.lessons = XlsxService.findAllCells(sheet, 'Физическая культура');
    }
    // getGroups(pe) {
    //     let groups = [];
    //     const htmlService = HtmlService(this.html)
    //     let colspan = htmlService.getColspan(XLSX.utils.encode_cell({ c: pe.c, r: pe.r }));
    //     let properRow = 0;
    //     for (let i = 0; i < pe.r; i++) {
    //         if(!this.sheet[XLSX.utils.encode_cell({ c: pe.c, r: i })]) continue;
    //         if(this.sheet[XLSX.utils.encode_cell({ c: pe.c, r: i })].v.includes('группа')) {
    //             properRow = i;
    //             break;
    //         }
    //     }
    //     let j = pe.c
    //     for (let k = 0; k <= colspan; k++) {
    //         if(!this.sheet[XLSX.utils.encode_cell({ c: j, r: properRow })]) {
    //             j++;
    //             continue;
    //         }
    //         if(this.sheet[XLSX.utils.encode_cell({ c: j, r: properRow })].v.includes('группа')) {
    //             groups.push(this.sheet[XLSX.utils.encode_cell({ c: j, r: properRow })].v)
    //         }
    //         j++;
    //     }
    //     return groups;
    // }
    getRanges() {
        const htmlService = HtmlService(XLSX.utils.sheet_to_html(this.sheet, {editable:true}).replace("<table", '<table id="data-table" border="1"'))
        let ranges = []
        for (let pe of this.lessons) {
            let range = []
            let colspan = htmlService.getColspan(XLSX.utils.encode_cell({ c: pe.c, r: pe.r }));
            let i = pe.c;
            for(let k = 0; k < colspan; k++) {
                range.push(XLSX.utils.encode_cell({ c: i, r: pe.r}))
                i++
            }
            ranges.push(range)
        }
        return ranges
    }
    cellIsPE(ref) {
        let ranges = this.getRanges()
        for(let i = 0; i < ranges.length; i++) {
            for(let j = 0; j < ranges[i].length; j++) {
                if(ranges[i][j] === ref) {
                    return true;
                }
            }
        }
        return false;
    }
}