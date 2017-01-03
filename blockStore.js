var util = require('./util.js');
var event = require('./event.js');


console.log('blockStore enter');

var unitDist = 120,
    leftLine = 20,
    topLine = 20;

//create new random number
function randomNumber(range) {
    var random = Math.floor(Math.random() * range);
    return random;
}

var CONST_DERECTION = {
    'LEFT': 'ArrowLeft',
    'RIGHT': 'ArrowRight',
    'DOWN': 'ArrowDown',
    'UP': 'ArrowUp'
};

var blockStore = {
    items: new Array(16),

    init:function(){
    	for(var i = 0;i < 16;i++){
    		this.items[i] = null;
    	}

    },

    ItemNumber:function(){
    	return 16 - this.emptyItem().length;
    },

    emptyItem: function(){
    	var empty = [];
    	this.items.forEach(function(value,index){
    		if(!value){
    			empty.push(index);
    		}
    	})

    	return empty;
    },

    emptyItemLength: function() {
        return this.emptyItem().length
    },

    removeEmptyIndex: function() {
    	var currentEmpty = this.emptyItem();

        var index = randomNumber(currentEmpty.length);

        var result = currentEmpty.splice(index,1)[0];
        return result;
    },

    container: null,

    setContainer: function(className) {
        this.container = util.$(className);

        return this.container;
    },

    getContainer: function() {
        return this.container;
    },

    createBlock: function(newIndex, text) {
        if (!!this.items[newIndex]) return false;

        console.log('========create element========');
        console.log('element index is :' + newIndex);
        var newEl = document.createElement('div'),
            row = Math.floor(newIndex / 4),
            col = newIndex % 4;
        newEl.innerHTML = text;

        newEl.classList.add('number-block');
        newEl.style.left = leftLine + unitDist * col + 'px';
        newEl.style.top = topLine + unitDist * row + 'px';

        this.container.appendChild(newEl);

        newEl.startPoint = newIndex;
        newEl.value = +text;
        newEl.setAttribute('value',text);

        this.items[newIndex] = newEl;

        return newEl;
    },
    addRandomBlock: function(text, index) {
        return this.createBlock(index || this.removeEmptyIndex(), text || (randomNumber(2) + 1) * 2);
    },

    moveHistory: [],
    /**
     * control block matrix's move animation
     * @param  {[type]} moveDire [move direction]
     * @return {[type]}          [description]
     */
    move: function(moveDire) {
        var len = this.items.length,
            self = this,
            moveNumber = 0,
            noMoveHappend = true,
            prevValue = null;
		console.log('============current move dire is ' + moveDire);
        if (moveDire == CONST_DERECTION.UP || moveDire == CONST_DERECTION.LEFT) {
            for (var i = 0; i < len; i++) {
                var value = self.items[i];
                if (!value) continue;
                console.log(value);
                ++moveNumber;

                value.move = self.judgeMoveStep(value.startPoint, moveDire);
                var moveStep = {};
                if(moveNumber % 2 ==0){
                	console.log('=============prev value');
                	console.log(prevValue);
                }

                moveStep[value.move.arrow] = parseInt(util.getStyle(value, value.move.arrow)) + value.move.step * unitDist;

                util.startmove(value, moveStep, 20, function(value) {
                    console.log('endPoint is :');
                    console.log(value.move.endPoint);
                    console.log('startPoint is :');
                    console.log(value.startPoint);

                    if (value.move.endPoint != value.startPoint) {
                    	noMoveHappend = false;
                        self.items[value.move.endPoint] = value;
                        self.items[value.startPoint] = null;
                        value.startPoint = value.move.endPoint;
                    }
                    console.log('===============');

					console.log(noMoveHappend);

                    !noMoveHappend && event.emit('add_block', moveNumber);         
                    console.log(self.items);
                })
                prevValue = value;
            }
        } else if (moveDire == CONST_DERECTION.DOWN || moveDire == CONST_DERECTION.RIGHT) {
            for (var i = len - 1; i >= 0; i--) {
                var value = self.items[i];
                if (!value) continue;
				++moveNumber;

                value.move = self.judgeMoveStep(value.startPoint, moveDire);
                var moveStep = {};

                moveStep[value.move.arrow] = parseInt(util.getStyle(value, value.move.arrow)) + value.move.step * unitDist;
                util.startmove(value, moveStep, 20, function(value) {
                    console.log('endPoint is :');
                    console.log(value.move.endPoint);
                    console.log('startPoint is :');
                    console.log(value.startPoint);

                    if (value.move.endPoint != value.startPoint) {
                    	noMoveHappend = false;
                        self.items[value.move.endPoint] = value;
                        self.items[value.startPoint] = null;
                        value.startPoint = value.move.endPoint;
                    }
                    console.log('===============');
					console.log(noMoveHappend);
                    !noMoveHappend && event.emit('add_block',moveNumber); 
                    console.log(self.items);
                })
            }
        }
    },



    /**
     * judge the block of importIndex how to move,direction and step
     * @param  {[type]} currentIndex [importIndex of the block]
     * @param  {[type]} direction    [current move direction]
     * @return {[type]}              [description]
     */
    judgeMoveStep: function(currentIndex, direction) {
        var step = 0,
            arrow = '',
            endPoint = 0,
            self = this;
        switch (direction) {
            //left
            case CONST_DERECTION.LEFT:
                var leftDist = step = currentIndex % 4;
                arrow = 'left';
                for (var i = 1; i <= leftDist; i++) {
                    !!self.items[currentIndex - i] && step--;
                };
                step = -step;
                endPoint = currentIndex + step;
                break;
                //right
            case CONST_DERECTION.RIGHT:
                var leftDist = step = 4 - 1 - currentIndex % 4;
                arrow = 'left';
                for (var i = currentIndex + 1; i % 4 != 0; i++) {
                    !!self.items[i] && step--;
                };
                endPoint = currentIndex + step;
                break;
                //up
            case CONST_DERECTION.UP:
                var topDist = step = Math.floor(currentIndex / 4);
                console.log(step);

                arrow = 'top';
                var prev = currentIndex - 4;
                while (prev >= 0) {
                    !!self.items[prev] && step--;
                    prev -= 4;
                };
                step = -step;
                console.log('up step is ' + step);
                endPoint = currentIndex + step * 4;
                break;
                //down
            case CONST_DERECTION.DOWN:
                var topDist = step = 4 - 1 - Math.floor(currentIndex / 4);
                arrow = 'top';
                var next = currentIndex + 4;

                while (next < 16) {
                    !!self.items[next] && step--;
                    next += 4;
                };
                endPoint = currentIndex + step * 4;
                break;
        }

        return {
            step: step,
            arrow: arrow,
            endPoint: endPoint
        };
    }


}


module.exports = blockStore;
