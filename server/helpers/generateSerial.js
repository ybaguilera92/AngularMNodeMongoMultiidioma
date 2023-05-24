const fn_generateSerial = () => {
    let _random = Math.random().toString(32).substring(2);
    let _date  = Date.now().toString(32);
    return _random + _date;
}

export default fn_generateSerial;