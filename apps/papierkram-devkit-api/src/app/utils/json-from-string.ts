export function jsonFromString(text: string) {
  const regex = /[{[]{1}([,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis
  const matches = text.match(regex)
  return Object.assign({}, ...(matches?.map(m => JSON.parse(m)) || []))
}
