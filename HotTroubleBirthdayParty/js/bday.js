var state=0;
var stageWidth=640;
var stageHeight=480;
var stage;

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

var tiles=[];
var chars;
var mainchar;

function initBackground()
{        
    for(var y=0; y<=256; y=y+128)
    {
      for(var x=0; x<=256; x=x+128)
      {
          var img=new Kinetic.Image({
            image: images.bgtiles,
            width: 128,
            height: 128,
            crop: {
                width: 128,
                height: 128,
                x: x,
                y: y,
            },
            visible: false,
          });
          
          tiles.push(img)
      }
    }

    console.log('tiles:');
    console.log(tiles);

    var background=new Kinetic.Layer();

    for(var y=0; y<map.length; y++)
    {
        var row=map[y];
        for(var x=0; x<row.length; x++)
        {
            index=row[x];
            console.log('index: '+index);
            var tile=tiles[index].clone();
            tile.setX(x*128);
            tile.setY(y*128);
            tile.attrs.visible=true;
            tile.attrs.tileX=x;
            tile.attrs.tileY=y;
            console.log('tile: '+tile.attrs.x+','+tile.attrs.y+' '+tile.attrs.offset.x+','+tile.attrs.offset.y);
            tile.on('click', tileClicked);
            background.add(tile);
        }
    }
            
    stage.add(background);
    background.draw();
}

function initChars()
{
    chars=new Kinetic.Layer();
    
    mainchar=new Kinetic.Sprite({
        x: 0,
        y: 0,
        image: images.mainchar,
        animations: {
            'standing': [
                {
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64,
                },
                {
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64,
                },
            ],
            'talking': [
                {
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64,
                },
                {
                    x: 64,
                    y: 0,
                    width: 64,
                    height: 64,
                },
            ],
            'walking': [
                {
                    x: 128,
                    y: 0,
                    width: 64,
                    height: 64,
                },
                {
                    x: 192,
                    y: 0,
                    width: 64,
                    height: 64,
                },
            ]
        },
        animation: 'standing',
        frameRate: 5,
    });
    
    chars.add(mainchar);
    stage.add(chars);
    
    chars.draw();
    
    mainchar.start();
}

function tileClicked()
{
    console.log('tile clicked '+this.attrs.tileX+' '+this.attrs.tileY);

    console.log('redrawing');
    
    var x=this.attrs.tileX;
    var y=this.attrs.tileY;
    console.log('clicked '+x+' '+y);    
    
    if(state==0)
    {
        state=1;
        mainchar.setAnimation('walking');
    }
    else if(state==1)
    {
        state=2;
        mainchar.setAnimation('talking');
    }
    else if(state==2)
    {
        state=0;
        mainchar.setAnimation('standing');
    }
    
    chars.draw();
}

function playSound(actor)
{
    console.log('playSound');
    console.log(actor);
    var index=Math.floor(Math.random()*3);
    var sound=actor.attrs.sounds[index];
    sound.play();
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
    
    stage=new Kinetic.Stage({
        container: 'container',
        width: stageWidth,
        height: stageHeight,
    });

//    initSounds();

    initBackground();        
    initChars();    
} 

function initBday()
{
    var imageSources={
        bgtiles: 'assets/BGtile.png',
        mainchar: 'assets/mainChar.png',
    };
    
    var audioSources={
        
    };
        
//    loadAssets(images, audio, initStage);
    loadAssets(imageSources, [], initStage);
}

$(document).ready(initBday);