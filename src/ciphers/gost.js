//Узлы замены, определённые документом RFC 4357
//https://habr.com/ru/articles/81032/
let sBlock = [
    [9,6,3,2,8,11,1,7,10,4,14,15,12,0,13,5],
    [3,7,14,9,8,10,15,0,5,2,6,12,11,4,13,1],
    [14,4,6,2,11,3,13,8,12,15,5,10,0,7,1,9],
    [14,7,10,12,13,1,3,9,0,2,11,4,15,8,5,6],
    [11,5,1,9,8,13,15,0,14,4,2,3,12,7,10,6],
    [3,10,13,12,1,2,0,11,7,5,9,4,8,15,14,6],
    [1,13,2,9,7,10,6,0,8,12,4,5,15,3,11,14],
    [11,10,15,5,0,12,14,8,6,2,3,9,1,7,13,4],
];

let kBlock = [
    0x00000000,
    0x00000000,
    0x00000000,
    0x00000000,
    0x00000000,
    0x00000000,
    0x00000000,
    0x00000000
];

export async function encode(blob){
    let data = await blob.text();
    data = encodeURIComponent(data);
    let blocks = await data2blocks(data);
    let keys = keysGen()
    let result = ''
    for(let i = 0; i < blocks.length; i++) {
        let newBlock = algorythm(blocks[i], keys)
        result += newBlock;
    }
    return result;
}

export async function decode(encodedData){
    let blocks = await data2blocks(encodedData);
    let keys = keysGen().reverse();
    let result='';
    for(let i = 0; i < blocks.length; i++) {
        let newBlock = algorythm(blocks[i], keys)
        result += newBlock;
    }
    result = decodeURIComponent(result);
    return result;
}

//Подключи X0 … X23 являются циклическим повторением K0 … K7. Подключи X24 … X31 являются K7 … K0.
function keysGen(){
    let keyBlock = [];
    for(let i = 0; i < 32; i++) {
        let x;
        if(i < (32 - 8)) {
            x = i % 8;
        } else {
            x = 7 - (i % 8);
        }
        keyBlock.push(kBlock[x]);
    }
    return keyBlock;
}

export function keyGen(){
    const characters ='0123456789abcdef';
    let keyArray = [];
    let newKeys = [];
    for (let i = 0; i < 32; i++) {
        keyArray[i] = characters.charAt(Math.floor(Math.random() * characters.length));
        if(i % 4 === 3) {
            let hex = parseInt(bin2hex(keyArray.slice(i-3, i+1).join("")), 16);
            kBlock[(i+1)/4-1]=hex;
            newKeys.push(hex);
        }
    }
    kBlock = newKeys;
    return kBlock;
}

//eeeeh mdaaaa tyazheloo
// const characters ='0123456789abcdef';
// let keyArray = [];
// for (let i = 0; i < 32; i++){
//     keyArray[i] = characters.charAt(Math.floor(Math.random() * characters.length));
//     keyArray[i] += characters.charAt(Math.floor(Math.random() * characters.length));
//
//     if(i % 4 === 3) {
//         console.log(i)
//         console.log(keyArray.slice(i-3, i+1))
//         let hex = parseInt((keyArray.slice(i-3, i+1)), 16);
//         console.log("hex:" + hex)
//         kBlock[(i+1)/4-1]=hex;
//     }
// }

async function data2blocks (data){
    let blocks = [];
    let blockLength = 8; // 64bites
    let blocksNum = Math.ceil(data.length/blockLength)
    for(let i = 0; i < blocksNum; i++) {
        blocks[i] = data.slice(i * blockLength, i * blockLength + 8);
        if(i === (blocksNum-1)) {
            while(blocks[i].length < blockLength){
                blocks[i] += String.fromCharCode(0);
            }
        }
    }
    return blocks;
}

function algorythm (block, keys){
    let left = parseInt(bin2hex(block.slice(0, 4)), 16)
    let right = parseInt(bin2hex(block.slice(4, 8)), 16)

    for(let i = 0; i < 32; i++) {
        let summ = summMod32(left, keys[i])
        summ = blockReplace(summ);
        summ = blockCycleShift(summ, 21);

        summ = summ ^ right;
        right = left;
        left = summ;
    }
    block = blockImplode(right, left)
    return block;
}

function summMod32(left, keys) {
    return NormalizeInteger32(parseInt(left + keys));
}

function blockReplace(block){
    let newBlock = 0;

    for(let i = 0; i < 8; i++) {
        let rem = block>>(4*(i+1)),
            hex;
        rem = rem<<(4*(i+1));

        if(i === 7) {
            hex = rem;
        } else {
            hex = block - rem;
            block = rem;
        }
        hex = blockCycleShift(hex,(4*i));
        let replace = sBlock[i][hex];
        newBlock = newBlock + (Math.pow(16, i)*replace);
    }
    return newBlock;
}

function blockCycleShift(block, bits){
    if(bits > 0) {
        let a = bits;
        let b = 32 - a;
        block = ((block >> a) & ~(-Math.pow(2,b)))^(block << b);
    }
    return block;
}

function NormalizeInteger32(num){
    let is_64bit;
    is_64bit = (2147483647 + 1) > 0;
    if(is_64bit) {
        let integer = 0;
        for(let i = 0; i < 32; i++) {
            integer = integer | (1 << i);
        }
        num = (num & integer);
    }
    return num;
}

function bin2hex(s) {
    let i, l, o = '', n;
    s += '';
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? '0' + n : n;
    }
    return o;
}

function blockImplode(left, right){
    let block = '';
    left = sprintf("%08x", left);
    right = sprintf("%08x", right);
    let arr = left.match(RegExp("((.{2})+?|(.{1,2})$)", "g"));

    for(let k in arr) {
        block += String.fromCharCode(parseInt(arr[k], 16));
    }

    arr = right.match(RegExp("((.{2})+?|(.{1,2})$)", "g"));
    for(let k in arr) {
        block += String.fromCharCode(parseInt(arr[k], 16));
    }

    return block;
}

function sprintf() {
    //  discuss at: http://phpjs.org/functions/sprintf/
    // original by: Ash Searle (http://hexmen.com/blog/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Dj
    // improved by: Allidylls
    //    input by: Paulo Freitas
    //    input by: Brett Zamir (http://brett-zamir.me)
    //   example 1: sprintf("%01.2f", 123.1);
    //   returns 1: 123.10
    //   example 2: sprintf("[%10s]", 'monkey');
    //   returns 2: '[    monkey]'
    //   example 3: sprintf("[%'#10s]", 'monkey');
    //   returns 3: '[####monkey]'
    //   example 4: sprintf("%d", 123456789012345);
    //   returns 4: '123456789012345'
    //   example 5: sprintf('%-03s', 'E');
    //   returns 5: 'E00'

    let regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
    let a = arguments;
    let i = 0;
    let format = a[i++];

    // pad()
    let pad = function(str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' ';
        }
        let padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
            .join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    // justify()
    let justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        let diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };

    // formatBaseX()
    let formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        let number = value >>> 0;
        prefix = prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };

    // formatString()
    let formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    // doFormat()
    let doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
        let number, prefix, method, textTransform, value;

        if (substring === '%%') {
            return '%';
        }

        // parse flags
        let leftJustify = false;
        let positivePrefix = '';
        let zeroPad = false;
        let prefixBaseX = false;
        let customPadChar = ' ';
        let flagsl = flags.length;
        for (let j = 0; flags && j < flagsl; j++) {
            switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    customPadChar = '0';
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth === '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
        } else if (precision === '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                    .toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = +value || 0;
                number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };

    return format.replace(regex, doFormat);
}