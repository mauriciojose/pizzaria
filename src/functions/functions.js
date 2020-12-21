class Functions {
    static completeZeroLeft(codigo) {
        return ("0000000000"+codigo).slice(-10);
    }
    static getDecimalFromFormatBrazil(value){
        String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
            return this.split(needle).join(replacement);
        };
        value = value.replaceAll('.','');
        value = value.replace(',','.');
        return value;
    }
}
module.exports = Functions;