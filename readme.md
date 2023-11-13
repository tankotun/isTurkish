# isTurkish
İsim, kimlik numarası ve doğum yılı bilgileriyle bir kişinin Türkiye Cumhuriyeti vatandaşı olup olmadığını doğrular. Sorgular doğrudan T.C. Nüfus ve Vatandaşlık İşleri Genel Müdürlüğünün halka açık servisinden gerçekleştirilir.

### Bilgi
- Doğum Yılı: `birthdate` ile tarih **veya** `birthyear` ile yıl değeri gönderilir.
- İsim: `name` ile tam isim **veya** `firstname` ve `lastname` ile isim değerleri gönderilir.

### Kurulum
```
npm i isturkish
```

### Örnek
```js
// Çağır
const isTurkish = require("isturkish")

// Sorgula
await isTurkish({
  name: "Zeki Müren",
  birthdate: "1931-12-06",
  identity: "00000000000",
}).then(result => {

  // Türk Vatandaşı ise:
  console.log(result.code) // "turkish" (string)
  console.log(result.turkish) // true (boolean)
  console.log(result.person) // {firstname,lastname,birthyear,identity} (object)
  console.log(result.message) // "Person is Turkish." (string)

  // Türk Vatandaşı değilse:
  console.log(result.code) // "notTurkish" (string)
  console.log(result.turkish) // false (boolean)
  console.log(result.person) // {firstname,lastname,birthyear,identity} (object)
  console.log(result.message) // "Person is not Turkish." (string)

}).catch(error => {

  // Hata oluşursa:
  console.log(result.code) // string
  console.log(result.message) // string

})

```

### Parametre Örnekleri
Bilgi alanında belirtilen durumların örnekleri.
```js
// Örnek 1
await isTurkish({
  name: "Zeki Müren",
  birthdate: "1990-10-05",
  identity: "00000000000",
})

// Örnek 2
await isTurkish({
  firstname: "Zeki",
  lastname: "Müren",
  birthyear: "1970",
  identity: "00000000000",
})

// Örnek 3
await isTurkish({
  firstname: "Falih Rıfkı",
  lastname: "Atay",
  birthdate: "1975-10-05",
  identity: "00000000000",
})
```