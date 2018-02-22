var Service = function () {
    var contracts = [
        '0x944f35cb015659C7c10E0cb8e9dB40e09920AA37',
        '0xAF339E9cBd85ce62135048b2b6160525CC2cd42b'
    ];

   function getGames() {
       return contracts;
   }

    return {
        getGames: getGames
    }
};

var service = new Service();