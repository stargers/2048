console.log('render start');

require("./style.css");
var util = require('./util.js');
var blockStore = require('./blockStore.js');
var event = require('./event.js');


event.on('add_block', function(num) { 
	if(num == blockStore.ItemNumber()){
		console.log('all block has been moved');
		blockStore.addRandomBlock();
	}
}); 


blockStore.init();
console.log(blockStore.items);
//初始化新建两个 block
blockStore.setContainer('.block-container');
blockStore.addRandomBlock(2,0);
blockStore.addRandomBlock(2);






util.addEvent(document,'keydown',function(e){
	var dire = e.key,
		moveFlag = false;
	blockStore.move(dire);
	
})


