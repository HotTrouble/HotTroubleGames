var stageWidth=640;
var stageHeight=480;

var boardSize=20;
var hexSize=10;
var boardOffset=10;
var boardYOffset=10;

var images;

var actors;
var actorObjects=[];

var effects;

var board;
var boardObjects=[];

var pieces;
var pieceObjects=[];

var treatures;
var treasureObjects=[];

var points=0;
var pointsText="";

var infoOffset=547;
var infoYOffset=150;

var offsets=[];

var showedSelected=false;

var audio;

var infoLayer;

var state=[];
var DIRT=0;
var GRASS=1;
var stateImages=['defaultTile', 'player1tile'];
var stateColors;
//var stateColors=['black', 'red', '#ff5300', 'yellow', 'green', 'blue', 'purple'];
//var stateColors=['black', '#0299FF', '#3E02FF', 'E402FF', '#FF0279', '#FF0202'];
//var stateColors=['black', 'purple', 'blue', 'green', 'yellow', 'orange', 'red', 'white'];

var next;
var nextTile;
var nextState=GRASS;
//var nextTable=[0, 0.5, 0.75, 0.875, 0.9375, 0.96875];

function initBackground(stage)
{
    var background=new Kinetic.Layer();
    
    var rect=new Kinetic.Image({
        x: 0,
        y: 0,
        width: 1080,
        height: 800,
        scale: [0.8, 0.8],
        image: images.background,
    });
    
    background.add(rect);

    stage.add(background);
}

function initInfo(stage)
{
    infoLayer=new Kinetic.Layer();

    goalText = new Kinetic.Text({
      x: 555,
      y: 23,
      text: 'Goal Color',
      fontSize: 13,
      fontFamily: 'Calibri',
      textFill: 'black'
    });
    
    infoLayer.add(goalText);        

    pointsText = new Kinetic.Text({
      x: 42,
      y: 454,
      text: ''+points,
      fontSize: 24,
      fontFamily: 'Calibri',
      textFill: 'red'
    });
    
    infoLayer.add(pointsText);        

/*
    for(var y=1; y<stateColors.length-1; y++)
    {
        for(var x=0; x<3; x++)
        {
            var tile=new Kinetic.RegularPolygon({
                x: infoOffset+x*20,
                y: infoYOffset+y*20,
                sides: 6,
                radius: 10,
                fill: stateColors[y],
                stroke: 'white',
                strokeWidth: 2,
            });    
        
            infoLayer.add(tile);
        }
        
        var equals = new Kinetic.Text({
          x: infoOffset+52,
          y: infoYOffset-13+y*20,
          text: '=',
          fontSize: 24,
          fontFamily: 'Calibri',
          textFill: 'black'
        });    
        
        infoLayer.add(equals);
    
        tile=new Kinetic.RegularPolygon({
            x: infoOffset+80,
            y: infoYOffset+y*20,
            sides: 6,
            radius: 10,
            fill: stateColors[y+1],
            stroke: 'white',
            strokeWidth: 2,
        });    
    
        infoLayer.add(tile);
    }
*/
    
    stage.add(infoLayer);
}

function updatePoints(p)
{
    points=points+Math.pow(10, p-1);
    pointsText.setText(''+points);
    infoLayer.draw();
}

function getNextState()
{
  var r=Math.random();
  for(var x=0; x<nextTable.length-1; x++)
  {  
    if(r>=nextTable[x] && r<nextTable[x+1])
    {
        console.log('next: '+r+' '+x+' '+nextTable[x]+' '+nextTable[x+1]);
        break;
    }
  }
  
  console.log('next:: '+r+' '+x);
  return x;
}

function tileClicked()
{
    console.log('tile clicked '+this.attrs.hexX+' '+this.attrs.hexY);

    console.log('redrawing');
    
    var x=this.attrs.hexX;
    var y=this.attrs.hexY;
    console.log('clicked '+x+' '+y);
    
    if(state[y][x]!=DIRT)
    {
        console.log('Already a tile there');
        return;
    }
    
    state[y][x]=nextState;
    updatePoints(1);
    
    nextState=getNextState();
    console.log('state:');
    console.log(state);
    redrawBoard();
        
    console.log('state:');
    console.log(state);
    
    redrawBoard();
}

function playSound(actor)
{
    console.log('playSound');
    console.log(actor);
    var index=Math.floor(Math.random()*3);
    var sound=actor.attrs.sounds[index];
    sound.play();
}

