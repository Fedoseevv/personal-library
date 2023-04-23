const changePass = e => { // Функция валидация паспортных данных
    const regDig = /\d/
    if (!regDig.test(e.target.value[e.target.value.toString().length - 1])) {
        e.target.value = e.target.value.substring(0, e.target.value.toString().length - 1);
    }
    if (e.target.value.toString().length === 4) {
        e.target.value += '-';
    }
    if (e.target.toString().length > 11) {
        e.target.value = e.target.value.substring(0, 11);
    }
}

const onlyDigit = e => { // Метод пропускает только числа
    const regDig = /\d/
    if (!regDig.test(e.target.value[e.target.value.toString().length - 1])) {
        e.target.value = e.target.value.substring(0, e.target.value.toString().length - 1);
    }
}

const changeDate = e => { // Функция валидации поля даты
    const regDig = /\d/
    if (!regDig.test(e.target.value[e.target.value.toString().length - 1])) {
        e.target.value = e.target.value.substring(0, e.target.value.toString().length - 1);
    }
    if (e.target.value.toString().length === 4 || e.target.value.toString().length === 7) {
        e.target.value += '-';
    }
    if (e.target.value.toString().length > 10) {
        e.target.value = e.target.value.substring(0, 10);
    }
}

const changeMobile = e => { // Функция валидации мобильного телефона
    const regDig = /\d/
    if (!regDig.test(e.target.value[e.target.value.toString().length - 1])) {
        e.target.value = e.target.value.substring(0, e.target.value.toString().length - 1);
    }
    if (e.target.value.length === 1) {
        if (e.target.value != '7') {
            e.target.value = '7';
        }
        e.target.value = '+' + e.target.value + '-';
    }
    if (e.target.value.toString().length === 6) {
        e.target.value = e.target.value + '-';
    }
    if (e.target.value.toString().length === 10) {
        e.target.value += '-';
    }
    if (e.target.value.toString().length === 13) {
        e.target.value += '-';
    }
    if (e.target.value.toString().length >= 16) {
        e.target.value = e.target.value.substring(0, 16);
    }
}

const changeSnils = e => { // Функция валидации снилса
    const regDig = /\d/
    if (!regDig.test(e.target.value[e.target.value.toString().length - 1])) {
        e.target.value = e.target.value.substring(0, e.target.value.toString().length - 1);
    }
    if (e.target.value.toString().length === 3 || e.target.value.toString().length === 7) {
        e.target.value += '-';
    } else if (e.target.value.toString().length === 11) {
        e.target.value += ' ';
    }
    if (e.target.value.toString().length > 14) {
        e.target.value = e.target.value.substring(0, 14);
    }
}

const stopInput = (e, maxLength) => { // Функция, ограничивающая длину ввода данных
    const regDig = /\d/
    if (!regDig.test(e.target.value[e.target.value.toString().length - 1])) {
        e.target.value = e.target.value.substring(0, e.target.value.toString().length - 1);
    }
    if (e.target.value.toString().length > maxLength) {
        e.target.value = e.target.value.substring(0, 16);
    }
}

export {
    changePass,
    changeDate,
    changeMobile,
    changeSnils,
    onlyDigit,
    stopInput
}