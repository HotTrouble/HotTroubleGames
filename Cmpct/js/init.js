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

function createVisibleMap()
{                    
    for(var y=0; y<visibleMap.length; y++)
    {
        for(var x=0; x<visibleMap[y].length; x++)
        {
            if(visibleMap[y][x]!=-1)
            {
                visibleMap[y][x]=random(8);
            }
        }
    }        

function initGame()
{

        self.visibleMap[self.start[0]][self.start[1]]=8;        
    }

    self.spacemap=create(HexMap);
    self.spacemap.initHex(hexImages, 32, self.visibleMap, self.mapClicked, consoleX, consoleY);
}

function init()
{
    var params=getParams();    
    shipName=params.shipName;
    crewName=params.crewName;

    console.log('Crew member '+crewName+' on the ship '+shipName);

    var imageSources={
        background: '../Assets/images/Cmpct/CoolDown.png',
    };
    
    var audioSources={        
    };
    
    var theme=new buzz.sound('../Assets/audio/voyage.mp3');
    theme.loop().play();    
        
    initEngine(imageSources, audioSources, initGame);
}

$(document).ready(init);