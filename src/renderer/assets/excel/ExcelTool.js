import XLSX from 'xlsx'

function exportTable (tableDom, opt) {
  let sheet = 'sheet1'
  let wb = XLSX.utils.table_to_book(tableDom, {sheet: sheet, raw: true})
  let ws = wb.Sheets[sheet]

  if (opt && opt.colBegin > 0) {
    for (let k in ws) {
      let v = ws[k]
      if (v.v && v.v.startsWith('check_box')) {
        v.v = ''
      }
    }
  }
  XLSX.writeFile(wb, 'nbooks.xlsx')
}

let ExcelTool = {exportTable}

export {
  ExcelTool
}
