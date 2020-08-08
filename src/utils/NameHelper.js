export default class NameHelper {
    static short (value, length) {
        let name = value;
        const words = name.split(/\s+/);
        
        if (words.length >= length) {
            let shortName = '';
            for (let i = 0; i < length; i++) {
                shortName += words[i][0];
            }
            return shortName;
        }

        if (name.replace(/[^A-Z]+/, '').length >= length) {    
            return name.replace(/[^A-Z]+/, '').slice(0, length);
        }

        return name.slice(0, length);
    }
}