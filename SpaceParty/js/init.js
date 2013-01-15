var shipName;
var crewName;

var shipX=10;
var shipY=200;

var consoleX=340;
var consoleY=200;

var charX=2;
var charY=1;

var ship;
var spacemap;
var panel;

function CaptainConsole()
{
    self=this;
    
    self.init=function()
    {
        console.log('init captain console');
        self.spacemap=create(HexMap);
        self.spacemap.init(images.hex, 64, 4, 32, hexMap, self.mapClicked, consoleX, consoleY);
        self.spacemap.initObjects(images.ships, 64, 2, hexObjectsMap, consoleX, consoleY);    
        
        self.explore(0,2);
    }
    
    self.explore=function(x,y)
    {
        var obj=self.spacemap.getTile(x, y);
        console.log('found: '+obj);
        if(obj.attrs.tileType==0)
        {
            console.log('unexplored');
            self.spacemap.setTileState(x, y, self.getNextState());
        }
    }    
    
    self.mapClicked=function()    
    {
        console.log('map clicked!');
        console.log(this);
        var x=this.attrs.tileX;
        var y=this.attrs.tileY;
        console.log('('+x+','+y+')')
        self.explore(x,y);
    }

    self.getNextState=function()
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
    
    return self;
}

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
        background: '../Assets/images/lumpspace.png',
        bgtiles: '../Assets/images/BGtile.png',
        scout: '../Assets/images/Scout.png',
        console: '../Assets/images/Console.png',
        hex: '../Assets/images/mapTiles.png',
        mainchar: '../Assets/images/mainChar.png',
        ships: '../Assets/images/ships.png',
    };
    
    var audioSources={        
    };
        
    initEngine(imageSources, audioSources, initGame);
}

$(document).ready(init);