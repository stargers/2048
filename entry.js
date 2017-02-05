
require("./style.css");
var util = require('./util.js');
var blockStore = require('./blockStore.js');
var event = require('./event.js');




event.on('add_block', function() {
    console.log('item number', blockStore.itemNumber());
    console.log(blockStore.noSpace());
    if (!blockStore.noSpace()) {
        console.log('all block has been moved');
        blockStore.update();
        console.log('score:',blockStore.score);
        scoreDiv.innerHTML = blockStore.score;
        console.log(blockStore.items);
        blockStore.addRandomBlock();
    } else {
       blockStore.confirmStart();
    }
});


var scoreDiv = util.$('#score');
scoreDiv.innerHTML = 0;
blockStore.setContainer('.block-container');

// init the game
blockStore.init();

util.addEvent(document, 'keydown', function(e) {
    var dire = e.key,
        moveFlag = false;
    blockStore.move(dire);
})
