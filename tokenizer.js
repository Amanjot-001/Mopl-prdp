class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    // end of file or not
    _isEOF() {
        return this._cursor === this._string.length;
    }

    hasMoreTokens() {
       return this._cursor < this._string.length;
    }

    getNextToken() {
        if(!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        // numbers
        if(!Number.isNaN(Number(string[0]))) {
            let number = '';
            while(!Number.isNaN(Number(string[this._cursor]))) {
                number+=string[this._cursor++];
            }

            return {
                type: 'NUMBER',
                value: number
            };
        }

        // strings
        if(string[0] === '"') {
            let str = '';
            do {
                str+= string[this._cursor++];
            } while(string[this._cursor] !== '"' && !this._isEOF());

            str+= this._cursor++;
            
            return {
                type: 'STRING',
                value: str
            }
        }
        else if(string[0] === "'") {
            let str = '';
            do {
                str+= string[this._cursor++];
            } while(string[this._cursor] !== "'" && !this._isEOF());

            str+= this._cursor++;

            return {
                type: 'STRING',
                value: str
            }
        }

        return null;
    }
}

module.exports = {
    Tokenizer
}