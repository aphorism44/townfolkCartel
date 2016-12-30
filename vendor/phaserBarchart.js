Phaser.Plugin.BarchartPlugin = function (game, parent) {
	Phaser.Plugin.call(this, game, parent);
};

Phaser.Plugin.BarchartPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.BarchartPlugin.prototype.constructor = Phaser.Plugin.SamplePlugin;

Phaser.Plugin.BarchartPlugin.prototype.createChart = function (valueArray, x, y, width, height, label) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.labelText = label;
    this.graphGroup = game.add.group();
    this.graphLabel = game.add.text(this.x + 100, this.y - 30, this.labelText, {
        font: "24px The Minion"
        , fill: "#000000"
    });
    this.lowYAxis = game.add.text(this.x - 80, this.y + 180, '', {
        font: "24px The Minion"
        , fill: "#000000"
    });
    this.highYAxis = game.add.text(this.x - 80, this.y, '', {
        font: "24px The Minion"
        , fill: "#000000"
    });
    
    this.updateChart(valueArray);
};

Phaser.Plugin.BarchartPlugin.prototype.updateChart = function (valueArray) {
    //valueArray is an array of integers to be graphed
    this.vArray = valueArray;
    this.graphGroup.removeAll();
    this.graphBg = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
    game.debug.geom(this.graphBg, 'rgb(0,0,0)');
    this.arrayLength = Math.max(valueArray.length, 1);
    this.barWidth = this.width / this.arrayLength;
    this.minValue = this.vArray.reduce(function(a, b) { return a < b? a: b; },0);
    this.maxValue = this.vArray.reduce(function(a, b) { return a > b? a: b; }, 1);
    this.lowYAxis.text = this.minValue;
    this.highYAxis.text = this.maxValue;
    //if the nums are all pos/neg, zero will appear somewhere on the y-axis
    this.posGap = Math.max(this.maxValue, 0);
    this.negGap = Math.max(-this.minValue, 0);
    //from y to zeroY are positive values; from zeroY to (y + height) are negative numbers
    this.zeroY = this.y + ((this.height / (this.posGap + this.negGap)) * this.posGap);
    //console.log("zeroY: " + this.zeroY);
    //place bars for each value
    for (var i = 0; i < this.arrayLength; i++) {
        var barLength = 0;
        if (this.vArray[i] < 0) {
            barLength = ((this.y + this.height - this.zeroY) / this.negGap) * -this.vArray[i];
            /*console.log("negative length: " + barLength);
            console.log("negative x: " + (this.x + (this.barWidth * i)));
            console.log("negative y: " + this.zeroY);
            console.log("negative width: " + (this.barWidth - 1));*/
            var bar = new Phaser.Rectangle(this.x + (this.barWidth * i), this.zeroY, this.barWidth - 1, barLength);
            game.debug.geom(bar, 'rgb(232, 71, 23)');
        } else if (this.vArray[i] > 0) {
            barLength = ((this.zeroY - this.y) / this.posGap) * this.vArray[i];
            /*console.log("positive length: " + barLength);
            console.log("positive x: " + (this.x + (this.barWidth * i)));
            console.log("positive y: " + (this.zeroY - barLength));
            console.log("positive width: " + (this.barWidth - 1));*/
            var bar = new Phaser.Rectangle(this.x + (this.barWidth * i), this.zeroY - barLength, this.barWidth - 1, barLength);
            game.debug.geom(bar, 'rgb(68, 217, 32)');
        }
    } //end bar for loop
}