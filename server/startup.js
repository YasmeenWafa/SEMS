// ES6

Meteor.startup(function() {
  if (Meteor.users.find().count() === 0) {
    // Creating a random password
    var pass = Random.id(20);

    // Creating the great admin
    var userId = Accounts.createUser({
      email: Meteor.settings.adminEmail,
      password: pass,
      profile: {
        firstName: 'System',
        lastName: 'Admin',
        GUCId: '00-00000',
        tutorialGroup: 'Adminstration',
      }
    });


    if (userId) {
      // Make em an admin !
      Roles.addUsersToRoles(userId, ADMIN);

      // He is a verified user for sure !
      Meteor.users.update(userId, {
        $set: {
          'emails.0.verified': true
        }
      });

      Email.send({
        to: Meteor.settings.adminEmail,
        from: Meteor.settings.systemEmail,
        subject: "[SEMS] Welcome Adminstrator",
        text: `Hello Admin, your account is created with the following password: ${pass}\nPlease Change your password after logging in`
      });

    }



  }
  if (Companies.find().count() === 0) {
    Companies.insert({ "_id": "1", "image": "jal2.gif", "name": "Japan Airlines" });
    Companies.insert({ "_id": "2", "image": "aeromexico.gif", "name": "AeroMexico" });
    Companies.insert({ "_id": "3", "image": "klm2.gif", "name": "KLM Airlines" });
    Companies.insert({ "_id": "4", "image": "airberlin.gif", "name": "Air Berlin" });
    Companies.insert({ "_id": "5", "image": "korean.gif", "name": "Korean Air" });
    Companies.insert({ "_id": "6", "image": "aircanada.gif", "name": "Air Canada" });
    Companies.insert({ "_id": "7", "image": "lan2.gif", "name": "LAN Airlines" });
    Companies.insert({ "_id": "8", "image": "airfrance2.gif", "name": "Air France" });
    Companies.insert({ "_id": "9", "image": "lot2.gif", "name": "LOT Polish Airlines" });
    Companies.insert({ "_id": "10", "image": "airindia2.gif", "name": "Air India" });
    Companies.insert({ "_id": "11", "image": "lufthansa4.gif", "name": "Lufthansa" });
    Companies.insert({ "_id": "12", "image": "airmadagascar.gif", "name": "Air Madagascar" });
    Companies.insert({ "_id": "13", "image": "malaysia.gif", "name": "Malaysia Airlines" });
    Companies.insert({ "_id": "14", "image": "air_new_zealand_logo2.gif", "name": "Air New Zealand" });
    Companies.insert({ "_id": "15", "image": "midweat.gif", "name": "Midwest Airlines" });
    Companies.insert({ "_id": "16", "image": "airphillipines.gif", "name": "Philippine Airlines" });
    Companies.insert({ "_id": "17", "image": "nwa1.gif", "name": "Northwest Airlines" });
    Companies.insert({ "_id": "18", "image": "airtran.gif", "name": "AirTran Airways" });
    Companies.insert({ "_id": "19", "image": "oceanic.gif", "name": "Oceanic Airlines" });
    Companies.insert({ "_id": "20", "image": "alaskaairlines3.gif", "name": "Alaska Airlines" });
    Companies.insert({ "_id": "21", "image": "qantas2.gif", "name": "Qantas Airways" });
    Companies.insert({ "_id": "22", "image": "alitalia.gif", "name": "Alitalia Airlines" });
    Companies.insert({ "_id": "23", "image": "sabena2.gif", "name": "Sabena Airlines" });
    Companies.insert({ "_id": "24", "image": "austrian2.gif", "name": "Austrian Airlines" });
    Companies.insert({ "_id": "25", "image": "singapore_airlines2.gif", "name": "Singapore Airlines" });
    Companies.insert({ "_id": "26", "image": "avianca2.gif", "name": "Avianca Airlines" });
    Companies.insert({ "_id": "27", "image": "southafricanairways2.gif", "name": "South African Airways" });
    Companies.insert({ "_id": "28", "image": "ba2.gif", "name": "British Airways" });
    Companies.insert({ "_id": "29", "image": "southwest2.gif", "name": "Southwest Airlines" });
    Companies.insert({ "_id": "30", "image": "brusselsairlines2.gif", "name": "Brussels Airlines" });
    Companies.insert({ "_id": "31", "image": "spirit.gif", "name": "Spirit Airlines" });
    Companies.insert({ "_id": "32", "image": "cathaypacific21.gif", "name": "Cathay Pacific Airlines" });
    Companies.insert({ "_id": "33", "image": "srilankan.gif", "name": "SriLankan Airlines" });
    Companies.insert({ "_id": "34", "image": "china_airlines.gif", "name": "China Airlines" });
    Companies.insert({ "_id": "35", "image": "swissair3.gif", "name": "Swissair" });
    Companies.insert({ "_id": "36", "image": "continental-airlines-logo2.gif", "name": "Continental Airlines" });
    Companies.insert({ "_id": "37", "image": "swiss.gif", "name": "Swiss Airlines" });
    Companies.insert({ "_id": "38", "image": "croatia2.gif", "name": "Croatia Airlines" });
    Companies.insert({ "_id": "39", "image": "tap.gif", "name": "TAP Portugal" });
    Companies.insert({ "_id": "40", "image": "dagonair.gif", "name": "Dragonair" });
    Companies.insert({ "_id": "41", "image": "tarom.gif", "name": "TAROM Airlines" });
    Companies.insert({ "_id": "42", "image": "delta3.gif", "name": "Delta Airlines" });
    Companies.insert({ "_id": "43", "image": "thai4.gif", "name": "Thai Airways" });
    Companies.insert({ "_id": "44", "image": "turkish.gif", "name": "Turkish Airlines" });
    Companies.insert({ "_id": "45", "image": "emirates_logo2.gif", "name": "Emirates Airlines" });
    Companies.insert({ "_id": "46", "image": "united.gif", "name": "United Airlines" });
    Companies.insert({ "_id": "47", "image": "ethiopianairlines4.gif", "name": "Ethiopian Airlines" });
    Companies.insert({ "_id": "48", "image": "varig.gif", "name": "Varig Airlines" });
    Companies.insert({ "_id": "49", "image": "garudaindonesia.gif", "name": "Garuda Indonesia" });
    Companies.insert({ "_id": "50", "image": "vietnamairlines.gif", "name": "Vietnam Airlines" });
    Companies.insert({ "_id": "51", "image": "hawaiian2.gif", "name": "Hawaiian Airlines" });
    Companies.insert({ "_id": "52", "image": "virgin4.gif", "name": "Virgin Australia Airlines" });
    Companies.insert({ "_id": "53", "image": "iberia2.gif", "name": "Iberia" });
    Companies.insert({ "_id": "54", "image": "wideroe1.gif", "name": "Widerøe" });
    Companies.insert({ "_id": "55", "image": "icelandair_logo2.gif", "name": "Icelandair" });
    Companies.insert({ "_id": "56", "image": "egyptair.gif", "name": "Egypt Air" });

  }
});
