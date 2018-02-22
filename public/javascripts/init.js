var Initializer = function Initializer() {
    var self = this;
    this.account;

    this.init = function () {
        window.addEventListener('load', function () {
            if (typeof web3 !== 'undefined') {
                console.log('Metamask ON.');

                window.web3 = new Web3(web3.currentProvider);
            } else {
                console.log('Running locally.');

                window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
            }

            setAccount();
        });
    }

    function setAccount() {
        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");

                return;
            }

            if (accs.length == 0) {
                alert("No accounts. Make sure your Ethereum client is configured correctly.");

                return;
            }

            self.account = accs[0];
        });
    }
}

var initializer = new Initializer();

initializer.init();
