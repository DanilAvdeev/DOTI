export function encryptVernam(text, key){
    let encrypted = "";
    for(let i = 0; i < text.length; i++){
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i));
    }
    return encrypted;
}

export function decryptVernam(encrypted, key){
    let text = "";
    for(let i = 0; i < encrypted.length; i++){
        text += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i));
    }
    return text;
}

export function keygen(text){
    let key = "";
    for (let i = 0; i < text.length; i++) {
        key += String.fromCharCode(randomInt());
    }
    return key
}

function randomInt(){
    return Math.floor(Math.random() * (255 - 0)) + 255;
}