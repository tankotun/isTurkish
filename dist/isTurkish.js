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
 *  person: { name: string, firstname: string, lastname: string, birthyear: string, identity: string },
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

      // Name Split
      name = (name || `${firstname || ""} ${lastname || ""}`)?.split(' ').filter(f => f !== "").map(x => {
        return String(x).trim().toLocaleUpperCase("tr-TR")
      });

      // Name Check
      if(name.length <= 1) {
        return reject({ code: "name", message: "Name is incorrect!" })
      }

      // Values
      firstname = String(name.slice(0, name.length - 1).join(' '));
      lastname = String(name.slice(-1));
      birthyear = String(birthyear || (new Date(birthdate)).getFullYear());
      identity = String(identity);

      // Request
      soap.createClient('https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL', {}, async (_, client) => {
        await client.TCKimlikNoDogrulaAsync({
          Ad: firstname,
          Soyad: lastname,
          DogumYili: birthyear,
          TCKimlikNo: identity,
        }, (__, result) => {
          let person = { name: `${firstname} ${lastname}`, firstname, lastname, birthyear, identity };
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
