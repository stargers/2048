console.log('render start');

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
        console.log(blockStore.items);
        blockStore.addRandomBlock();
    } else {
        console.log('game over');
    }
});


blockStore.init();
console.log(blockStore.items);
//初始化新建两个 block
blockStore.setContainer('.block-container');
blockStore.addRandomBlock(2, 0, 0);
blockStore.addRandomBlock(2, 0, 1);
blockStore.addRandomBlock(2, 1, 1);
blockStore.addRandomBlock(4, 0, 2);

// blockStore.addRandomBlock(2,7);





util.addEvent(document, 'keydown', function(e) {
    var dire = e.key,
        moveFlag = false;
    blockStore.move(dire);
})
