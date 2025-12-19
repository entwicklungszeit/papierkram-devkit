import { TimeFrame } from './time-frame'
import { formatRFC3339 } from 'date-fns'

export function toDateOnly(timeFrame: TimeFrame) {
  return {
    from: formatRFC3339(timeFrame.from),
    to: formatRFC3339(timeFrame.to)
  }
}
