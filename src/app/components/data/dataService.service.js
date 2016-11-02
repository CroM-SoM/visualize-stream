(function () {
  'use strict';

  angular
    .module('test')
    .service('dataService', dtservice);

  /** @ngInject */
  // function dtservice($http, appConfig, $log) {
  function dtservice($http, $log, moment, appConfig, $q) {

    var vm = this;

    // Here we will store data.
    vm.userObject = {};

    // Creates user object.
    vm.createUser = function (data) {
      vm.userObject = data;
      vm.checkUserData();
      return vm.userObject;
    }

    vm.citiesList = ["'s Gravenmoer", "'s-Gravenhage", "'s-Gravenland", "'s-Gravenzande", "'s-Heerenberg", "'s-Hertogenbosch", "'t Hofke", "Aalburg", "Aalsmeer", "Aalten", "Aarle-Rixtel", "Aduard", "Akkrum", "Alblasserdam", "Aldeboarn", "Alkmaar", "Almelo", "Almen", "Almere", "Almere Stad", "Almkerk", "Alphen a/d Rijn", "Alphen aan den Rijn", "America", "Amerongen", "Amersfoort", "Amstelveen", "Amstenrade", "Amsterdam", "Amsterdam-Zuidoost", "Andelst", "Anjum", "Anloo", "Annaparochie", "Apeldoorn", "Appingedam", "Arcen", "Arnhem", "Assen", "Asten", "Augustinusga", "Axel", "Baak", "Baarle-Nassau", "Baarn", "Balk", "Barchem", "Barendrecht", "Barneveld", "Bedum", "Beek", "Beekbergen", "Beesel", "Bennebroek", "Bennekom", "Benthuizen", "Berg", "Berg aan de Maas", "Berg en Dal", "Bergeijk", "Bergen op Zoom", "Bergharen", "Berghem", "Bergschenhoek", "Bergum", "Berkel en Rodenrijs", "Berlikum", "Berltsum", "Best", "Beuningen", "Beverwijk", "Biddinghuizen", "Bilgaard", "Birdaard", "Bladel", "Blaricum", "Bleiswijk", "Bloemendaal", "Blokzijl", "Boc's Mere", "Bodegraven", "Boekel", "Boelenslaan", "Bolsward", "Boornbergum", "Borculo", "Borger", "Born", "Borne", "Borsele", "Borssele", "Boskamp", "Boskoop", "Boven-Hardinxveld", "Boxmeer", "Boxtel", "Breda", "Bredevoort", "Bredeweg", "Breedeweg", "Breugel", "Breukelen", "Brielle", "Britsum", "Broek in Waterland", "Broek op Langedijk", "Broekhem", "Broeksterwâld", "Broeksterwoude", "Bruinisse", "Brummen", "Brunssum", "Buitenpost", "Bunnik", "Bunschoten", "Bunschoten-Spakenburg", "Burdaard", "Burgemeesterswijk", "Burgh", "Burgum", "Bussum", "Camminghaburen", "Capelle a/d IJssel", "Capelle a/d Yssel", "Capelle aan de IJssel", "Capelle aan de Yssel", "Capelle aan den IJssel", "Capelle aan den Yssel", "Capelle-West", "Castricum", "Ceuclum", "Coevorden", "Cranendonck", "Cuijk", "Culemborg", "Dalen", "Dalfsen", "Damwâld", "Damwoude", "De Bilt", "De Compagnie", "De Doornakkers", "De Graaf", "De Horst", "De Knijpe", "De Knipe", "De Lier", "De Steeg", "De Westereen", "Deinum", "Delden", "Delfshaven", "Delft", "Delfzijl", "Den Bosch", "Den Burg", "Den Haag", "Den Ham", "Den Helder", "Den Oever", "Deventer", "Diemen", "Diepenheim", "Dieren", "Dinteloord", "Dirksland", "Doenrade", "Doesburg", "Doetinchem", "Dokkum", "Dongen", "Doorn", "Doorwerth", "Dordrecht", "Drachster Compaghnie", "Drachten", "Drachtstercompagnie", "Driebergen-Rijsenburg", "Driel", "Driemond", "Drimmelen", "Drogeham", "Dronrijp", "Dronryp", "Dronten", "Droogeham", "Druten", "Duiven", "Duivendrecht", "Dwingeloo", "Eastermar", "Echtenerbrug", "Edam", "Ede", "Ederveen", "Eefde", "Eerbeek", "Eerde", "Eersel", "Egmond aan Zee", "Eibergen", "Eijsden", "Eindhoven", "Elburg", "Ellecom", "Elsloo", "Elst", "Emmeloord", "Emmen", "Emmer-Compascuum", "Emst", "Enkhuizen", "Ens", "Enschede", "Epe", "Epse", "Ermelo", "Erp", "Feanwâlden", "Ferwerd", "Ferwert", "Flushing", "Franeker", "Garderen", "Garijp", "Garyp", "Geertruidenberg", "Geffen", "Geldermalsen", "Geldrop", "Geleen", "Gendringen", "Gennep", "Giekerk", "Giessenburg", "Giethoorn", "Goedereede", "Goes", "Goirle", "Goor", "Gorinchem", "Gorredijk", "Gorssel", "Gouda", "Goutum", "Grave", "Grijpskerk", "Groenswaard", "Groesbeek", "Groningen", "Grootegast", "Grou", "Grouw", "Gulden Bodem", "Gytsjerk", "Haaksbergen", "Haamstede", "Haaren", "Haarlem", "Haastrecht", "Haelen", "Hague", "Halfweg", "Hallum", "Halsteren", "Hardegarijp", "Hardenberg", "Harderwijk", "Haren", "Harenkarspel", "Harfsen", "Harkema", "Harkema-Opeinde", "Harlingen", "Harskamp", "Hasselt", "Hattem", "Havelte", "Hedel", "Heeg", "Heelsum", "Heemskerk", "Heemstede", "Heer", "Heerde", "Heerenveen", "Heerewaarden", "Heerhugowaard", "Heerjansdam", "Heerlen", "Heesch", "Heeze", "Heiloo", "Heinenoord", "Heino", "Hellevoetsluis", "Helmond", "Hendrik-Ido-Ambacht", "Hengelo", "Hengevelde", "Herkenbosch", "Herveld", "Heteren", "Heusden", "Heythuysen", "Hillegom", "Hilvarenbeek", "Hilversum", "Hoek van Holland", "Hoensbroek", "Hoge Vucht", "Hollum", "Holwerd", "Honselersdijk", "Hoofddorp", "Hoogeveen", "Hoogezand", "Hoogkamp", "Hoogland", "Hoorn", "Hoorn NH", "Horst", "Houten", "Houthem", "Huizen", "Huizum", "Hulst", "Hurdegaryp", "IJlst", "IJsselstein", "Irnsum", "Jirnsum", "Joure", "Jubbega", "Kampen", "Kamperland", "Katwijk", "Katwijk a/d Rijn", "Katwijk aan de Rijn", "Katwijk aan den Rijn", "Katwijk aan Zee", "Katwijk Aan Zee", "Katwijk-Midden", "Keldonk", "Kelpen-Oler", "Kerkrade", "Klazienaveen", "Klimmen", "Klundert", "Koewacht", "Kollum", "Kollumerland", "Kollumerzwaag", "Koningsbosch", "Kootstertille", "Kootwijkerbroek", "Korrewegwijk", "Kortenhoef", "Koudum", "Krimpen a/d IJssel", "Krimpen a/d Yssel", "Krimpen aan de Yssel", "Krimpen aan den IJssel", "Krimpen aan den Yssel", "Kruisland", "Kuic", "Kuk", "Kunrade", "Kuuk", "Kuyc", "Kwintsheul", "Lakerlopen", "Landsmeer", "Laren", "Leek", "Leerdam", "Leersum", "Leesten", "Leeuwarden", "Leeuwen", "Leiden", "Leiderdorp", "Leimuiden", "Lelystad", "Lemmer", "Lepelstraat", "Leusden", "Leveroy", "Lichtenvoorde", "Lienden", "Liesveld", "Limbricht", "Lindenholt", "Lisse", "Lochem", "Loenen", "Loon", "Loon op Zand", "Loosbroek", "Lopik", "Losser", "Lunetten", "Lunteren", "Maarn", "Maarsbergen", "Maarssen", "Maasbracht", "Maasbree", "Maasdijk", "Maassluis", "Maastricht", "Made", "Maestricht", "Magele", "Makkum", "Mantgum", "Margraten", "Mariaheide", "Mariarade", "Markelo", "Marken", "Marrum", "Marssum", "Marsum", "Medemblik", "Meer", "Meerhoven", "Meerssen", "Melick", "Menaam", "Menaldum", "Meppel", "Mere", "Merkelbeek", "Middelbeers", "Middelburg", "Middelharnis", "Mierlo", "Mijdrecht", "Mijnsheerenland", "Minnertsga", "Monnickendam", "Monster", "Montfoort", "Montfort", "Murmerwoude", "Muschberg en Geestenberg", "Naaldwijk", "Naarden", "Neder-Hardinxveld", "Nederhemert", "Nederhemert-Noord", "Nederweert", "Nederland", "Neede", "Neerijnen", "Nes", "Nieuw-Helvoet", "Nieuw-Lekkerland", "Nieuw-Loosdrecht", "Nieuw-Lotbroek", "Nieuw-Vossemeer", "Nieuwegein", "Nieuwehorne", "Nieuwenhoorn", "Nieuwkoop", "Nijkerk", "Nijmegen", "Noardburgum", "Noordbergum", "Noordhorn", "Noordwijk-Binnen", "Noordwijkerhout", "Noordwolde", "Nuenen", "Nunspeet", "Nuth", "Odiliapeel", "Oegstgeest", "Oene", "Oenkerk", "Oentsjerk", "Oerle", "Oeteldonk", "Offenbeek", "Oirsbeek", "Oirschot", "Oisterwijk", "Oldeboorn", "Oldebroek", "Oldehaske", "Oldehove", "Oldemarkt", "Oldenzaal", "Olst", "Oost-Vlieland", "Oostelbeers", "Oosterbeek", "Oosterhout", "Oostermeer", "Oosterpark", "Ootmarsum", "Op-Zeeland", "Opeinde", "Opmeer", "Oppenhuizen", "Opperdoes", "Oranjewijk", "Oranjewoud", "Oss", "Otterlo", "Oud-Beijerland", "Oud-Loosdrecht", "Ouddorp", "Oude Pekela", "Oude Wetering", "Oudega", "Oudehaske", "Oudemirdum", "Ouderkerk a/d Amstel", "Ouderkerk aan de Amstel", "Oudeschoot", "Oudewater", "Overberg", "Overloon", "Papendrecht", "Peeldorp", "Pijnacker", "Poeldijk", "Posterholt", "Purmerend", "Puth", "Putten", "Raalte", "Randenbroek", "Randwijk", "Reduzum", "Reek", "Reeuwijk", "Renesse", "Renkum", "Reuver", "Rheden", "Rhenen", "Rhoon", "Ridderkerk", "Rijnsburg", "Rijswijk", "Rinsumageast", "Rinsumageest", "Roermond", "Roordahuizum", "Roosendaal", "Rotterdam", "Rottevalle", "Rozendaal", "Rucphen", "Ruinen", "Sappemeer", "Sas van Gent", "Sassenheim", "Scadewic", "Schadewijk", "Schagen", "Schaijk", "Schalkhaar", "Scharendijke", "Scharnegoutum", "Scheveningen", "Schiedam", "Schiermonnikoog", "Schijndel", "Schin op Geul", "Schinnen", "Schinveld", "Schoonebeek", "Schoonhoven", "Seelandt", "Selant", "Sellingen", "Sexbierum", "Sibbe", "Simpelveld", "Sint Annaparochie", "Sint Anthonis", "Sint Jacobiparochie", "Sint Jansklooster", "Sint Nicolaasga", "Sint Nikolaasga", "Sint Odiliënberg", "Sint-Michielsgestel", "Sint-Oedenrode", "Sittard", "Sixbierum", "Sleen", "Sliedrecht", "Slochteren", "Sluis", "Sluiskil", "Sneek", "Soest", "Someren", "Son", "Son en Breugel", "Spakenburg", "Spankeren", "Spechtenkamp", "Spijkenisse", "Stadskanaal", "Staphorst", "Steenbergen", "Steenwijk", "Steenwijkerwold", "Steggerda", "Stein", "Sterrenberg", "Stiens", "Strijen", "Stroe", "Suameer", "Sumar", "Surhuisterveen", "Surhuisterveensterheide", "Surhuizum", "Tegelen", "Ternaard", "Terneuzen", "Terschuur", "The Hague", "Tholen", "Tiel", "Tietjerk", "Tijnje", "Tilburg", "Tjum", "Tjummarum", "Tongelre", "Tubbergen", "Tuk", "Twello", "Twijzel", "Twijzelerheide", "Tynaarlo", "Tytsjerk", "Tzum", "Tzummarum", "Ubachsberg", "Uddel", "Uden", "Uitgeest", "Uithoorn", "Ulrum", "Urk", "Urmond", "Utrecht", "Vaals", "Vaassen", "Valburg", "Valkenburg", "Valkenswaard", "Varsseveld", "Veendam", "Veenendaal", "Veenwouden", "Veere", "Veghel", "Veldhoven", "Velp", "Velsen", "Velsen-Zuid", "Venlo", "Venloen op Zand", "Venray", "Vianen", "Villapark", "Vlaardingen", "Vlagtwedde", "Vlissingen", "Vlist", "Vlodrop", "Voerendaal", "Volendam", "Volkel", "Vollenhove", "Vondelwijk", "Voorburg", "Voorhout", "Voorschoten", "Voorst", "Voorthuizen", "Vreeland", "Vries", "Vriezenveen", "Vroomshoop", "Vught", "Waalre", "Waalwijk", "Waddinxveen", "Wageningen", "Wâlterswâld", "Wanneperveen", "Warga", "Warnsveld", "Warten", "Wartena", "Waspik", "Wassenaar", "Weert", "Weesp", "Wekerom", "Welberg", "Wellerlooi", "Wergea", "Werkendam", "West-Terschelling", "Westdorpe", "Westerhaar-Vriezenveensewijk", "Westervoort", "Wierden", "Wijchen", "Wijhe", "Wijk bij Duurstede", "Wijk en Aalburg", "Wilbertoord", "Willemstad", "Wilp", "Winschoten", "Winsum", "Winterswijk", "Wirdum", "Wisch", "Woensdrecht", "Woerden", "Wolfheze", "Wolvega", "Wommels", "Workum", "Woudenberg", "Woudrichem", "Woudsend", "Wouterswoud", "Wouterswoude", "Yerseke", "Ypenburg", "Zaamslag", "Zaandam", "Zaandijk", "Zaanstad", "Zaltbommel", "Zandvoort", "Zeeland", "Zeewolde", "Zeist", "Zelant", "Zelhem", "Zélland", "Zetten", "Zevenaar", "Zijtaart", "Zoetermeer", "Zuidhorn", "Zuidlaren", "Zundert", "Zutphen", "Zwaagwesteinde", "Zwartebroek", "Zwijndrecht", "Zwolle"];
    vm.languageList = ["nl", "NL"];
    // Fix this list of timezonenotations.
    vm.timezoneList = ["Amsterdam", "amsterdam", "Europe/Amsterdam"];

    //avg array average time difference for each user stream
    var avg = [];

    // Updates user object.
    vm.checkUserData = function () {
      for (var i = 0; i < vm.userObject.length; i++) {
        // Fix substring only take first 5 characters to compare.
        var cityvalue = vm.include(vm.citiesList, vm.userObject[i].user.location);
        var language = vm.include(vm.languageList, vm.userObject[i].user.lang);
        var timezone = vm.include(vm.timezoneList, vm.userObject[i].user.time_zone);
        // Push values and keys to new nested property.
        vm.userObject[i].tourist = {
          'cityval': cityvalue,
          'langval': language,
          'timeval': timezone
        };
        vm.checkUserHistory(vm.userObject[i]);
      }
      return vm.userObject;
    }

    // Returns user history.
    vm.checkUserHistory = function (user) {
      // Only check users that don't live in The Netherlands.
      if (user.tourist.cityval === true && user.tourist.cityval !== null) {
        return;
      } else {
        // Checks database for tweets from users.
        vm.apiMethod('data/user/' + user.user.id)
          .then(function (history) {
            var dateCheck = vm.dates(history, user);
            vm.spotlight(history).then(function (txt) {
              /*$log.log("this is the stream text ready for spotlight :  " + txt.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,' '));*/
              vm.apiMethod('similarity/' + txt.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, ' '))
                .then(function (similarities) {
                  $log.log("similarities : " + JSON.stringify(similarities));
                })

            })
            return user.tourist_history = {
              'history': history,
              'dateCheck': dateCheck
            };
          })
      }
    }

    // Returns user history from Twitter API.
    vm.checkUserHistoryStream = function (user) {
      // Only check users that don't live in The Netherlands.
      if (user.tourist.cityval === true && user.tourist.cityval !== null) {
        return;
      } else {
        // Checks database for tweets from users.
        vm.apiMethod('api/user/' + user.user.id)
          .then(function (history) {
            var dateCheck = vm.dates(history, user);
            return user.tourist_history = {
              'history': history,
              'dateCheck': dateCheck
            };
          })
      }
    }

    // checks te length of the users history array
    vm.dates = function (history, user) {
      // calculate the average here for all time difference based on history.data.length but it should return form checkUserHistoryStream which it user stream return form API
      if (history.data.length > 20) {
        return true;
      } else {
        if (history.data.length > 1) {
          vm.compareDates(history, user);
          //return true;
        }
        return false;
      }
    }

    //should return an array of the time between compared dates and calculate the average time.
    vm.compareDates = function (history, user) {
      for (var i = 0; i < history.data.length; i++) {
        var now = history.data[i].createdAt;
        //$log.log("for " + user.id);
        i++;
        var then = history.data[i].createdAt;
        //$log.log("between " + now + " and " + then);
        var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
        var d = moment.duration(ms);
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        //$log.log("this is the difference:  " + s);
        avg.push(Math.abs(Math.floor(d.asHours()) + moment.utc(ms)));
        return s;
      }
    }

    vm.spotlight = function (history) {
      //collect all stream text and send it back to spotlight api
      var txtStream = "";
      var q = $q.defer();
      for (var i = 0; i < history.data.length; i++) {
        txtStream += history.data[i].row.text;
        if (i == history.data.length - 1) {
          q.resolve(txtStream);
        }
      }
      return q.promise;
    }

    // Compares the passed in object with passed in array.
    vm.include = function (arr, obj) {
      if (!obj || !obj.length) {
        return;
      }
      for (var i = 0; i < arr.length; i++) {
        var sub = obj.slice(0, 7);
        if (arr[i].indexOf(sub) != -1) return true;
      }
      return false;
    }

    // API method retrieves data from database
    vm.apiMethod = function (request) {
      return $http({
        method: 'GET',
        url: appConfig.baseUrl + '/stream/' + request
      }).then(function successCallback(response) {
        // return vm.checkUserData(response.data);
        return response.data;
        // This callback will be called asynchronously
        // when the response is available.
      }, function errorCallback(response) {
        return response;
        // Called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }

  }

})();
