//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const bcrypt = require('bcryptjs');

function validDate(date) {
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) throw   'Date must be in the format MM/DD/YYYY';

    let parts = date.split("/");
    let day = parseInt(parts[1], 10);
    let month = parseInt(parts[0], 10);
    let year = parseInt(parts[2], 10);

    if(year < 1900 || year > new Date().getFullYear() + 2 || month == 0 || month > 12) throw 'Invalid date';

    let daysInMonth = new Date(year, month, 0).getDate();
    if(day < 1 || day > daysInMonth) throw 'Invalid date';

    return true;
}

function validTime (time) {
    if(!/^([1-9][0-9]|[1-9])h ([0-5][0-9]|[0-9])min$/.test(time)) throw 'Time isValid';
    return true;
}

function validLink (link) {
    if(!/^https?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}(\/\S*)?$/.test(link)) throw 'Link is not valid';
    return true;
}

function vaildEmailAddr (email) {
    if(!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) throw 'Email address is not valid';
    return true;
}

function hashPassword(password) {
    return bcrypt.hashSync(password, 16);
}
module.exports = {
    validDate,
    validTime,
    validLink,
    vaildEmailAddr
}
