var mixins = {
    addMenuOption: function(text, callback, className, xIn, yIn) {
        //rewrote the menu factory to make more robust
        var x = xIn;
        var y = yIn;
        var txt = game.add.text(x, y, text, style.navitem.base);
        
        // use the anchor method to center if startX set to center.
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback);
        txt.events.onInputOver.add(function (target) {
          target.setStyle(style.navitem.hover);
        });
        txt.events.onInputOut.add(function (target) {
          target.setStyle(style.navitem.base);
        });

    }
};
