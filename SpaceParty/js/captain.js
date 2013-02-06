var consoleX=340;
var consoleY=200;

var shipLocation={x: 0, y: 2};

var spacemap;
var shipObject;

function CaptainConsole()
{
    self=this;
    
    self.init=function()
    {
        console.log('init captain console');
        
        hexImages=[
            images.empty1, 
            images.empty2, 
            images.empty3, 
            images.empty4, 
            images.empty5, 
            images.empty6, 
            images.empty7, 
            images.empty8, 
            
            images.space1, 
            images.space2, 
            images.space3, 
            images.space4, 
            images.space5, 
            images.space6, 
            images.space7, 
            images.space8, 
        ];
        
        self.spacemap=create(HexMap);
        self.spacemap.initHex(hexImages, 32, self.createSecretMap(), self.mapClicked, consoleX, consoleY);
        self.spacemap.initObjects(images.ships, 64, 2, hexObjectsMap, consoleX, consoleY);            
        shipObject=spacemap.getObject(shipLocation.x, shipLocation.y);
        
        self.explore(shipLocation.x, shipLocation.y);
    }
    
    self.createSecretMap=function()
    {
        var start=[2,0];    
    
        var secretMap=[
            [-1,  0,0,0,  -1,],
            [    0,0,0,0, -1,],
            [   0,0,0,0,0,   ],
            [    0,0,0,0, -1,],
            [-1,  0,0,0,  -1,],
        ];        
        
        for(var y=0; y<secretMap.length; y++)
        {
            for(var x=0; x<secretMap[y].length; x++)
            {
                if(secretMap[y][x]!=-1)
                {
                    secretMap[y][x]=random(8);
                }
            }
        }        

        secretMap[start[0]][start[1]]=8;
        
        var earthRow=random(secretMap.length);

        var offset=0;        
        for(var i=secretMap[earthRow].length-1; i>=0; i--)
        {
            if(secretMap[earthRow][i]!=-1)
            {
                offset=i;
                break;
            }
        }
        
        var earthCol=offset-random(2);
        
        secretMap[earthRow][earthCol]=15;     

        var blocked=[start[0], earthRow];
        for(var nMars=0; nMars<2; nMars++)
        {        
            var marsCoords=self.placeMars(secretMap, blocked);
            if(marsCoords!=null)
            {
                secretMap[marsCoords[0]][marsCoords[1]]=14;
                blocked.push(marsCoords[0]);
            }
        }
        
        console.log('secretMap: '+secretMap);
        
        return secretMap;
    }
    
    self.placeMars=function(secretMap, blocked)
    {
        if(blocked.length>=secretMap.length)
        {
            return null;
        }
        
        marsCol=random(secretMap.length);
        while($.inArray(marsCol, blocked)!=-1)
        {
            marsCol=random(secretMap.length);            
        }
        
        console.log('unblocked '+marsCol+' '+blocked+' '+$.inArray(marsCol, blocked));
        
        console.log('marsCol: '+marsCol+' '+secretMap[marsCol].length);
        
        var options=0;
        for(var i=0; i<secretMap[marsCol].length; i++)
        {
            if(secretMap[marsCol][i]!=-1)
            {
                options=options+1;
            }
        }
        
        console.log('options: '+options);
        
        var option=random(options);
        for(var i=0; i<secretMap[marsCol].length; i++)
        {
            if(secretMap[marsCol][i]!=-1)
            {
                if(option==0)
                {
                    return [marsCol, i];
                }
                else
                {
                    option=option-1;
                }
            }
        }        
    }
    
    self.explore=function(x,y)
    {
        var obj=self.spacemap.getTile(x, y);
        console.log('exploring and found:');
        console.log(obj.attrs.tileType);
        if(obj.attrs.tileType<8)
        {
            console.log('unexplored');
            self.spacemap.setTileState(x, y, 8);
        }
    }    
    
    self.mapClicked=function()    
    {
        console.log('map clicked!');
        console.log(this);
        var x=this.attrs.tileX;
        var y=this.attrs.tileY;
        console.log('clicked tile ('+x+','+y+'), ship at ('+shipObject.attrs.tileX+','+shipObject.attrs.tileY+')')        
        
        self.explore(x,y);
        
        spacemap.moveObject(shipObject, x, y);
                        
        /*
        callback: function() {
            if(attacking)
            {
                console.log('attacking...');
                console.log(enemy);
                
                var fight=new Kinetic.Sprite({
                    x: x,
                    y: y,
                    image: images.fight,
                    animations: animations,
                    animation: 'bounce',
                    frameRate: 10,                        
                });

                effects.add(fight);
                effects.draw();
                
                fight.afterFrame(3, function () {
                    fight.stop();
                    fight.attrs.visible=false;
                    effects.draw();
                    
                    enemy.attrs.visible=false;
                    actors.draw();
                    
                    var piece=getPieceByName(enemy.attrs.name);
                    piece.start();
                    
                    if(enemy.attrs.king)
                    {
                        if(player==1)
                        {
                            window.location='winning2.html';                            
                        }
                        else
                        {                            
                            window.location='winning1.html';
                        }
                    }                    
                });
                
                fight.start();                
            }
            else if(gettingTreasure)
            {
                console.log('got treasure');
                treasure.attrs.visible=false;
                treasures.draw();
                
                if(player==1)
                {
                    p1Money=p1Money+treasure.attrs.value;
                    p1MoneyText.setText('$'+p1Money);
                }
                else
                {
                    p2Money=p2Money+treasure.attrs.value;                    
                    p2MoneyText.setText('$'+p2Money);
                }
                
                barLayer.draw();
            }
            
            redrawBoard();
                
            selected=null;
            nextPlayer();            
        },
    });                
    */
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
