'use strict';

const soap = require("soap");

/**
 * 
 * isTurkish
 * Kimlik bilgilerini, T.C. Nüfus ve Vatandaşlık İşleri Genel Müdürlüğünden doğrular.
 * 
 * @author Taner Tunçer
 * 
 * @async
 * @function
 * 
 * @param {Object} params
 * @param {string} [params.firstname]
 * @param {string} [params.lastname]
 * @param {string} [params.name]
 * @param {string} params.identity
 * @param {(date|string)} [params.birthdate]
 * @param {(number|string)} [params.birthyear]
 * 
 * @returns {Promise<{
 *  code: string,
 *  turkish: boolean,
 *  person: { firstname: string, lastname: string, birthyear: string, identity: string },
 *  message: string
 * }>}
 * 
*/
module.exports = async function isTurkish ({ firstname, lastname, name, identity, birthdate, birthyear }) {
 return new Promise (async (resolve, reject) => {
   try {

     // Params
     if(!(name || (firstname && lastname)) || !identity || !(birthdate || birthyear)) {
       return reject({ code: "params", message: "Params are missing or incorrect!" })
     }

     // Name
     if(name) {
       name = name?.split(' ').filter(f => f !== "");
       if(name.length <= 1) return reject({ code: "name", message: "Name is incorrect!" })
     }

     // Values
     firstname = String(firstname || name.slice(0, name.length - 1).join(' ')).trim().toLocaleUpperCase("tr-TR");
     lastname = String(lastname || name.slice(-1)).trim().toLocaleUpperCase("tr-TR");
     birthyear = birthyear || (new Date(birthdate)).getFullYear();
     identity = identity;

     // Request
     soap.createClient('https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL', {}, async (_, client) => {
       await client.TCKimlikNoDogrulaAsync({
         Ad: firstname,
         Soyad: lastname,
         DogumYili: birthyear,
         TCKimlikNo: identity,
       }, (__, result) => {
        let person = { firstname, lastname, birthyear, identity };
        if(result.TCKimlikNoDogrulaResult) {
          resolve({ code: "turkish", turkish: true, person: person, message: "Person is Turkish." });
        } else {
          resolve({ code: "notTurkish", turkish: false, person: person, message: "Person is not Turkish!" });
        }
       });
     });

   } catch (error) {
     reject({ code: "request", message: "Request failed!" });
   }
 })
};
