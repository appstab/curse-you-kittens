define('app',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _desc, _value, _class;

  var PlayerRank = (_dec = (0, _aureliaFramework.computedFrom)('hasKitten', 'gotKitten'), (_class = function () {
    function PlayerRank(name, hasKitten, gotKitten) {
      _classCallCheck(this, PlayerRank);

      this.name = name;
      this.hasKitten = hasKitten;
      this.gotKitten = gotKitten;
    }

    _createClass(PlayerRank, [{
      key: 'difference',
      get: function get() {
        return this.hasKitten - this.gotKitten;
      }
    }]);

    return PlayerRank;
  }(), (_applyDecoratedDescriptor(_class.prototype, 'difference', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'difference'), _class.prototype)), _class));

  var App = exports.App = function () {
    function App() {
      var _this = this;

      _classCallCheck(this, App);

      this.ranking = [];
      this.inputKittenFrom = undefined;
      this.inputKittenTo = undefined;
      this.newPlayer = undefined;
      this.db = firebase.firestore();

      this.onNewPlayer = function () {
        if (!_this.newPlayer) {
          return;
        }

        _this.db.collection('players').doc(_this.newPlayer).set({ hasKitten: 1, gotKitten: 0 }).then(function (res) {
          _this.players.push(_this.newPlayer);
          _this.newPlayer = undefined;
        });
      };

      this.onKitten = function () {
        var playerFrom = _this.ranking.find(function (i) {
          return i.name === _this.inputKittenFrom;
        });
        var playerTo = _this.ranking.find(function (i) {
          return i.name === _this.inputKittenTo;
        });

        if (_this.inputKittenFrom === _this.inputKittenTo) {
          return;
        }

        if (playerFrom) {
          playerFrom.hasKitten++;
        } else {
          playerFrom = new PlayerRank(_this.inputKittenFrom, 1, 0);
          _this.ranking.push(playerFrom);

          var playerFromRef = _this.db.collection('players').doc(playerFrom.name);

          playerFromRef.get().then(function (doc) {
            if (!doc.exists) {
              playerFromRef.set({ hasKitten: 1, gotKitten: 0 });
            } else {
              playerFromRef.update({ hasKitten: firebase.firestore.FieldValue.increment(1) });
            }
          });
        }

        if (playerTo) {
          playerTo.gotKitten++;
        } else {
          playerTo = new PlayerRank(_this.inputKittenTo, 0, 1);
          _this.ranking.push(playerTo);

          var playerToRef = _this.db.collection('players').doc(playerTo.name);

          playerToRef.get().then(function (doc) {
            if (!doc.exists) {
              playerToRef.set({ hasKitten: 0, gotKitten: 1 });
            } else {
              playerToRef.update({ gotKitten: firebase.firestore.FieldValue.increment(1) });
            }
            _this.sortRanking();
          });
        }
      };

      this.message = 'Hello World!';
      this.players = [];
    }

    App.prototype.attached = function attached() {
      var _this2 = this;

      this.db.collection('players').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          var playerStats = doc.data();
          _this2.ranking.push(new PlayerRank(doc.id, playerStats.hasKitten, playerStats.gotKitten));
          _this2.players.push(doc.id);
          _this2.sortRanking();
        });
      });
    };

    App.prototype.populate = function populate() {
      var _this3 = this;

      this.players.forEach(function (player) {
        return _this3.ranking.push(new PlayerRank(player, 0, 0));
      });
    };

    App.prototype.sortRanking = function sortRanking() {
      this.ranking.sort(function (a, b) {
        return b.difference - a.difference;
      });
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><h1>Purrr</h1><div><input type=\"text\" name=\"newPlayer\" id=\"newPlayer\" value.bind=\"newPlayer\"> <button type=\"button\" click.delegate=\"onNewPlayer()\">Add Player</button></div><br><form role=\"form\" submit.delegate=\"onKitten()\"><select name=\"kitten-from\" id=\"kitten-from\" value.bind=\"inputKittenFrom\"><option value=\"undefined\">Someone</option><option repeat.for=\"player of players\" value.bind=\"player\">${player}</option></select> <b>has kittened</b> <select name=\"kitten-to\" id=\"kitten-to\" value.bind=\"inputKittenTo\"><option value=\"undefined\">Someone else</option><option repeat.for=\"player of players\" value.bind=\"player\">${player}</option></select> <button type=\"submit\">Meow!</button></form><br><section><table><thead><tr><th>Name</th><th>Has Kitten</th><th>Got Kitten</th><th>Points</th></tr></thead><tbody><tr repeat.for=\"player of ranking\"><td>${player.name}</td><td>${player.hasKitten}</td><td>${player.gotKitten}</td><td>${player.difference}</td></tr></tbody></table></section></template>"; });
//# sourceMappingURL=app-bundle.js.map