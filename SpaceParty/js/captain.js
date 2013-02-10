var consoleX=340;
var consoleY=200;

var shipLocation={x: 0, y: 2};

var spacemap;
var shipObject;

var shipMoves=[
    [2,0],
    [-2,0],           
    [-1,1],
    [1,1],           
    [-1,-1],
    [1,-1],           
    [0,0],
];

var enemyMoves=[
    [2,0],
    [-1,1],
    [-1,-1],
    [0,0],
];

function CaptainConsole()
{
    self=this;
    
    self.lastTile=0;
    self.enemies=[];
    self.secretMap=[
        [-1,-1, 0,-1, 0,-1, 0,-1,-1,],
        [-1, 0,-1, 0,-1, 0,-1, 0,-1,],
        [ 0,-1, 0,-1, 0,-1, 0,-1, 0,],
        [-1, 0,-1, 0,-1, 0,-1, 0,-1,],
        [-1,-1, 0,-1, 0,-1, 0,-1,-1,],
    ];
    self.visibleMap=[
        [-1,-1, 0,-1, 0,-1, 0,-1,-1,],
        [-1, 0,-1, 0,-1, 0,-1, 0,-1,],
        [ 0,-1, 0,-1, 0,-1, 0,-1, 0,],
        [-1, 0,-1, 0,-1, 0,-1, 0,-1,],
        [-1,-1, 0,-1, 0,-1, 0,-1,-1,],
    ];
    
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
        
        self.createSecretMap();
        self.createVisibleMap();
        
        self.spacemap=create(HexMap);
        self.spacemap.initHex(hexImages, 32, self.visibleMap, self.mapClicked, consoleX, consoleY);
        self.spacemap.initObjects(images.ships, 64, 2, hexObjectsMap, consoleX, consoleY);            
        shipObject=spacemap.getObject(shipLocation.x, shipLocation.y);
        
        self.lastTile=self.spacemap.getTile(start[0], start[1]);        
        
        self.explore(shipLocation.x, shipLocation.y);        
        self.moveCompleted();
    }
    
    self.createSecretMap=function()
    {
        var start=[2,0];            
                    
        for(var y=0; y<self.secretMap.length; y++)
        {
            for(var x=0; x<self.secretMap[y].length; x++)
            {
                if(self.secretMap[y][x]!=-1)
                {
                    self.secretMap[y][x]=8;
                }
            }
        }        

        self.secretMap[start[0]][start[1]]=8;
        
        var earthRow=random(self.secretMap.length);

        var offset=0;        
        for(var i=self.secretMap[earthRow].length-1; i>=0; i--)
        {
            if(self.secretMap[earthRow][i]!=-1)
            {
                offset=i;
                break;
            }
        }
        
        var earthCol=offset-(random(2)*2);
        
        self.secretMap[earthRow][earthCol]=15;     

        var blocked=[start[0], earthRow];
        for(var nMars=0; nMars<2; nMars++)
        {        
            var marsCoords=self.placeMars(self.secretMap, blocked);
            if(marsCoords!=null)
            {
                self.secretMap[marsCoords[0]][marsCoords[1]]=14;
                blocked.push(marsCoords[0]);
            }
        }
        
        console.log('secretMap: '+self.secretMap);
        
        return self.secretMap;
    }

    self.createVisibleMap=function()
    {
        var start=[2,0];            
                    
        for(var y=0; y<self.visibleMap.length; y++)
        {
            for(var x=0; x<self.visibleMap[y].length; x++)
            {
                if(self.visibleMap[y][x]!=-1)
                {
                    self.visibleMap[y][x]=random(8);
                }
            }
        }        

        self.visibleMap[start[0]][start[1]]=8;        
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
        var tileType=self.secretMap[y][x];
        console.log('exploring and found:');
        console.log(tileType);
        self.spacemap.setTileState(x, y, tileType);
    }    
    
    self.mapClicked=function()    
    {
        console.log('map clicked!');
        console.log(this);
        var x=this.attrs.tileX;
        var y=this.attrs.tileY;
        console.log('clicked tile ('+x+','+y+'), ship at ('+shipObject.attrs.tileX+','+shipObject.attrs.tileY+')')        
        
        if(self.isValidMove([shipObject.attrs.tileX, shipObject.attrs.tileY], [x, y], shipMoves))
        {
            self.lastTile=self.spacemap.getTile(shipObject.attrs.tileX, shipObject.attrs.tileY);
            self.explore(x,y);
            self.spacemap.moveObject(shipObject, x, y, self.moveCompleted);
        }
    }
    
    self.moveCompleted=function()
    {                    
        console.log('move completed');
        
        var here=self.spacemap.getTile(shipObject.attrs.tileX, shipObject.attrs.tileY);
        if(here.attrs.tileType==15)
        {
            console.log('earth');
            redirect('winning.html');
        }        
        else if(here.attrs.tileType==14)
        {
            console.log('mars');
        }
        else
        {
            console.log('not earth');
        }
                
        console.log('last Tile: '+self.lastTile);
        if(self.lastTile!=null && self.lastTile.attrs.tileType==14)
        {
            console.log('placing enemy '+self.lastTile.attrs.tileX+' '+self.lastTile.attrs.tileY);
            self.enemies.push(self.spacemap.addObject(self.lastTile.attrs.tileX, self.lastTile.attrs.tileY, 1));
        }

        self.spacemap.clearStroke('grey');
        self.colorShipMoves();
        self.colorEnemyMoves();        
        
        self.moveEnemies();
    }
        
    self.colorShipMoves=function()
    {
        console.log('c$$$$$$$$$$$$$$$$$olor ship moves');
        for(var y=0; y<shipMoves.length; y++)
        {
            var move=shipMoves[y];
            var shipDest=[shipObject.attrs.tileX+move[0], shipObject.attrs.tileY+move[1]];
            console.log('possible ship dest '+shipDest);
            self.spacemap.stroke(shipDest[0], shipDest[1], 'white');
        }
    }
    
    self.colorEnemyMoves=function()
    {
        for(var x=0; x<enemies.length; x++)
        {
            var enemy=enemies[x];
            for(var y=0; y<enemyMoves.length; y++)
            {
                var move=enemyMoves[y];
                var enemyDest=[enemy.attrs.tileX+move[0], enemy.attrs.tileY+move[1]];
                console.log('possible enemy dest '+enemyDest);
                self.spacemap.stroke(enemyDest[0], enemyDest[1], 'red');                
            }
        }                        
    }

    self.moveEnemies=function()
    {
        for(var x=0; x<enemies.length; x++)
        {
            var enemy=enemies[x];
            
            var moveStart=random(enemyMoves.length-1);
            
            for(var y=0; y<enemyMoves.length-1; y++)
            {
                var moveIndex=(moveStart+y)%(enemyMoves.length-1);
                var move=enemyMoves[moveIndex];
                
                var enemyDest=[enemy.attrs.tileX+move[0], enemy.attrs.tileY+move[1]];
                if(self.spacemap.getTile(enemyDest[0], enemyDest[1])!=null)
                {
                    console.log('making enemy move');                    
                    self.spacemap.moveObject(enemy, enemyDest[0], enemyDest[1], self.enemyMoveCompleted);                
                    break;
                }
            }            
            
            console.log('no moves for enemy');
        }                        
    }
    
    self.enemyMoveCompleted=function()
    {
        console.log('enemy move completed');
        self.spacemap.clearStroke('grey');
        self.colorShipMoves();
        self.colorEnemyMoves();        
        
        for(var x=0; x<enemies.length; x++)
        {
            var enemy=enemies[x];
            if(enemy.attrs.tileX==shipObject.attrs.tileX && enemy.attrs.tileY==shipObject.attrs.tileY)
            {
                redirect('losing.html');
            }
        }
    }
    
    self.isValidMove=function(here, there, moves)
    {
        return self.spacemap.checkMove(here, there, moves);
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
