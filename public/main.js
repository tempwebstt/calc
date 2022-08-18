const m = ['(01) January', '(02) February', '(03) March', '(04) April', '(05) May', '(06) June', '(07) July', '(08) August', '(09) September', '(10) October', '(11) November', '(12) December']
const c = ['fa fas fa-exclamation-triangle text-danger', 'fas fa-hamburger', 'fa fa-bus', 'fas fa-dice', 'fa fa-medkit', 'fas fa-tshirt', 'fa fa-shopping-cart', 'fas fa-air-freshener', 'fa fa-paperclip', 'fa fa-bank', 'fa fa-tag']
const cc = ['Invalid option', 'Food', 'Transport', 'Entertainment', 'Medicine', 'Clothes', 'Groceries', 'Beauty/SPA', 'Stationery', 'Transaction', 'Uncategorized']

function changeCA() {
  var el = document.getElementById('preCA')
  var se = document.getElementById('category')
  el.innerHTML = `<i class="${c[parseInt(se.value)]} fa-fw"></i>`
}

function dotreplace(e) {
  var tmp = document.getElementById(e.target.id)
  tmp.value = tmp.value.replace(/,/g, '.')
}

function deci_check(e) {
  e = (e ? e : window.event)
  var val = document.getElementById(e.target.id).value
  var ind = val.substring(0, e.target.selectionStart) + e.key + val.substring(e.target.selectionStart, val.length);
  return ['0','1','2','3','4','5','6','7','8','9','0','-','.',','].includes(e.key) && ((ind.match(/^(-|)[0-9]+(\.|\,){0,1}[0-9]{0,2}$/gi) || []).length == 1)
}

function check_paste(e) {
  e = (e ? e : window.event)
  var elm = document.getElementById(e.target.id)
  var ind = elm.value.substring(0, e.target.selectionStart) + e.clipboardData.getData('Text') + elm.value.substring(e.target.selectionStart, elm.value.length);
  return ((ind.match(/^(-|)[0-9]+(\.|\,){0,1}[0-9]{0,2}$/gi) || []).length == 1)
}
