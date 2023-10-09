// Message padding bits, complement the length.
function fillString(str) {
    var blockAmount = ((str.length + 8) >> 6) + 1,
        blocks = [],
        i;

    for (i = 0; i < blockAmount * 16; i++) {
        blocks[i] = 0;
    }
    for (i = 0; i < str.length; i++) {
        blocks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);
    }
    blocks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
    blocks[blockAmount * 16 - 1] = str.length * 8;

    return blocks;
}

// Convert the input binary array to a hexadecimal string.
function binToHex(binArray) {
    var hexString = "0123456789abcdef",
        str = "",
        i;

    for (i = 0; i < binArray.length * 4; i++) {
        str += hexString.charAt((binArray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
            hexString.charAt((binArray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }

    return str;
}

// The core function, the output is a number array with a length of 5,
// corresponding to a 160-bit message digest.
function core(blockArray) {
    var w = [],
        a = 0x67452301,
        b = 0xEFCDAB89,
        c = 0x98BADCFE,
        d = 0x10325476,
        e = 0xC3D2E1F0,
        olda,
        oldb,
        oldc,
        oldd,
        olde,
        t,
        i,
        j;

    for (i = 0; i < blockArray.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        olde = e;

        for (j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = blockArray[i + j];
            } else {
                w[j] = cyclicShift(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            t = modPlus(modPlus(cyclicShift(a, 5), ft(j, b, c, d)), modPlus(modPlus(e, w[j]), kt(j)));
            e = d;
            d = c;
            c = cyclicShift(b, 30);
            b = a;
            a = t;
        }

        a = modPlus(a, olda);
        b = modPlus(b, oldb);
        c = modPlus(c, oldc);
        d = modPlus(d, oldd);
        e = modPlus(e, olde);
    }

    return [a, b, c, d, e];
}

// According to the t value, return the corresponding f function used in
// the compression function.
function ft(t, b, c, d) {
    if (t < 20) {
        return (b & c) | ((~b) & d);
    } else if (t < 40) {
        return b ^ c ^ d;
    } else if (t < 60) {
        return (b & c) | (b & d) | (c & d);
    } else {
        return b ^ c ^ d;
    }
}

// According to the t value, return the corresponding K value used in
// the compression function.
function kt(t) {
    return (t < 20) ? 0x5A827999 :
        (t < 40) ? 0x6ED9EBA1 :
            (t < 60) ? 0x8F1BBCDC : 0xCA62C1D6;
}

// Modulo 2 to the 32nd power addition, because JavaScript's number is a
// double-precision floating-point number, so the 32-bit number is split
// into the upper 16 bits and the lower 16 bits are added separately.
function modPlus(x, y) {
    var low = (x & 0xFFFF) + (y & 0xFFFF),
        high = (x >> 16) + (y >> 16) + (low >> 16);

    return (high << 16) | (low & 0xFFFF);
}

// Rotate left of the input 32-bit num binary number, because JavaScript's
// number is a double-precision floating-point number, so you need to pay
//  attention to the shift.
function cyclicShift(num, k) {
    return (num << k) | (num >>> (32 - k));
}

// The main function calculates the message digest based on the input message
// string and returns the message digest in hexadecimal.
export default function sha1(s) {
    return binToHex(core(fillString(s)));
}