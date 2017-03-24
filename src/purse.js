export default class Purse {
    constructor(app) {
        this.app = app;

        this.gold = Number(window.localStorage.getItem("catacombChaosGold") || 0);
    }

    addGold(n) {
        if (n <= 0) return;
        
        // TODO: Play nice coin sound
        this.gold += n;

        console.log("gold:", this.gold, "(+" + n + ")");
    }

    createGoldEffect(pos) {

    }
}
