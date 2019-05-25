import { computedFrom } from 'aurelia-framework';

class PlayerRank {
  constructor(name, hasKitten, gotKitten) {
    this.name = name;
    this.hasKitten = hasKitten;
    this.gotKitten = gotKitten;
  }

  @computedFrom('hasKitten', 'gotKitten')
  get difference() {
    return this.hasKitten - this.gotKitten;
  }
}

export class App {

  ranking = [];
  inputKittenFrom = undefined;
  inputKittenTo = undefined;
  db = firebase.firestore();

  constructor() {
    this.message = 'Hello World!';
    this.players = ['JB', 'Alex', 'Paul', 'Dave', 'Domi', 'Angela'];
  }

  attached() {
    this.db.collection('players').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const playerStats = doc.data();
        this.ranking.push(new PlayerRank(doc.id, playerStats.hasKitten, playerStats.gotKitten));
        this.sortRanking();
      });
    });
  }

  populate() {
    this.players.forEach(player => this.ranking.push(new PlayerRank(player, 0, 0)));
  }

  onKitten = () => {
    let playerFrom = this.ranking.find(i => i.name === this.inputKittenFrom);
    let playerTo = this.ranking.find(i => i.name === this.inputKittenTo);

    if (this.inputKittenFrom === this.inputKittenTo) { return; }

    if (playerFrom) {
      playerFrom.hasKitten++;
    } else {
      playerFrom = new PlayerRank(this.inputKittenFrom, 1, 0);
      this.ranking.push(playerFrom);

      let playerFromRef = this.db.collection('players').doc(playerFrom.name);

      playerFromRef.get().then(doc => {
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
      playerTo = new PlayerRank(this.inputKittenTo, 0, 1);
      this.ranking.push(playerTo);

      let playerToRef = this.db.collection('players').doc(playerTo.name);

      playerToRef.get().then(doc => {
        if (!doc.exists) {
          playerToRef.set({ hasKitten: 0, gotKitten: 1 });
        } else {
          playerToRef.update({ gotKitten: firebase.firestore.FieldValue.increment(1) });
        }
        this.sortRanking();
      });
    }
  }

  sortRanking() {
    this.ranking.sort((a, b) => b.difference - a.difference);
  }
}