function getTile(x, y)
{
    if(y>=0 && y<boardObjects.length)
    {
        var boardRow=boardObjects[y];
        if(x>=0 && x<boardRow.length)
        {
            return boardRow[x];
        }
        else
        {
            return null;
        }
    }
    else
    {
        return null;
    }
}

function redrawBoard()
{
    console.log('redrawBoard');
    for(var y=0; y<map.length; y++)
    {    
        var offset=map[y][0];
        var rowLength=map[y][1];
    
        for(var x=0; x<rowLength; x++)
        {                    
            var adjx=(x*2)+offset;
            var tile=getTile(adjx,y);
            
            if(tile!=null)
            {
                tile.setFill(stateColors[state[y][adjx]]);
            }
        }        
    }
    
    board.draw();
    
    nextTile.setFill(stateColors[nextState]);
    next.draw();
}

function calculateTileX(x, y)
{
    var offset=offsets[y];
    return boardOffset+(x*hexSize);
}

function calculateTileY(y)
{
    return boardYOffset+(y*hexSize*1.6);
}

function initBoard(stage)
{
    console.log('initBoard');
    board=new Kinetic.Layer();

    var rowLength=boardSize*2-1;
    for(var y=0; y<map.length; y++)
    {    
        var boardRow=[];
        var stateRow=[]

        var offset=map[y][0];        
        var rowLength=map[y][1];
        
        for(var i=0; i<offset; i++)
        {
            boardRow.push(null);
        }

        for(var x=0; x<(rowLength+offset)*2; x++)
        {                
            stateRow.push(getNextState());
        }
        
        boardObjects.push(boardRow);
        state.push(stateRow);
        
        for(var x=0; x<rowLength; x++)
        {                
            var adjx=offset+(x*2);
            var xpos=calculateTileX(adjx, y);
            var ypos=calculateTileY(y);
            
            var stateColor=stateColors[state[y][x]];
            
            var tile=new Kinetic.RegularPolygon({
                hexX: adjx,
                hexY: y,
                player: 0,
                x: xpos,
                y: ypos,
                sides: 6,
                radius: hexSize,
                fill: stateColor,
                stroke: 'gray',
                strokeWidth: 2,
            });    
            
            tile.on('click', tileClicked);
            tile.on('tap', tileClicked);
            board.add(tile);
            boardRow.push(tile);
            boardRow.push(null);
        }        
    }
    
    stage.add(board);    
    
    console.log('state:');
    console.log(state);    
}

function initNext(stage)
{
    console.log('initNext');
    next=new Kinetic.Layer();

    nextTile=new Kinetic.RegularPolygon({
        x: 590,
        y: 50,
        sides: 6,
        radius: hexSize,
        fill: 'black',
        stroke: 'white',
        strokeWidth: 2,
    });    
                
    next.add(nextTile);    
    
    stage.add(next);
}

function initSounds()
{            
    for(character in characters)
    {
        console.log('loading sound for '+character);
        var charObj=characters[character];
        charObj.sounds=[];
        for(var i=0; i<3; i++)
        {
            charObj.sounds.push(new buzz.sound('assets/audio/'+character+i+'.mp3'));
        }
    }    
    console.log('loaded audio');
    console.log(characters);    
    
    var theme=new buzz.sound('assets/audio/beat.mp3');
    theme.loop().play();
}

function initStage(imageAssets, audioAssets)
{
    images=imageAssets;
    
    stateColors=[
        'black',
        {
            image: images['red'],
            offset: [50,50],
        },
        {
            image: images['orange'],
            offset: [50,50],
        },
        {
            image: images['yellow'],
            offset: [50,50],
        },
        {
            image: images['green'],
            offset: [50,50],
        },
        {
            image: images['blue'],
            offset: [50,50],
        },
        {
            image: images['purple'],
            offset: [50,50],
        },
    ];    

    var stage=new Kinetic.Stage({
        container: 'container',
        width: stageWidth,
        height: stageHeight,
    });

//    initSounds();
//    initBackground(stage);    
    initBoard(stage);
    initNext(stage);
    initInfo(stage);

    redrawBoard();
} 

function initThrex()
{
    var imageSources={
        background: 'assets/lumpspace.png',
        red: 'assets/tileRed.png',
        orange: 'assets/tileOrange.png',
        yellow: 'assets/tileYellow.png',
        green: 'assets/tileGreen.png',
        blue: 'assets/tileBlue.png',
        purple: 'assets/tilePurple.png',
    };
    
    var audioSources={
        
    };
        
//    loadAssets(images, audio, initStage);
    loadAssets(imageSources, [], initStage);
}

$(document).ready(initThrex);