const config = require('../config');
const { TeePromise } = require('../util/promise');

const es_import_promise = new TeePromise();
let stringLength;
(async () => {
    stringLength = (await import('string-length')).default;
    es_import_promise.resolve();
    // console.log('STRING LENGTH', stringLength);
    // process.exit(0);
})();
const surrounding_box = (col, lines, lengths) => {
    if ( ! stringLength ) return;
    if ( ! lengths ) {
        lengths = lines.map(line => stringLength(line));
    }
    
    const max_length = process.stdout.columns - 6;
    // const max_length = Math.max(...lengths);

    const c = str => `\x1b[${col}m${str}\x1b[0m`;
    const bar = c(Array(max_length + 4).fill('━').join(''));
    for ( let i = 0 ; i < lines.length ; i++ ) {
        require('fs').appendFileSync('/tmp/asdfqwer',
            '' + lines[i] +':'+ lines[i].length +':'+ lengths[i]+
                ':'+max_length+'\n');
        if ( lengths[i] < max_length ) {
            lines[i] += Array(max_length - lengths[i])
                .fill(' ')
                .join('');
        }
        lines[i] = `${c('┃ ')} ${lines[i]} ${c(' ┃')}`;
    }
    if ( ! config.minimal_console ) {
        lines.unshift(`${c('┏')}${bar}${c('┓')}`);
        lines.push(`${c('┗')}${bar}${c('┛')}`);
    }
};

module.exports = {
    surrounding_box,
    es_import_promise,
};
