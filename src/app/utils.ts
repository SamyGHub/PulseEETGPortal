
// import {CBase64} from './base64';
// import * as CryptoJS from 'crypto-js';

export class Utils {
    static getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key: any, value: any) => {
		  if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) {
			  return;
			}
			seen.add(value);
		  }
		  return value;
		};
	  };  
	
	  static hasDupes(arr: any[],param: string) {
		var hash = Object.create(null);
		return arr.some( (a:any)=> {
			return a[param] && (hash[a[param]] || !(hash[a[param]] = true));
		});
	}

	//CryptoJS: any = require("crypto-js");      
    //   static encodeText(toEncode: any){
    //         // Define the string
	// 	var string = toEncode;

	// 	// Encode the String
	// 	var encodedString = CBase64.encode(string);
	// 	console.log(encodedString);
	// 	return encodedString;

    //   }
    //   static decodeText(toDecode: any){
            

	// 	// Decode the String
	// 	var decodedString = CBase64.decode(toDecode);
	// 	console.log(decodedString);
	// 	return decodedString;
    //   }
	//   static encryptUsingAES256(stringtoencrypt:string,keyvalue:string) {
	// 	var keySize = 256;
		
	// 	var salt = CryptoJS.lib.WordArray.random(16);
	// 	var key = CryptoJS.PBKDF2(keyvalue, salt, {
	// 		keySize: keySize / 32,
	// 		iterations: 100
	// 	});
		
	// 	var iv = CryptoJS.lib.WordArray.random(128 / 8);
		
	// 	var encrypted = CryptoJS.AES.encrypt(stringtoencrypt, key, {
	// 		iv: iv,
	// 		padding: CryptoJS.pad.Pkcs7,
	// 		mode: CryptoJS.mode.CBC
	// 	});
		
	// 	var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
		
	// 	return result;
	// }
	
	// static decryptUsingAES256(decString:string, keyvalue:string) {
	// 	var key = CryptoJS.enc.Utf8.parse(keyvalue);                             
	// 	var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);  
	
	// 	var decrypted = CryptoJS.AES.decrypt(decString, key, {iv: iv}); 
	// 	return decrypted.toString(CryptoJS.enc.Utf8);       
	// }
	static simpleStringify (object: any){
		// stringify an object, avoiding circular structures
		// https://stackoverflow.com/a/31557814
		var simpleObject:any = {};
		for (var prop in object ){
			if (!object.hasOwnProperty(prop)){
				continue;
			}
			if (typeof(object[prop]) == 'object'){
				continue;
			}
			if (typeof(object[prop]) == 'function'){
				continue;
			}
			simpleObject[prop] = object[prop];
		}
		console.log(simpleObject);
		return JSON.stringify(simpleObject); // returns cleaned up JSON
	};
	static UABPassEncrypt(strPassed: string){
		let  StrXX = strPassed;
		let strTemp:string = "";
		let strswap: string = "";
		let remaining:string = "";
		let remainingtemp:string = "";
		let i = 0;
		
		for (let intCnt = 0; intCnt< 3;intCnt++){
			let strTemp = "";
			strTemp = StrXX.split("").reverse().join("");
			StrXX = strTemp;
			//console.log(StrXX, "reversed"+intCnt)
			strswap = StrXX.substring(0,1)
			//console.log(strswap,"swap"+intCnt)
			remaining = StrXX.substring(1).split("").reverse().join("");
			StrXX = strswap+remaining;
			//console.log(StrXX, "result"+intCnt);
		}

		strTemp = StrXX
		//console.log(strTemp,"final before replace")
		StrXX = ""
		for(i = 0; i<strTemp.length;i++){
			StrXX = StrXX + this.UABencrSwap(strTemp.substring( i, i+1))
		}
		return StrXX;
	}

 	static UABencrSwap(strIn: string){
		let str: string= "";
		//console.log(strIn)
		switch (strIn) {
			case "A": 
			str = "t"; break;
			case "B": str = "y"; break;
			case "C": str = "c"; break;
			case "D": str = "w"; break;
			case "E": str = "l"; break;
			case "F": str = "L"; break;
			case "G": str = "z"; break;
			case "H": str = "s"; break;
			case "I": str = "r"; break;
			case "J": str = "J"; break;
			case "K": str = "X"; break;
			case "L": str = "o"; break;
			case "M": str = "n"; break;
			case "N": str = "R"; break;
			case "O": str = "m"; break;
			case "P": str = "k"; break;
			case "Q": str = "4"; break;
			case "R": str = "i"; break;
			case "S": str = "h"; break;
			case "T": str = "g"; break;
			case "U": str = "H"; break;
			case "V": str = "e"; break;
			case "W": str = "d"; break;
			case "X": str = "x"; break;
			case "Y": str = "b"; break;
			case "Z": str = "a"; break;
			case "0": str = "9"; break;
			case "1": str = "0"; break;
			case "2": str = "j"; break;
			case "3": str = "6"; break;
			case "4": str = "5"; break;
			case "5": str = "7"; break;
			case "6": str = "M"; break;
			case "7": str = "2"; break;
			case "8": str = "1"; break;
			case "9": str = "8"; break;
			case "a": str = "Z"; break;
			case "b": str = "Y"; break;
			case "c": str = "p"; break;
			case "d": str = "W"; break;
			case "e": str = "V"; break;
			case "f": str = "U"; break;
			case "g": str = "T"; break;
			case "h": str = "S"; break;
			case "i": str = "v"; break;
			case "j": str = "Q"; break;
			case "k": str = "P"; break;
			case "l": str = "O"; break;
			case "m": str = "N"; break;
			case "n": str = "B"; break;
			case "o": str = "u"; break;
			case "p": str = "K"; break;
			case "q": str = "q"; break;
			case "r": str = "I"; break;
			case "s": str = "A"; break;
			case "t": str = "G"; break;
			case "u": str = "F"; break;
			case "v": str = "E"; break;
			case "w": str = "D"; break;
			case "x": str = "C"; break;
			case "y": str = "3"; break;
			case "z": str = "f"; break;
		
			default:
				str = strIn
				break;
		}
		return str;
	}
}
