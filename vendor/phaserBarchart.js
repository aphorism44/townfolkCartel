Phaser.Plugin.BarchartPlugin = function (game, parent) {
	Phaser.Plugin.call(this, game, parent);
};

Phaser.Plugin.BarchartPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.BarchartPlugin.prototype.constructor = Phaser.Plugin.SamplePlugin;

Phaser.Plugin.BarchartPlugin.prototype.createChart = function (valueArray, x, y, label) {
    this.x = x;
    this.y = y;
    this.labelText = label;
    this.graphGroup = game.add.group();
    
    this.graphLabel = game.add.text(this.x + 75, this.y - 30, this.labelText, {
        font: "24px The Minion"
        , fill: "#000000"
    });
    this.lowYAxis = game.add.text(this.x - 50, this.y + 180, '', {
        font: "24px The Minion"
        , fill: "#000000"
    });
    this.highYAxis = game.add.text(this.x - 50, this.y, '', {
        font: "24px The Minion"
        , fill: "#000000"
    });
    
    
    this.updateChart(valueArray);
};

Phaser.Plugin.BarchartPlugin.prototype.updateChart = function (valueArray) {
    //valueArray is an array of BigNumbers to be graphed
    this.vArray = valueArray;
    this.graphGroup.removeAll();
    var graphBg = new Phaser.Rectangle(this.x, this.y, 400, 200);
    game.debug.geom(graphBg, '#000000');
    var arrayL = Math.min(20, valueArray.length);
    var barWidth = 400 / arrayL;
    var minValue = new BigNumber(0);
    var maxValue = new BigNumber(this.vArray.reduce(function(a, b) { return a.greaterThan(b)? a: b; }, minValue));
    var barDiff = maxValue.minus(minValue);
    
    this.lowYAxis.text = minValue;
    this.highYAxis.text = maxValue;
    
    for (var i = 0; i < arrayL; i++) {
        //turn number into a percentage of the barDiff, and show on the Y-axis of 200 as needed
        var percent = this.vArray[i].minus(minValue).dividedBy(barDiff);
        var isDebt = percent < 0? true: false;
        percent = Math.abs(percent);
        var bar = new Phaser.Rectangle(this.x + (barWidth * i), this.y + 200, barWidth + 1, -1 * (200 * percent));
        //if amount is loss instead of gain, print bar in red
        if (isDebt)
            game.debug.geom(bar, 'rgba(239, 8, 8, 0.96)');
        else
            game.debug.geom(bar, 'rgba(221, 200, 43, 0.89)');
    }
}