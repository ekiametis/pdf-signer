const isNotNull = (field = 'field', value) => {
    if(!value){
        throw new Error('The field \''+ field +'\' can not be null.');
    }
    return true;
}

module.exports = {
    isNotNull
}