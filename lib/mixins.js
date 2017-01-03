var mixins = {
    addMenuOption: function(text, callback, xIn, yIn) {
        //rewrote the menuoption factory to make more robust
        var x = xIn;
        var y = yIn;
        var txt = game.add.text(x, y, text, style.navitem.base);
        
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
