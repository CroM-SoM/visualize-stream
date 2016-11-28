var logger = require('../services/logger.js')
var models = require('../models');

var http = require('http');
var request = require('request');


//Setup twitter stream api
var twitter = require('twitter')
var twit = new twitter({
    //consumer_key: 'aIiEO0MSjEMBcOr7oicfaGFyQ',
    consumer_key: 'BAn0qUAl2b2WImKCoGU2xqKcF',
    //consumer_secret: 'BEGDT8LGgsctelJkf3RuRxPdDbj5AHV8IbZC2c3dtcGCW9MPWP',
    consumer_secret: 'Rv0LEawxjwl8rgwdgB7i3XtA1FVRqQrg8ctylSMRKUZ0DCDj3s',
    //access_token_key: '519395465-7R4UKVRCi2MuIJVX2ECW8rttVReXg1XGlwuWAcWo',
    access_token_key: '798829381632151552-4JOT3cUL7geoUFY2GbIKGAzz521aywp',
    //access_token_secret: 'Tp3g7sOwnNxbvBYdq8reQMVKpIR0DXtCltMFl9dpkLQ0c'
    access_token_secret: 'U2q23sEz9NXl1eqNyJS3Rn6RhmKG9CUbiigp2xtLg5x79'
  }),
  stream = null;

var service = module.exports = {

  twitterAPI: twit,

  streamUser: function (id) {

  },
  checkLocation: function (location, callback) {
    if (location === null)
      return callback(false)
    for (var i = 0; i < citiesList.length; i++) {
      var sub = location.slice(0, 7);
      if (citiesList[i].indexOf(sub) != -1) {
        return callback(true)
      } else {
        return callback(false)
      }
    }
  },
  checkLang: function (lang, callback) {
    if (lang == "nl" || lang == "NL") {
      return callback(true)
    } else {
      return callback(false)
    }
  },
  checkTimeZone: function (timeZone, callback) {
    if (timeZone == "Amsterdam" || timeZone == "amsterdam" || timeZone == "Europe/Amsterdam") {
      return callback(true)
    } else {
      return callback(false)
    }
  },
  startStream: function () {
    twit.stream('statuses/filter', {'locations': '4.734421,52.290423,4.975433,52.431065'}, function (s) {
      stream = s;
      stream.on('data', function (data) {
        // Does the JSON result have coordinates
        //console.log("Data coming :" + JSON.stringify(data));
        //console.log(data.text);
        //logger.Stream('info', JSON.stringify(data));
        var statusObj = {status: "Hi @" + data.user.screen_name + ", Welcome to CroMSoM!"}

        //call the post function to tweet something
        /* twit.post('statuses/update', statusObj,  function(error, tweetReply, response){
         //if we get an error print it out
         if(error){
         console.log(error);
         }

         //print the text of the tweet we sent out
         console.log(tweetReply.text);
         });
         */

        models.sequelize.transaction(function (t) {
          if (data.coordinates != null) {
            cords = data.coordinates.coordinates
          }
          return models.stream.create({
              row: data
            }
            , {transaction: t}).then(function (strm) {
            logger.Stream(strm.dataValues.row.id_str);

            // Fix substring only take first 5 characters to compare.
            // Push values and keys to new nested property.
            service.checkLocation(strm.dataValues.row.user.location, function (location) {
              service.checkLang(strm.dataValues.row.user.lang, function (lang) {
                service.checkTimeZone(strm.dataValues.row.user.time_zone, function (timeZone) {

                  strm.dataValues.row.tourist = {
                    'cityval': location,
                    'langval': lang,
                    'timeval': timeZone
                  }

                  models.stream.findAll({
                    where: {
                      "row.user.id": strm.dataValues.row.user.id
                    }
                  }).then(function (rows) {
                    var txtStream = "";

                    for (var i = 0; i < rows.length; i++) {
                      txtStream += rows[i].row.text;
                      if (i == rows.length - 1) {
                        //make a call to POST: stream/similarity/
                        request.post(
                          'http://localhost:8080/stream/similarity/' + txtStream.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, ' '),
                          {
                            form: {
                              user_id: strm.dataValues.row.user.id,
                              user_name: strm.dataValues.row.user,
                              tourist: strm.dataValues.row.tourist
                            }
                          },
                          function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                              //console.log("res @ " + body);
                              logger.info(body);
                            }
                            else if (error) {
                              console.log("similarity error @ " + error)
                            }
                          }
                        )

                      }
                    }

                  })

                })
              })
            });
          });
        });

      });

      stream.on('limit', function (limitMessage) {
        console.log("Limit 420 API :P");
        return console.log(limitMessage);
      });

      stream.on('warning', function (warning) {
        return console.log(warning);
      });

      stream.on('disconnect', function (disconnectMessage) {
        return console.log(disconnectMessage);
      });

      stream.on('error', function (error) {
        console.log("Limit 420 API :@:");
        return console.log(error);
      });


    });

  }
}

