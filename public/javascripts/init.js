var Initializer = function Initializer() {
    var self = this;
    this.account;

    this.init = function () {
        window.addEventListener('load', function () {
            if (typeof web3 !== 'undefined') {
                bootbox.alert('Metamask ON.');

                window.web3 = new Web3(web3.currentProvider);
            } else {
                bootbox.alert('You need to install MetaMask. Try https://metamask.io/');

                return;
            }

            setAccount();
        });
    }

    function setAccount() {
        web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                bootbox.alert('There was an error fetching your accounts.');

                return;
            }

            if (accs.length == 0) {
                bootbox.alert('No accounts. Make sure your Ethereum client is configured correctly');

                return;
            }

            self.account = accs[0];
        });
    }
}

var initializer = new Initializer();

initializer.init();
