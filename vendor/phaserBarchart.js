Phaser.Plugin.BarchartPlugin = function (game, parent) {
	Phaser.Plugin.call(this, game, parent);
};

Phaser.Plugin.BarchartPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.BarchartPlugin.prototype.constructor = Phaser.Plugin.SamplePlugin;

Phaser.Plugin.BarchartPlugin.prototype.createChart = function (n) {
	this.n = n;
    /*
    this.crossFadeBitmap = this.game.make.bitmapData(this.game.width, this.game.height);
	this.crossFadeBitmap.rect(0, 0, this.game.width, this.game.height, style);
	this.overlay = this.game.add.sprite(0, 0, this.crossFadeBitmap);
	this.overlay.alpha = 0;
	var fadeTween = this.game.add.tween(this.overlay);
	fadeTween.to({ alpha:1 }, time * 1000);
	
    fadeTween.onComplete.add(function() {
		this.game.state.start(nextState);
	}, this);
    
    fadeTween.start();
    */
};

Phaser.Plugin.BarchartPlugin.prototype.testIt = function () {
    console.log(this.n);
};