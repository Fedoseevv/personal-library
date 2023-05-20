import {useEffect, useState} from "react";

const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validations);

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const onBlur = (e) => {
        setDirty(true);
    }
    return {
        value,
        onChange,
        onBlur,
        setValue,
        isDirty,
        ...valid,
    }
}

const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [maxLengthError, setMaxLengthError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [snilsError, setSnilsError] = useState(false);

    const [isMatchError, setIsMatchError] = useState(false);
    const [isDigitError, setIsDigitError] = useState(false);

    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false);
                    break;

                case 'isEmpty':
                    value ? setEmpty(false) : setEmpty(true)
                    break;

                case 'maxLength':
                    value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false);
                    break;

                case 'isMatch':
                    value === validations[validation] ? setIsMatchError(false) : setIsMatchError(true);
                    break;

                case 'isEmail':
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
                    break;

                case 'isDate':
                    const reg = /\d{4}(-|\/)\d{2}(-|\/)\d{2}/g
                    reg.test(String(value)) ? setDateError(false) : setDateError(true);
                    break;

                case 'isDigit':
                    const regDIgit = /\d/g;
                    regDIgit.test(String(value)) ? setIsDigitError(false) : setIsDigitError(true);

            }
        }
    }, [value])

    useEffect(() => {
        if (isEmpty || maxLengthError ||  minLengthError || emailError) {
            setInputValid(false)
        } else {
            setInputValid(true);
        }
    }, [isEmpty, maxLengthError, minLengthError, emailError])

    return {
        isEmpty,
        minLengthError,
        emailError,
        maxLengthError,
        phoneError,
        dateError,
        passError,
        snilsError,
        isMatchError,
        isDigitError,

        inputValid
    }
}
export {useInput, useValidation};