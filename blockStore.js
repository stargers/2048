var util = require('./util.js');
var event = require('./event.js');


console.log('blockStore enter');

var unitDist = 120,
    leftLine = 20,
    topLine = 20,
    moving = false;

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
    items: new Array(4),

    nextItems: new Array(4),

    score: 0,

    init: function() {
        this.score = 0;
        for (var i = 0; i < 4; i++) {
            this.items[i] = new Array(4);
            this.nextItems[i] = new Array(4);
            for (var j = 0; j < 4; j++) {
                this.items[i][j] = null;
                this.nextItems[i][j] = {
                    value: 0,
                    mergeable: true,
                };
            }
        }

                for(var k = 0;k < 3;k++){
            this.addRandomBlock();
        }
    },

    nextItems: [],

    noSpace: function() {
        console.log(this.nextItems);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (!this.nextItems[i][j].value) {
                    return false;
                }
            }
        }
        return true;
    },

    itemNumber: function() {
        var num = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                !!this.nextItems[i][j].value && num++;
            }
        }

        return num;
    },

    getEmptyPos: function() {
        var randomX = parseInt(Math.floor(Math.random() * 4));
        var randomY = parseInt(Math.floor(Math.random() * 4));

        while (true) {
            if (!this.items[randomX][randomY]) {
                break;
            }

            var randomX = parseInt(Math.floor(Math.random() * 4));
            var randomY = parseInt(Math.floor(Math.random() * 4));
        }

        return {
            x: randomX,
            y: randomY
        }
    },

    // ItemNumber:function(){
    //  return 16 - this.emptyItem().length;
    // },

    // emptyItem: function(){
    //  var empty = [];
    //  // this.items.forEach(function(value,index){
    //  //  if(!value){
    //  //      empty.push(index);
    //  //  }
    //  // })

    //     // 

    //  return empty;
    // },

    // emptyItemLength: function() {
    //     return this.emptyItem().length
    // },

    // removeEmptyIndex: function() {
    //  var currentEmpty = this.emptyItem();

    //     var index = randomNumber(currentEmpty.length);

    //     var result = currentEmpty.splice(index,1)[0];
    //     return result;
    // },

    container: null,

    setContainer: function(className) {
        this.container = util.$(className);

        return this.container;
    },

    getContainer: function() {
        return this.container;
    },

    createBlock: function(text, x, y) {

        // console.log('========create element========');
        var newEl = document.createElement('div');
        newEl.innerHTML = text;

        newEl.classList.add('number-block');
        newEl.style.left = leftLine + unitDist * y + 'px';
        newEl.style.top = topLine + unitDist * x + 'px';

        this.container.appendChild(newEl);

        newEl.startPoint = {
            x: x,
            y: y
        };
        newEl.value = +text;
        newEl.setAttribute('value', text);

        this.items[x][y] = newEl;
        this.nextItems[x][y] = {
            value: +text,
            mergeable: true,
        };

        

        return newEl;
    },
    addRandomBlock: function(number, x, y) {
        var pos = this.getEmptyPos();
        x = x == undefined ? pos.x : x;
        y = y == undefined ? pos.y : y;

        // console.log('new block coord is ');
        // console.log('x:', x);
        // console.log('y:', y);

        return this.createBlock(number || (randomNumber(2) + 1) * 2, x, y);
    },

    update: function() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if(!!this.items[i][j]){
                    this.container.removeChild(this.items[i][j]);
                    this.items[i][j] = null;
                }

                if (!this.nextItems[i][j].value) {
                    continue;
                } else {
                    console.log('value:',this.nextItems[i][j].mergeable);
                     if(!this.nextItems[i][j].mergeable){

                        console.log('merge score :',this.nextItems[i][j].value);
                        this.score += this.nextItems[i][j].value;
                    }

                    this.addRandomBlock(this.nextItems[i][j].value, i, j);
                   
                }
                this.nextItems[i][j].mergeable = true;
            }
        }
    },

    moveHistory: [],
    /**
     * control block matrix's move animation
     * @param  {[type]} moveDire [move direction]
     * @return {[type]}          [description]
     */
    move: function(moveDire) {
        console.log('moving: ',moving);
        if(moving)  return;
        moving = true;
        var len = this.items.length,
            self = this,
            moveNumber = 0,
            noMoveHappend = true,
            prevValue = null;
        
        console.log(this.nextItems);
        var _nextItems = this.nextItems;
        console.log('============current move dire is ' + moveDire);
        if (moveDire == CONST_DERECTION.UP || moveDire == CONST_DERECTION.LEFT) {
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len; j++) {
                    var value = self.items[i][j];
                    if (!value) continue;

                    value.move = self.judgeMoveStep(i, j, moveDire);
                    var moveStep = {};

                    moveStep[value.move.arrow] = parseInt(util.getStyle(value, value.move.arrow)) + value.move.step * unitDist;
                    !!value.move.step && (noMoveHappend = false);

                    util.startmove(value, moveStep, 20, function(value) {
                        // self.container.removeChild(value);
                        if(++moveNumber == self.itemNumber()){
                            console.log('noMoveHappend',noMoveHappend);

                            moving = false;
                            !noMoveHappend && event.emit('add_block');
                        }
                    });
                }
            }
        } else if (moveDire == CONST_DERECTION.DOWN || moveDire == CONST_DERECTION.RIGHT) {
             for (var i = len - 1; i >= 0; i--) {
                for (var j = len - 1; j >= 0; j--) {
                    var value = self.items[i][j];
                    if (!value) continue;

                    value.move = self.judgeMoveStep(i, j, moveDire);
                    var moveStep = {};

                    moveStep[value.move.arrow] = parseInt(util.getStyle(value, value.move.arrow)) + value.move.step * unitDist;
                    !!value.move.step && (noMoveHappend = false);

                    util.startmove(value, moveStep, 20, function(value) {
                        // self.container.removeChild(value);
                        if(++moveNumber == self.itemNumber()){
                            console.log('noMoveHappend',noMoveHappend);

                            moving = false;
                            !noMoveHappend && event.emit('add_block');
                        }
                    });
                }
            }
        }
    },




    /**
     * judge the block of importIndex how to move,direction and step
     * @param  {[type]} currentIndex [importIndex of the block]
     * @param  {[type]} direction    [current move direction]
     * @return {[type]}              [description]
     */
    judgeMoveStep: function(x, y, direction) {
        console.log('x:', x);
        console.log('y:', y);

        var step = 0,
            arrow = '',
            endPoint = 0,
            self = this,
            newItems = self.nextItems,
            currentvalue = newItems[x][y];
        console.log(newItems);
        console.log(currentvalue);

        switch (direction) {
            //left
            case CONST_DERECTION.LEFT:
                var step = 0;
                arrow = 'left';

                for (var j = y - 1; j >= 0; j--) {
                    if (!newItems[x][j].value) {
                        step++;
                        continue;
                    }
                    if (newItems[x][j].value != currentvalue.value) {
                        break;
                    } else if (newItems[x][j].mergeable) {
                        step++;
                        newItems[x][j].mergeable = false;
                        break;
                    }
                };
                step = -step;
                endPoint = {
                    x: x,
                    y: y + step
                };
                if (!!step) {
                    newItems[endPoint.x][endPoint.y].value += currentvalue.value;
                    newItems[x][y].value = 0;
                }
                break;
                //right                                                                                                                        
            case CONST_DERECTION.RIGHT:
                var step = 0,
                arrow = 'left';
                for (var j = y + 1; j < 4; j++) {
                    if (!newItems[x][j].value) {
                        step++;
                        continue;
                    }
                    if (newItems[x][j].value != currentvalue.value) {
                        break;
                    } else if (newItems[x][j].mergeable) {
                        step++;
                        newItems[x][j].mergeable = false;
                        break;
                    }
                };
                endPoint = {
                    x: x,
                    y: y + step
                };
                if (!!step) {
                    newItems[endPoint.x][endPoint.y].value += currentvalue.value;
                    newItems[x][y].value = 0;
                }
                break;
            case CONST_DERECTION.UP:
                var step = 0,
                arrow = 'top';
                for (var i = x - 1; i >= 0; i--) {
                    if (!newItems[i][y].value) {
                        step++;
                        continue;
                    }
                    if (newItems[i][y].value != currentvalue.value) {
                        break;
                    } else if (newItems[i][y].mergeable) {
                        step++;
                        newItems[i][y].mergeable = false;
                        break;
                    }
                };
                step = -step;
                endPoint = {
                    x: x + step,
                    y: y 
                };
                if (!!step) {
                    console.log('step:', step);
                    console.log(newItems);
                    console.log(endPoint);
                    console.log('value:', newItems[endPoint.x][endPoint.y]);
                    newItems[endPoint.x][endPoint.y].value += currentvalue.value;
                    newItems[x][y].value = 0;
                }
                break;
                //down
            case CONST_DERECTION.DOWN:
               var step = 0,
                arrow = 'top';
                for (var i = x + 1; i < 4; i++) {
                    if (!newItems[i][y].value) {
                        step++;
                        continue;
                    }
                    if (newItems[i][y].value != currentvalue.value) {
                        break;
                    } else if (newItems[i][y].mergeable) {
                        step++;
                        newItems[i][y].mergeable = false;
                        break;
                    }
                };
                endPoint = {
                    x: x + step,
                    y: y 
                };
                if (!!step) {
                    console.log('step:', step);
                    console.log(newItems);
                    console.log(endPoint);
                    console.log('value:', newItems[endPoint.x][endPoint.y]);
                    newItems[endPoint.x][endPoint.y].value += currentvalue.value;
                    newItems[x][y].value = 0;
                }
                break;
        }

        console.log({
            step: step,
            arrow: arrow,
            endPoint: endPoint,
        });

        return {
            step: step,
            arrow: arrow,
            endPoint: endPoint,
        };
    },

    confirmStart:function(){
        var r = confirm('game over, start again?');
        if(r == true){
            console.log('game restart');
            this.init();
            this.score = 0;
        }
    }


}


module.exports = blockStore;
