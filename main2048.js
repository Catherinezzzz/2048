// 存放游戏数据
var board = new Array();    //4*4格子,此时是一个一维数组
var score = 0;

//手机触屏
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

//记录每个方格是否发生了一次碰撞
var hasConflicted = new Array();

// 程序加载完毕后的主函数
$(document).ready(function(){
    prepareForMobile();
    newGame();  //初始化新游戏
});

function prepareForMobile() {

    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $("#grid-container").css('width', gridContainerWidth - 2*cellSpace );
    $("#grid-container").css("height", gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-radius", 0.02*gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02*cellSideLength);
}

function newGame() {
    // 初始化棋盘格
    init();
    // 随机两个小方格生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    // 对16个小方格的位置进行赋值
    for (var i = 0; i < 4; i ++){
        for (var j = 0; j < 4; j++){

            var gridCell = $("#grid-cell-" + i + "-" + j);

            // 计算相应小方格的top和left,getPosTop()和getPosLeft()分别计算小方格的top和left值
            // 在support2048.js中实现
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));

        }
    }

    for(var i = 0; i < 4; i++){
        board[i] = new Array();     //把board从一维数组变为二维数组
        hasConflicted[i] = new Array();

        for(j = 0;j < 4;j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();  //通知前端对number-cell里的元素进行显示上的设置

    score = 0;
}

// 根据board的值，对前端的number-cell元素进行操作
// index.html没有添加number-cell,要动态地把number-cell添加进去
// 用户每一次操作，board里的值都会发生变化，相应都要调用一次updateBoardView()
function updateBoardView() {

    //如果当前游戏中已经存在number-cell元素，首先删除
    $(".number-cell").remove();

    //根据当前board值添加新的number-cell元素
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            //board[i][j]为0时，为一种样式，number-cell不显示
            if (board[i][j] == 0){
                //设置长和宽为0，可看成一个点
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                //将该点放在每个grid-cell中央
                theNumberCell.css('top', getPosTop(i, j)+cellSideLength/2);
                console.log(getPosTop()+50);
                theNumberCell.css('left', getPosLeft(i, j)+cellSideLength/2);
            }
            //board[i][j]不为0时，为另一种样式，和grid-cell相同
            else{
                //设置长和宽为100px
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                //将该点放在每个grid-cell上方
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));

                //设置每个number-cell背景颜色，根据数字动态判断，传入board[i][j]的值
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                //设置每个number-cell前景颜色（数字颜色），根据数字动态判断，传入board[i][j]的值
                theNumberCell.css('color', getNumberColor(board[i][j]));
                //显示数字的值
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height', cellSideLength+'px');
    $('.number-cell').css('font-size', 0.6*cellSideLength+'px');
}

function generateOneNumber() {
    //棋盘格中已经没有空间
    if(noSpace(board)){
        return false;
    }

    //随机一个位置
    //random()方法产生0-1之间的随机浮点数，需要转换成0-4的整数
    //Math.floor()下取整
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while(times < 50){
        if (board[randx][randy] == 0){
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times ++;
    }

    if(times == 50){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    //随机一个数字2或4,50%的概率
    var randNumber = Math.random() < 0.5? 2 : 4;

    //在随机位置显示数字
    board[randx][randy] = randNumber;
    //显示数字的动画函数
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function (event) {
    switch(event.keyCode){
        case 37:    //left
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 38:    //up
            if(moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39:    //right
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40:    //down
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default:
            break;
    }
});

//捕捉触屏事件
document.addEventListener('touchstart', function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
});

document.addEventListener('touchend', function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    //用户单击屏幕不作响应
    if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
        return;
    }

    //x方向移动
    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
        else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }

    }
    //y方向移动
    else{
        if(deltay > 0){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
        else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
    }
});





// 判断游戏是否结束
function isGameOver() {
    if(noSpace(board) && noMove(board)){
        gameOver();
    }
}

// 游戏结束函数
function gameOver() {
    alert('Game Over!');
}

function moveLeft() {
    //判断当前是否能向左移动
    //放在support2048.js中
    if(!canMoveLeft(board)){
        return false;
    }

    //moveLeft
    for(var i = 0; i < 4; i++){
        for(var j = 1; j < 4; j++){
            //board[i][j]不等于0，有可能可以向左移动
            if (board[i][j] != 0){
                //考查所有左边的元素
                for (var k = 0; k < j; k++){
                    //board[i][k]为0，且board[i][k]到board[i][j]没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
                        //move
                        //把board[i][j]移动到board[i][k]位置上
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    //延迟执行函数
    setTimeout("updateBoardView()", 200);
    return true;

}

function moveUp() {
    //判断当前是否能向上移动
    //放在support2048.js中
    if(!canMoveUp(board)){
        return false;
    }

    //moveUp
    for(var i = 1; i < 4; i++){
        for(var j = 0; j < 4; j++){
            //board[i][j]不等于0，有可能可以向上移动
            if (board[i][j] != 0){
                //考查所有上边的元素
                for (var k = 0; k < i; k++){
                    //board[k][j]为0，且board[k][j]到board[i][j]没有障碍物
                    if (board[k][j] == 0 && noBlockVertical(i, k, j, board)){
                        //move
                        //把board[i][j]移动到board[k][j]位置上
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    //延迟执行函数
    setTimeout("updateBoardView()", 200);
    return true;

}

function moveRight() {
    //判断当前是否能向右移动
    //放在support2048.js中
    if(!canMoveRight(board)){
        return false;
    }

    //moveRight
    for(var i = 0; i < 4; i++){
        for(var j = 2; j >= 0; j--){
            //board[i][j]不等于0，有可能可以向右移动
            if (board[i][j] != 0){
                //考查所有右边的元素
                for (var k = 3; k > j; k--){
                    //board[i][k]为0，且board[i][j]到board[i][k]没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
                        //move
                        //把board[i][j]移动到board[i][k]位置上
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    //延迟执行函数
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    //判断当前是否能向下移动
    //放在support2048.js中
    if(!canMoveDown(board)){
        return false;
    }

    //moveDown
    for(var i = 2; i >= 0; i--){
        for(var j = 0; j < 4; j++){
            //board[i][j]不等于0，有可能可以向下移动
            if (board[i][j] != 0){
                //考查所有下边的元素
                for (var k = 3; k > i; k--){
                    //board[k][j]为0，且board[k][j]到board[i][j]没有障碍物
                    if (board[k][j] == 0 && noBlockVertical(k, i, j, board)){
                        //move
                        //把board[i][j]移动到board[k][j]位置上
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    //延迟执行函数
    setTimeout("updateBoardView()", 200);
    return true;

}