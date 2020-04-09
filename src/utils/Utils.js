import { months } from '../constants'

export const formatTime = (seconds) => {
    var sec_num = parseInt(seconds); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    if (hours > 0)
        return hours + ':' + minutes + ':' + seconds;
    else
        return minutes + ':' + seconds;
}

export function formatDuration(duration) {
    // Takes duration as minutes and return as a readible, rounded time format
    // Can be used to show remaining duratoin or duration for an event 
    
    if (duration == 0)
        return ''

    if (duration < 60)
        return duration + ' min'

    let hours = Math.floor(duration / 60)
    let minutes = duration - (hours * 60)
    minutes = minutes > 0 ? ` ${minutes} min` : ''

    if (hours < 24)
        return `${hours} hr${minutes}`

    let days = Math.floor(hours / 24)
    hours = hours - (days * 24)
    hours = hours > 0 ? ` ${hours} hr` : ''

    if (days < 7)
        return `${days} day${hours}`

    let weeks = Math.floor(days / 7)
    days = days - (weeks * 7)
    days = days > 0 ? ` ${days} day` : ''

    return `${weeks} week${days}`
}

export function addZeroToTime(time) {
    if (time < 10) {
        time = '0' + time
    }
    return time
}

export function splitDate(dateObj) {
    // Takes date object and return {date, time, gmt} object

    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()
    const day = dateObj.getDate()
    const hour = addZeroToTime(dateObj.getHours())
    let minutes = addZeroToTime(dateObj.getMinutes())

    let gmt = dateObj.getTimezoneOffset() / -60
    gmt = gmt >= 0 ? `+${gmt}` : `-${gmt}`
    const date = day + ' ' + month + ' ' + year
    const time = hour + ':' + minutes
    return { date, time, gmt }
}