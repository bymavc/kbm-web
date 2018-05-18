var inputLength = {
    username: 20,
    password: 20,
    email: 60,
    firstName: 20,
    lastName: 20
}

function validateName(e) {
    key = (document.all) ? e.keyCode : e.which;
    if (key == 8) return true;
    regex = /[A-Za-z\sáéíóúñÁÉÍÓÚÑ\']/;
    k = String.fromCharCode(key);
    return regex.test(k);
}

function validateGeneric(e) {
    key = (document.all) ? e.keyCode : e.which;
    if (key == 8) return true;
    regex = /[A-Za-z\sáéíóúñÁÉÍÓÚÑ\d]/;
    k = String.fromCharCode(key);
    return regex.test(k);
}

function validateUsername(e) {
    key = (document.all) ? e.keyCode : e.which;
    if (key == 8) return true;
    regex = /^[a-zA-Z0-9]+$/;
    k = String.fromCharCode(key);
    return regex.test(k);
}

function validateNumber(e) {
    key = (document.all) ? e.keyCode : e.which;
    if (key == 8) return true;
    regex = /\d/;
    k = String.fromCharCode(key);
    return regex.test(k);
}

function validateEmail(e) {
    key = (document.all) ? e.keyCode : e.which;
    if (key == 8) return true;
    regex = /[A-Za-z0-9@_.\-]/;
    k = String.fromCharCode(key);
    return regex.test(k);
}