var citiesList = ["'s Gravenmoer", "'s-Gravenhage", "'s-Gravenland", "'s-Gravenzande", "'s-Heerenberg", "'s-Hertogenbosch", "'t Hofke", "Aalburg", "Aalsmeer", "Aalten", "Aarle-Rixtel", "Aduard", "Akkrum", "Alblasserdam", "Aldeboarn", "Alkmaar", "Almelo", "Almen", "Almere", "Almere Stad", "Almkerk", "Alphen a/d Rijn", "Alphen aan den Rijn", "America", "Amerongen", "Amersfoort", "Amstelveen", "Amstenrade", "Amsterdam", "Amsterdam-Zuidoost", "Andelst", "Anjum", "Anloo", "Annaparochie", "Apeldoorn", "Appingedam", "Arcen", "Arnhem", "Assen", "Asten", "Augustinusga", "Axel", "Baak", "Baarle-Nassau", "Baarn", "Balk", "Barchem", "Barendrecht", "Barneveld", "Bedum", "Beek", "Beekbergen", "Beesel", "Bennebroek", "Bennekom", "Benthuizen", "Berg", "Berg aan de Maas", "Berg en Dal", "Bergeijk", "Bergen op Zoom", "Bergharen", "Berghem", "Bergschenhoek", "Bergum", "Berkel en Rodenrijs", "Berlikum", "Berltsum", "Best", "Beuningen", "Beverwijk", "Biddinghuizen", "Bilgaard", "Birdaard", "Bladel", "Blaricum", "Bleiswijk", "Bloemendaal", "Blokzijl", "Boc's Mere", "Bodegraven", "Boekel", "Boelenslaan", "Bolsward", "Boornbergum", "Borculo", "Borger", "Born", "Borne", "Borsele", "Borssele", "Boskamp", "Boskoop", "Boven-Hardinxveld", "Boxmeer", "Boxtel", "Breda", "Bredevoort", "Bredeweg", "Breedeweg", "Breugel", "Breukelen", "Brielle", "Britsum", "Broek in Waterland", "Broek op Langedijk", "Broekhem", "Broeksterwâld", "Broeksterwoude", "Bruinisse", "Brummen", "Brunssum", "Buitenpost", "Bunnik", "Bunschoten", "Bunschoten-Spakenburg", "Burdaard", "Burgemeesterswijk", "Burgh", "Burgum", "Bussum", "Camminghaburen", "Capelle a/d IJssel", "Capelle a/d Yssel", "Capelle aan de IJssel", "Capelle aan de Yssel", "Capelle aan den IJssel", "Capelle aan den Yssel", "Capelle-West", "Castricum", "Ceuclum", "Coevorden", "Cranendonck", "Cuijk", "Culemborg", "Dalen", "Dalfsen", "Damwâld", "Damwoude", "De Bilt", "De Compagnie", "De Doornakkers", "De Graaf", "De Horst", "De Knijpe", "De Knipe", "De Lier", "De Steeg", "De Westereen", "Deinum", "Delden", "Delfshaven", "Delft", "Delfzijl", "Den Bosch", "Den Burg", "Den Haag", "Den Ham", "Den Helder", "Den Oever", "Deventer", "Diemen", "Diepenheim", "Dieren", "Dinteloord", "Dirksland", "Doenrade", "Doesburg", "Doetinchem", "Dokkum", "Dongen", "Doorn", "Doorwerth", "Dordrecht", "Drachster Compaghnie", "Drachten", "Drachtstercompagnie", "Driebergen-Rijsenburg", "Driel", "Driemond", "Drimmelen", "Drogeham", "Dronrijp", "Dronryp", "Dronten", "Droogeham", "Druten", "Duiven", "Duivendrecht", "Dwingeloo", "Eastermar", "Echtenerbrug", "Edam", "Ede", "Ederveen", "Eefde", "Eerbeek", "Eerde", "Eersel", "Egmond aan Zee", "Eibergen", "Eijsden", "Eindhoven", "Elburg", "Ellecom", "Elsloo", "Elst", "Emmeloord", "Emmen", "Emmer-Compascuum", "Emst", "Enkhuizen", "Ens", "Enschede", "Epe", "Epse", "Ermelo", "Erp", "Feanwâlden", "Ferwerd", "Ferwert", "Flushing", "Franeker", "Garderen", "Garijp", "Garyp", "Geertruidenberg", "Geffen", "Geldermalsen", "Geldrop", "Geleen", "Gendringen", "Gennep", "Giekerk", "Giessenburg", "Giethoorn", "Goedereede", "Goes", "Goirle", "Goor", "Gorinchem", "Gorredijk", "Gorssel", "Gouda", "Goutum", "Grave", "Grijpskerk", "Groenswaard", "Groesbeek", "Groningen", "Grootegast", "Grou", "Grouw", "Gulden Bodem", "Gytsjerk", "Haaksbergen", "Haamstede", "Haaren", "Haarlem", "Haastrecht", "Haelen", "Hague", "Halfweg", "Hallum", "Halsteren", "Hardegarijp", "Hardenberg", "Harderwijk", "Haren", "Harenkarspel", "Harfsen", "Harkema", "Harkema-Opeinde", "Harlingen", "Harskamp", "Hasselt", "Hattem", "Havelte", "Hedel", "Heeg", "Heelsum", "Heemskerk", "Heemstede", "Heer", "Heerde", "Heerenveen", "Heerewaarden", "Heerhugowaard", "Heerjansdam", "Heerlen", "Heesch", "Heeze", "Heiloo", "Heinenoord", "Heino", "Hellevoetsluis", "Helmond", "Hendrik-Ido-Ambacht", "Hengelo", "Hengevelde", "Herkenbosch", "Herveld", "Heteren", "Heusden", "Heythuysen", "Hillegom", "Hilvarenbeek", "Hilversum", "Hoek van Holland", "Hoensbroek", "Hoge Vucht", "Hollum", "Holwerd", "Honselersdijk", "Hoofddorp", "Hoogeveen", "Hoogezand", "Hoogkamp", "Hoogland", "Hoorn", "Hoorn NH", "Horst", "Houten", "Houthem", "Huizen", "Huizum", "Hulst", "Hurdegaryp", "IJlst", "IJsselstein", "Irnsum", "Jirnsum", "Joure", "Jubbega", "Kampen", "Kamperland", "Katwijk", "Katwijk a/d Rijn", "Katwijk aan de Rijn", "Katwijk aan den Rijn", "Katwijk aan Zee", "Katwijk Aan Zee", "Katwijk-Midden", "Keldonk", "Kelpen-Oler", "Kerkrade", "Klazienaveen", "Klimmen", "Klundert", "Koewacht", "Kollum", "Kollumerland", "Kollumerzwaag", "Koningsbosch", "Kootstertille", "Kootwijkerbroek", "Korrewegwijk", "Kortenhoef", "Koudum", "Krimpen a/d IJssel", "Krimpen a/d Yssel", "Krimpen aan de Yssel", "Krimpen aan den IJssel", "Krimpen aan den Yssel", "Kruisland", "Kuic", "Kuk", "Kunrade", "Kuuk", "Kuyc", "Kwintsheul", "Lakerlopen", "Landsmeer", "Laren", "Leek", "Leerdam", "Leersum", "Leesten", "Leeuwarden", "Leeuwen", "Leiden", "Leiderdorp", "Leimuiden", "Lelystad", "Lemmer", "Lepelstraat", "Leusden", "Leveroy", "Lichtenvoorde", "Lienden", "Liesveld", "Limbricht", "Lindenholt", "Lisse", "Lochem", "Loenen", "Loon", "Loon op Zand", "Loosbroek", "Lopik", "Losser", "Lunetten", "Lunteren", "Maarn", "Maarsbergen", "Maarssen", "Maasbracht", "Maasbree", "Maasdijk", "Maassluis", "Maastricht", "Made", "Maestricht", "Magele", "Makkum", "Mantgum", "Margraten", "Mariaheide", "Mariarade", "Markelo", "Marken", "Marrum", "Marssum", "Marsum", "Medemblik", "Meer", "Meerhoven", "Meerssen", "Melick", "Menaam", "Menaldum", "Meppel", "Mere", "Merkelbeek", "Middelbeers", "Middelburg", "Middelharnis", "Mierlo", "Mijdrecht", "Mijnsheerenland", "Minnertsga", "Monnickendam", "Monster", "Montfoort", "Montfort", "Murmerwoude", "Muschberg en Geestenberg", "Naaldwijk", "Naarden", "Neder-Hardinxveld", "Nederhemert", "Nederhemert-Noord", "Nederweert", "Nederland", "Neede", "Neerijnen", "Nes", "Nieuw-Helvoet", "Nieuw-Lekkerland", "Nieuw-Loosdrecht", "Nieuw-Lotbroek", "Nieuw-Vossemeer", "Nieuwegein", "Nieuwehorne", "Nieuwenhoorn", "Nieuwkoop", "Nijkerk", "Nijmegen", "Noardburgum", "Noordbergum", "Noordhorn", "Noordwijk-Binnen", "Noordwijkerhout", "Noordwolde", "Nuenen", "Nunspeet", "Nuth", "Odiliapeel", "Oegstgeest", "Oene", "Oenkerk", "Oentsjerk", "Oerle", "Oeteldonk", "Offenbeek", "Oirsbeek", "Oirschot", "Oisterwijk", "Oldeboorn", "Oldebroek", "Oldehaske", "Oldehove", "Oldemarkt", "Oldenzaal", "Olst", "Oost-Vlieland", "Oostelbeers", "Oosterbeek", "Oosterhout", "Oostermeer", "Oosterpark", "Ootmarsum", "Op-Zeeland", "Opeinde", "Opmeer", "Oppenhuizen", "Opperdoes", "Oranjewijk", "Oranjewoud", "Oss", "Otterlo", "Oud-Beijerland", "Oud-Loosdrecht", "Ouddorp", "Oude Pekela", "Oude Wetering", "Oudega", "Oudehaske", "Oudemirdum", "Ouderkerk a/d Amstel", "Ouderkerk aan de Amstel", "Oudeschoot", "Oudewater", "Overberg", "Overloon", "Papendrecht", "Peeldorp", "Pijnacker", "Poeldijk", "Posterholt", "Purmerend", "Puth", "Putten", "Raalte", "Randenbroek", "Randwijk", "Reduzum", "Reek", "Reeuwijk", "Renesse", "Renkum", "Reuver", "Rheden", "Rhenen", "Rhoon", "Ridderkerk", "Rijnsburg", "Rijswijk", "Rinsumageast", "Rinsumageest", "Roermond", "Roordahuizum", "Roosendaal", "Rotterdam", "Rottevalle", "Rozendaal", "Rucphen", "Ruinen", "Sappemeer", "Sas van Gent", "Sassenheim", "Scadewic", "Schadewijk", "Schagen", "Schaijk", "Schalkhaar", "Scharendijke", "Scharnegoutum", "Scheveningen", "Schiedam", "Schiermonnikoog", "Schijndel", "Schin op Geul", "Schinnen", "Schinveld", "Schoonebeek", "Schoonhoven", "Seelandt", "Selant", "Sellingen", "Sexbierum", "Sibbe", "Simpelveld", "Sint Annaparochie", "Sint Anthonis", "Sint Jacobiparochie", "Sint Jansklooster", "Sint Nicolaasga", "Sint Nikolaasga", "Sint Odiliënberg", "Sint-Michielsgestel", "Sint-Oedenrode", "Sittard", "Sixbierum", "Sleen", "Sliedrecht", "Slochteren", "Sluis", "Sluiskil", "Sneek", "Soest", "Someren", "Son", "Son en Breugel", "Spakenburg", "Spankeren", "Spechtenkamp", "Spijkenisse", "Stadskanaal", "Staphorst", "Steenbergen", "Steenwijk", "Steenwijkerwold", "Steggerda", "Stein", "Sterrenberg", "Stiens", "Strijen", "Stroe", "Suameer", "Sumar", "Surhuisterveen", "Surhuisterveensterheide", "Surhuizum", "Tegelen", "Ternaard", "Terneuzen", "Terschuur", "The Hague", "Tholen", "Tiel", "Tietjerk", "Tijnje", "Tilburg", "Tjum", "Tjummarum", "Tongelre", "Tubbergen", "Tuk", "Twello", "Twijzel", "Twijzelerheide", "Tynaarlo", "Tytsjerk", "Tzum", "Tzummarum", "Ubachsberg", "Uddel", "Uden", "Uitgeest", "Uithoorn", "Ulrum", "Urk", "Urmond", "Utrecht", "Vaals", "Vaassen", "Valburg", "Valkenburg", "Valkenswaard", "Varsseveld", "Veendam", "Veenendaal", "Veenwouden", "Veere", "Veghel", "Veldhoven", "Velp", "Velsen", "Velsen-Zuid", "Venlo", "Venloen op Zand", "Venray", "Vianen", "Villapark", "Vlaardingen", "Vlagtwedde", "Vlissingen", "Vlist", "Vlodrop", "Voerendaal", "Volendam", "Volkel", "Vollenhove", "Vondelwijk", "Voorburg", "Voorhout", "Voorschoten", "Voorst", "Voorthuizen", "Vreeland", "Vries", "Vriezenveen", "Vroomshoop", "Vught", "Waalre", "Waalwijk", "Waddinxveen", "Wageningen", "Wâlterswâld", "Wanneperveen", "Warga", "Warnsveld", "Warten", "Wartena", "Waspik", "Wassenaar", "Weert", "Weesp", "Wekerom", "Welberg", "Wellerlooi", "Wergea", "Werkendam", "West-Terschelling", "Westdorpe", "Westerhaar-Vriezenveensewijk", "Westervoort", "Wierden", "Wijchen", "Wijhe", "Wijk bij Duurstede", "Wijk en Aalburg", "Wilbertoord", "Willemstad", "Wilp", "Winschoten", "Winsum", "Winterswijk", "Wirdum", "Wisch", "Woensdrecht", "Woerden", "Wolfheze", "Wolvega", "Wommels", "Workum", "Woudenberg", "Woudrichem", "Woudsend", "Wouterswoud", "Wouterswoude", "Yerseke", "Ypenburg", "Zaamslag", "Zaandam", "Zaandijk", "Zaanstad", "Zaltbommel", "Zandvoort", "Zeeland", "Zeewolde", "Zeist", "Zelant", "Zelhem", "Zélland", "Zetten", "Zevenaar", "Zijtaart", "Zoetermeer", "Zuidhorn", "Zuidlaren", "Zundert", "Zutphen", "Zwaagwesteinde", "Zwartebroek", "Zwijndrecht", "Zwolle"];
