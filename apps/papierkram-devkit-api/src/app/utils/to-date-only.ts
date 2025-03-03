import { TimeFrame } from './time-frame'
import { formatDate } from 'date-fns'

export function toDateOnly(timeFrame: TimeFrame) {
  return {
    from: formatDate(timeFrame.from, 'yyyy-MM-dd'),
    to: formatDate(timeFrame.to, 'yyyy-MM-dd')
  }
}
