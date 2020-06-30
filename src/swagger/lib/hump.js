// 将a-b ==> aB
module.exports = function(str) {
  const strArr = str.split('')
  for (let i = 0, len = strArr.length; i < len; i++) {
    if (strArr[i] === '-') {
      strArr[i + 1] = strArr[i + 1].toLocaleUpperCase()
    }
  }
  const formatArr = strArr.filter(item => item !== '-')
  return formatArr.join('')
}