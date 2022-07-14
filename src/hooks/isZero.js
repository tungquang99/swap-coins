export default function isZero(hexNumberString) {
    return /^0x0*$/.test(hexNumberString)
  }