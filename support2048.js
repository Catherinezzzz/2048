documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth; //棋盘格宽度
cellSideLength = 0.18 * documentWidth;  //小方格宽度
cellSpace = 0.04 * documentWidth;   //小方格间距


function getPosTop(i, j) {
    return cellSpace + i*(cellSpace + cellSideLength);
}

function getPosLeft(i, j) {
    return cellSpace + j*(cellSpace + cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch(number){
        case 2: return "#eee4da";
        case 4: return "#ede0c8";
        case 8: return "#f2b179";
        case 16: return "#f59563";
        case 32: return "#f67c5f";
        case 64: return "#f65e3b";
        case 128: return "#edcf72";
        case 256: return "#edcc61";
        case 512: return "#9c0";
        case 1024: return "#33b5e5";
        case 2048: return "#09c";
        case 4096: return "#a6c";
        case 8192: return "#93c";
    }
    return "black";
}

function getNumberColor(number) {
    if (number <= 4){
        return "#776e65"
    }
    return "white";
}

function noSpace() {
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function canMoveLeft(board) {
    for(var i = 0; i < 4; i++){
        for(var j = 1; j < 4; j++){
            //可以左移两种情况
            // 1.左边有空余方格(值为0)
            // 2.和左边相邻方格内的值相同
            if(board[i][j] != 0){
                if (board[i][j-1] == 0 || board[i][j-1] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//判断第row行col1列到col2列是否有障碍物
function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 +1; i < col2; i++){
        //存在障碍物
        if (board[row][i] != 0){
            return  false;
        }
    }
    return true;
}

function canMoveUp(board) {
    for(var i = 1; i < 4; i++){
        for(var j = 0; j < 4; j++){
            //可以上移两种情况
            // 1.上边有空余方格(值为0)
            // 2.和上边相邻方格内的值相同
            if(board[i][j] != 0){
                if (board[i-1][j] == 0 || board[i-1][j] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockVertical(row1, row2, col, board) {
    for (var i = row2 +1; i < row1; i++){
        //存在障碍物
        if (board[i][col] != 0){
            return  false;
        }
    }
    return true;
}

function canMoveRight(board) {
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 3; j++){
        //可以右移两种情况
        // 1.右边有空余方格(值为0)
        // 2.和右边相邻方格内的值相同
        if(board[i][j] != 0){
            if (board[i][j+1] == 0 || board[i][j+1] == board[i][j]){
                return true;
            }
        }
    }
    }
    return false;
}

function canMoveDown(board) {
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 4; j++){
            //可以下移两种情况
            // 1.下边有空余方格(值为0)
            // 2.和下边相邻方格内的值相同
            if(board[i][j] != 0){
                if (board[i+1][j] == 0 || board[i+1][j] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function noMove(board) {
    return !(canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board));

}