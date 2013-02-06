var shipName;
var crewName;

var shipX=10;
var shipY=200;

var charX=2;
var charY=1;

var ship;
var panel;

var consoles=[
    CaptainConsole,
];

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

function initGame()
{
    ship=create(SquareMap);
    ship.init(images.scout, 64, 4, shipMap, null, shipX, shipY);
    ship.initChars(images.mainchar, 64, {'standing': [0, 0], 'talking': [0, 1], 'walking': [2, 3]}, 'standing', charX, charY);    
    ship.initObjects(images.console, 64, 1, scoutShipObjects, shipX, shipY);
    
    checkConsole(charX, charY);
} 

function checkConsole(x, y)
{
    console.log('getting tile '+x+' '+y);
    var tile=ship.getObject(x, y);
    console.log(tile);
    if(tile.attrs.tileType==0)
    {
        showConsole(tile.attrs.tileType);
    }
}

function showConsole(consoleType)
{
    console.log('showing console '+consoleType);
    var consoleInit=consoles[consoleType];
    panel=create(consoleInit);
    console.log('panel: '+panel);
    panel.init();
}

function init()
{
    var params=getParams();    
    shipName=params.shipName;
    crewName=params.crewName;

    console.log('Crew member '+crewName+' on the ship '+shipName);

    var imageSources={
        background: '../../Assets/images/lumpspace.png',
        bgtiles: '../../Assets/images/BGtile.png',
        scout: '../../Assets/images/Scout.png',
        console: '../../Assets/images/Console.png',
        hex: '../../Assets/images/mapTiles.png',
        mainchar: '../../Assets/images/mainChar.png',
        ships: '../../Assets/images/ships.png',
        
        empty1: '../../Assets/images/emptySpace1.png',
        empty2: '../../Assets/images/emptySpace2.png',
        empty3: '../../Assets/images/emptySpace3.png',
        empty4: '../../Assets/images/emptySpace4.png',
        empty5: '../../Assets/images/emptySpace5.png',
        empty6: '../../Assets/images/emptySpace6.png',
        empty7: '../../Assets/images/emptySpace7.png',
        empty8: '../../Assets/images/emptySpace8.png',
        
        space1: '../../Assets/images/space1.png',
        space2: '../../Assets/images/space2.png',
        space3: '../../Assets/images/space3.png',
        space4: '../../Assets/images/space4.png',
        space5: '../../Assets/images/space5.png',
        space6: '../../Assets/images/space6.png',
        space7: '../../Assets/images/space7.png',
        space8: '../../Assets/images/space8.png',
    };
    
    var audioSources={        
    };
        
    initEngine(imageSources, audioSources, initGame);
}

$(document).ready(init);