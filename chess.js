window.onload = function(){
    new App().init();
};
    class App{
        constructor(){
            this.COL = 8;
            this.ROW = 8;
            this.SQUARE = innerWidth > innerHeight ? Math.ceil(innerHeight/10) : Math.ceil(innerWidth/10);
            this.boardPos = innerWidth/4-(this.SQUARE+this.SQUARE/2);
            this.BOARD = [];
            this.selection = false;
            this.whitePieceColor = 'white';
            this.blackPieceColor = 'black';
            this.boardColor = ['#653821','#808080'];
            this.selectColor = 'blue';
            this.whitePieces = [];
            this.blackPieces = [];
        }

        colorState(){
            let el = document.getElementsByClassName('chessSquares');
            for(let i = 0; i < el.length; i++){
                el[i].style.backgroundColor = this.BOARD[i].color;
            }
        }

        init(){
            let counter = 0;
            let self = this;
            let chessRank = 0;
            for(let i = 0; i < this.COL; i++){
                for(let j = 0; j < this.ROW; j++){
                    let color = this.boardColor[0];
                    let piece,pieceColor,pieceType,pieceGroup;
                    switch(j){
                        case 0:
                        case 7:
                            switch(i){
                                case 0:
                                case 7:
                                    piece = '&#9820';
                                    pieceType = 'rook';
                                    chessRank = 5;
                                    break;
                                case 1:
                                case 6:
                                    piece = '&#9822';
                                    pieceType = 'nigh';
                                    chessRank = 4;
                                    break;
                                case 2:
                                case 5:
                                    piece = '&#9821';
                                    pieceType = 'bish';
                                    chessRank = 3;
                                    break;
                                case 3:
                                    piece = '&#9819';
                                    pieceType = 'quee';
                                    chessRank = 2;
                                    break;
                                case 4:
                                    piece = '&#9818';
                                    pieceType = 'king';
                                    chessRank = 1;
                                    break;
                            }
                            break;
                            case 1:
                            case 6:
                                piece = '&#9823';
                                pieceType = 'pawn';
                                chessRank = 6;
                                break;
                            default:
                                piece = '';
                                pieceType = 'd';
                    }
                    if(j == 7 || j == 6){
                        pieceColor = this.whitePieceColor;
                        pieceGroup = 'whitegroup';
                    }else if(j == 0 || j == 1){
                        pieceColor = this.blackPieceColor;
                        pieceGroup = 'blackgroup';
                    }else{
                        pieceGroup = 'divssgroup';
                    }
                    if(i % 2 == 0){
                        if(j % 2 == 0){
                            color = this.boardColor[1];
                        }
                    }else if(i % 2 == 1){
                        if(j % 2 == 1){
                            color = this.boardColor[1];
                        }
                    }
                    let classnames = 'chessSquares '+pieceType+counter+' '+pieceGroup+' '+chessRank;    
                    let el = document.createElement('div');
                    el.setAttribute('class',classnames);
                    el.style.position = 'absolute';
                    el.style.left = this.boardPos+i*this.SQUARE+'px';
                    el.style.top = j*this.SQUARE+'px';
                    el.style.width = this.SQUARE+'px';
                    el.style.height = this.SQUARE+'px';
                    el.innerHTML = piece;
                    el.style.color = pieceColor;
                    el.style.backgroundColor = color;
                    this.BOARD.push({'x':this.boardPos+i*this.SQUARE,'y':j*this.SQUARE,'class':classnames,'color':color,'html':piece});                    
                    el.addEventListener('click',function(ev){
                        self.analyzePiece(ev);
                    });
                    document.body.appendChild(el);
                    counter++;
                }
            }
        }

        analyzePiece(ev){
            let classlist = ev.target.classList;
            let posX = parseInt(ev.target.style.left);
            let posY = parseInt(ev.target.style.top);
            let patt = /[0-9]/;
            let id = parseInt(classlist[1].slice(classlist[1].search(patt)));                
            let moves = [];
            let pawnPromotion = false;
            if((id % 8 === 7 || id % 8 === 0) && this.selection && this.selection.classList[1].slice(0,4) === 'pawn'){
                pawnPromotion = true;
            }
            //console.log(ev);
            if(classlist[1].includes('nigh') && ev.target.style.backgroundColor !== this.selectColor){
                moves = this.knightLogic(posX,posY);
            }else if(classlist[1].includes('king') && ev.target.style.backgroundColor !== this.selectColor){
                moves = this.kingLogic(posX,posY);
            }
            else if(classlist[1].includes('pawn') && ev.target.style.backgroundColor !== this.selectColor){
                moves = this.pawnLogic(posX,posY,id);
            }else if(classlist[1].includes('rook') && ev.target.style.backgroundColor !== this.selectColor){
                moves = this.straightLogic(posX,posY,id);
            }else if(classlist[1].includes('quee') && ev.target.style.backgroundColor !== this.selectColor){
                moves = this.straightLogic(posX,posY,id).concat(this.diagonalLogic(posX,posY,id));
            }else if(classlist[1].includes('bish') && ev.target.style.backgroundColor !== this.selectColor){
                moves = this.diagonalLogic(posX,posY,id);
            }
            else{
                if(ev.target.style.backgroundColor === this.selectColor){
                    this.capture(ev,pawnPromotion);
                }
                return;
            }
            this.analyze(ev.target,moves);
        }

        capture(ev,pawnPromotion){
            let self = this;
            this.colorState();
            let div = 'chessSquares '+this.selection.classList[1].slice(0,4)+ev.target.classList[1].slice(1)+' '+this.selection.classList[2];
            let chess = 'chessSquares d'+this.selection.classList[1].slice(4)+' divssgroup';
            let target = this.selection.innerHTML;
            //console.log(ev);
            let opponent;
            if(ev.target.classList[2] === 'whitegroup'){
                opponent = 'Black';
                this.whitePieces.push(ev.target);
            }else if(ev.target.classList[2] === 'blackgroup'){
                opponent = 'White';
                this.blackPieces.push(ev.target);
            }
            //console.log(this.whitePieces,this.blackPieces);
            if(ev.target.classList[1].slice(0,4) === 'king'){
                alert(opponent+' Won!');
                setTimeout(function(){
                    window.location.reload();
                },1000);
            }
            if(pawnPromotion && this.selection.classList[2] === 'whitegroup'){
                div = 'chessSquares quee'+ev.target.classList[1].slice(1)+' whitegroup';
                target = '&#9819';
            }else if(pawnPromotion && this.selection.classList[2] === 'blackgroup'){
                div = 'chessSquares quee'+ev.target.classList[1].slice(1)+' blackgroup';
                target = '&#9819';
            }
            //console.log(pawnPromotion,target);
            ev.target.innerHTML = target;
            this.selection.innerHTML = '';
            this.selection.className = chess;
            ev.target.className = div;
            if(ev.target.classList[2] === 'whitegroup'){
                ev.target.style.color = this.whitePieceColor;
            }else{
                ev.target.style.color = this.blackPieceColor;
            }
            setTimeout(function(){
                let currentPiece = ev.target.classList[1].slice(0,4);
                let moves = [];
                let patt = /[0-9]/;
                let id = parseInt(ev.target.classList[1].slice(ev.target.classList[1].search(patt)));
                let posX = parseInt(ev.target.style.left);
                let posY = parseInt(ev.target.style.top);                    
                switch(currentPiece){
                    case 'rook':
                        moves = self.straightLogic(posX,posY,id);
                        self.analyze(ev.target,moves,'kingCheck');
                        break;
                    case 'pawn':
                        moves = self.pawnLogic(posX,posY,id);
                        self.analyze(ev.target,moves,'kingCheck');
                        break;
                    case 'bish':
                        moves = self.diagonalLogic(posX,posY,id);
                        self.analyze(ev.target,moves,'kingCheck');
                        break;
                    case 'nigh':
                        moves = self.knightLogic(posX,posY);
                        self.analyze(ev.target,moves,'kingCheck');
                        break;
                    case 'quee':
                        moves = self.straightLogic(posX,posY,id).concat(self.diagonalLogic(posX,posY,id));
                        self.analyze(ev.target,moves,'kingCheck');
                        break;
                    case 'king':
                        moves = self.kingLogic(posX,posY);
                        self.analyze(ev.target,moves,'kingCheck');
                        break;
                }
            },500);
        }

        analyze(id,possibleMoves,check){
            let self = this;
            //console.log(possibleMoves);
            let el = document.getElementsByClassName('chessSquares');
            let mygroup = id.classList[2];
            this.selection = id;
            for(let i = 0; i < el.length; i++){
                for(let j = 0; j < possibleMoves.length; j++){
                    if(parseInt(el[i].style.left) === possibleMoves[j][0] && 
                    parseInt(el[i].style.top) === possibleMoves[j][1] &&
                    (el[i].classList[2] === 'divssgroup' || el[i].classList[2] !== mygroup)){
                        if(check === 'kingCheck'){
                            if(el[i].classList[1].slice(0,4) === 'king'){
                                alert('Save your King!');
                                return;
                            }
                        }
                        else{
                            el[i].style.backgroundColor = this.selectColor;
                        }
                    }
                }
            }
        }

        kingLogic(posX,posY){
            this.colorState();
            let moves = [
                    [posX+this.SQUARE,posY],
                    [posX-this.SQUARE,posY],
                    [posX,posY+this.SQUARE],
                    [posX,posY-this.SQUARE],
                    [posX-this.SQUARE,posY-this.SQUARE],
                    [posX+this.SQUARE,posY-this.SQUARE],
                    [posX-this.SQUARE,posY+this.SQUARE],
                    [posX+this.SQUARE,posY+this.SQUARE]
                ];
                return moves;
        }

        knightLogic(posX,posY){
            this.colorState();
            let moves = [
                    [posX+this.SQUARE,posY-this.SQUARE*2],
                    [posX+this.SQUARE,posY-this.SQUARE*2],
                    [posX+this.SQUARE,posY+this.SQUARE*2],
                    [posX+this.SQUARE*2,posY+this.SQUARE],
                    [posX+this.SQUARE*2,posY-this.SQUARE],
                    [posX-this.SQUARE,posY-this.SQUARE*2],
                    [posX-this.SQUARE,posY+this.SQUARE*2],
                    [posX-this.SQUARE*2,posY+this.SQUARE],
                    [posX-this.SQUARE*2,posY-this.SQUARE]
                ];
                return moves;
        }

        diagonalLogic(posX,posY,id){
            this.colorState();
            let diags = [];
            let squares = document.getElementsByClassName('chessSquares');
            let mygroup = squares[id].classList[2];
            let oppogroup = 'whitegroup';
            if(mygroup == 'whitegroup'){
                oppogroup = 'blackgroup';
            }
            for(let i = 1; i < 8; i++){
                if(id+i*7 >= 0 && id+i*7 <= 63 && squares[id+i*7].classList[2] === oppogroup){
                    diags.push([posX+i*this.SQUARE,posY-i*this.SQUARE]);
                    break;
                }
                if(id+i*7 >= 0 && id+i*7 <= 63 && squares[id+i*7].classList[2] === mygroup){
                    break;
                }
                diags.push([posX+i*this.SQUARE,posY-i*this.SQUARE]);
            }
            for(let i = 1; i < 8; i++){
                if(id-i*9 >= 0 && id-i*9 <= 63 && squares[id-i*9].classList[2] === oppogroup){
                    diags.push([posX-i*this.SQUARE,posY-i*this.SQUARE]);
                    break;
                }
                if(id-i*9 >= 0 && id-i*9 <= 63 && squares[id-i*9].classList[2] === mygroup){
                    break;
                }
                diags.push([posX-i*this.SQUARE,posY-i*this.SQUARE]);
            }
            for(let i = 1; i < 8; i++){
                if(id-i*7 >= 0 && id-i*7 <= 63 && squares[id-i*7].classList[2] === oppogroup){
                    diags.push([posX-i*this.SQUARE,posY+i*this.SQUARE]);
                    break;
                }
                if(id-i*7 >= 0 && id-i*7 <= 63 && squares[id-i*7].classList[2] === mygroup){
                    break;
                }
                diags.push([posX-i*this.SQUARE,posY+i*this.SQUARE]);
            }
            for(let i = 1; i < 8; i++){
                if(id+i*9 >= 0 && id+i*9 <= 63 && squares[id+i*9].classList[2] === oppogroup){
                    diags.push([posX+i*this.SQUARE,posY+i*this.SQUARE]);
                    break;
                }
                if(id+i*9 >= 0 && id+i*9 <= 63 && squares[id+i*9].classList[2] === mygroup){
                    break;
                }
                diags.push([posX+i*this.SQUARE,posY+i*this.SQUARE]);
            }
            return diags;
        }

        straightLogic(posX,posY,id){
            this.colorState();
            let rooks = [];
            let squares = document.getElementsByClassName('chessSquares');
            let mygroup = squares[id].classList[2];
            let oppogroup = 'whitegroup';
            if(mygroup == 'whitegroup'){
                oppogroup = 'blackgroup';
            }
            for(let i = 1; i < 8; i++){
                if(id-i >= 0 && id-i <= 63 && squares[id-i].classList[2] === oppogroup){
                    rooks.push([posX,posY-this.SQUARE*i]);
                    break;
                }
                if(id-i >= 0 && id-i <= 63 && squares[id-i].classList[2] === mygroup){
                    break;
                }
                rooks.push([posX,posY-this.SQUARE*i]);
            }
            for(let j = 1; j < 8; j++){
                if(id-8*j >= 0 && id-8*j <= 63 && squares[id-8*j].classList[2] === oppogroup){
                    rooks.push([posX-j*this.SQUARE,posY]);
                    break;
                }
                if(id-8*j >= 0 && id-8*j <= 63 && squares[id-8*j].classList[2] === mygroup){
                    break;
                }
                rooks.push([posX-j*this.SQUARE,posY]);
            }                    
            for(let j = 1; j < 8; j++){
                if(id+8*j >= 0 && id+8*j <= 63 && squares[id+8*j].classList[2] === oppogroup){
                    rooks.push([posX+j*this.SQUARE,posY]);
                    break;
                }
                if(id+8*j >= 0 && id+8*j <= 63 && squares[id+8*j].classList[2] === mygroup){
                    break;
                }
                rooks.push([posX+j*this.SQUARE,posY]);
            }
            for(let j = 1; j < 8; j++){
                if(id+j >= 0 && id+j <= 63 && squares[id+j].classList[2] === oppogroup){
                    rooks.push([posX,posY+this.SQUARE*j]);
                    break;
                }
                if(id+j >= 0 && id+j <= 63 && squares[id+j].classList[2] === mygroup){
                    break;
                }
                rooks.push([posX,posY+this.SQUARE*j]);
            }
            return rooks;
        }

        pawnLogic(posX,posY,id){
            this.colorState();
            let squares = document.getElementsByClassName('chessSquares');
            let moves = [];
            if(squares[id].classList[2] === 'whitegroup'){
                if( id-8-1 >= 0 && id-8-1 <= 63 && squares[id-8-1].classList[2] === 'blackgroup'){
                    moves.push([posX-this.SQUARE,posY-this.SQUARE]);
                }
                if(id+8-1 >= 0 && id+8-1 <= 63 && squares[id+8-1].classList[2] === 'blackgroup'){
                    moves.push([posX+this.SQUARE,posY-this.SQUARE]);
                }
            }else if(squares[id].classList[2] === 'blackgroup'){
                if(id+8+1 >= 0 && id+8+1 <= 63 && squares[id+8+1].classList[2] === 'whitegroup'){
                    moves.push([posX+this.SQUARE,posY+this.SQUARE]);
                }
                if(id-8+1 >= 0 && id-8+1 <= 63 && squares[id-8+1].classList[2] === 'whitegroup'){
                    moves.push([posX-this.SQUARE,posY+this.SQUARE]);
                }
            }
            switch(id % 8 ){
                case 6:
                    if(squares[id].classList[2] === 'blackgroup' && squares[id+1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY+this.SQUARE]);
                    }
                    if(squares[id].classList[2] === 'whitegroup' && squares[id-1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY-this.SQUARE]);
                    }
                    if(squares[id].classList[2] === 'whitegroup' && squares[id-2].classList[2] === 'divssgroup' && squares[id-1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY-this.SQUARE*2]);
                    }
                    break;
                case 1:
                    if(squares[id].classList[2] === 'whitegroup' && squares[id-1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY-this.SQUARE]);
                    }
                    if(squares[id].classList[2] === 'blackgroup' && squares[id+1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY+this.SQUARE]);
                    }
                    if(squares[id].classList[2] === 'blackgroup' && squares[id+2].classList[2] === 'divssgroup' && squares[id+1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY+this.SQUARE*2]);
                    }
                    break;
                default:
                    if(id-1 >= 0 && id-1 <= 63 && squares[id].classList[2] === 'whitegroup' && squares[id-1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY-this.SQUARE]);
                    }else if(id+1 >= 0 && id+1 <= 63 && squares[id].classList[2] === 'blackgroup' && squares[id+1].classList[2] === 'divssgroup'){
                        moves.push([posX,posY+this.SQUARE]);
                    }
            }
            return moves;
        }

    }
