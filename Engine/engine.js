var stage;

function Stage()
{
    self=this;
    
    self.stageWidth=640;
    self.stageHeight=480;

    self.initBackground=function()
    {
        var background=new Kinetic.Layer();
                
        var rect=new Kinetic.Image({
            x: 0,
            y: 0,
            width: 1080,
            height: 800,
            scale: [0.8, 0.8],
            image: self.images.background,
        });
        
        background.add(rect);    
        self.stage.add(background);
        background.draw();
    }

    self.init=function(imageAssets, audioAssets)
    {
        self.images=imageAssets;
        self.audio=audioAssets;
                
        self.stage=new Kinetic.Stage({
            container: 'container',
            width: self.stageWidth,
            height: self.stageHeight,
        });
    
        self.initBackground();        
    } 
    
    return self;
}

function Map()
{
    self=this;
    
    self.tiles=[];
    self.map=[];
    
    self.objectTiles=[];
    self.objectMap=[];
    
    self.mapLayer=null;
    self.objectLayer=null;
    self.charLayer=null;
    
    self.initTiles=function(image, tileSize, tileCount, tiles)
    {
        for(var yindex=0; yindex<tileCount; yindex=yindex+1)
        {
          y=yindex*tileSize;
          for(var xindex=0; xindex<tileCount; xindex++)
          {
              x=xindex*tileSize;
              var img=new Kinetic.Image({
                image: image,
                width: tileSize,
                height: tileSize,
                crop: {
                    width: tileSize,
                    height: tileSize,
                    x: x,
                    y: y,
                },
                visible: false,
              });
              
              tiles.push(img)
          }
        }
    }
    
    self.initMap=function(tileArray, map, offsetX, offsetY, maker, mapper, onClick, mapArray, layer)
    {
        self.mapLayer=layer;
    
        for(var y=0; y<map.length; y++)
        {
            var row=map[y];
            for(var x=0; x<row.length; x++)
            {
                index=row[x];
                if(index==-1)
                {
                    continue;
                }
                
                coords=self.getTileCoords(x, y);            
                var tile=maker(tileArray[index]);
                tile.setX(coords.x);
                tile.setY(coords.y);
                tile.attrs.visible=true;
                tile.attrs.tileX=x;
                tile.attrs.tileY=y;
                tile.attrs.tileType=index;
                tile.on('click', onClick);
                mapArray.push(tile);
                layer.add(tile);
            }
        }
                
        stage.add(layer);
        layer.draw();
    }    
    
    self.initObjects=function(image, tileSize, tileCount, objectList, offsetX, offsetY)
    {       
        self.initTiles(image, tileSize, tileCount, self.objectTiles);
        console.log('objectTiles');
        console.log(self.objectTiles);
        
        var objectLayer=new Kinetic.Layer();
    
        for(var index=0; index<objectList.length; index++)
        {
            var obj=objectList[index];
            var x=obj[0];
            var y=obj[1];
            var index=obj[2];
            
            coords=self.getTileCoords(x, y);
            var tile=self.objectTiles[index].clone();
            tile.setX(coords.x);
            tile.setY(coords.y);
            tile.attrs.visible=true;
            tile.attrs.tileX=x;
            tile.attrs.tileY=y;
            tile.attrs.tileType=index;
            self.objectMap.push(tile);
            objectLayer.add(tile);
        }
                
        self.stage.add(objectLayer);
        objectLayer.draw();
    }    
    
    self.initChars=function(image, tileSize, anims, defaultState, tileX, tileY)
    {
        var coords=self.getTileCoords(tileX, tileY);
        
        var chars=new Kinetic.Layer();
        
        var animations={}
        for(var state in anims)
        {
            var indices=anims[state];
            var frames=[];
            for(var x=0; x<indices.length; x++)
            {
                frames.push({'x': x*tileSize, 'y': 0, 'width': 64, 'height': 64});
            }
            animations[state]=frames;
        }
        
        var mainchar=new Kinetic.Sprite({
            x: coords.x,
            y: coords.y,
            image: image,
            animations: animations,
            animation: defaultState,
            frameRate: 5,
        });
        
        chars.add(mainchar);
        stage.add(chars);
        
        chars.draw();
        
        mainchar.start();
    }    
    
    self.init=function(image, tileSize, tileCount, map, tileClicked, offsetX, offsetY)
    {        
        self.offsetX=offsetX;
        self.offsetY=offsetY;
        self.tileSize=tileSize;
        self.initTiles(image, tileSize, tileCount, self.tiles);
            
        self.mapLayer=new Kinetic.Layer();        
        self.initMap(self.tiles, map, offsetX, offsetY, self.makeTile, self.getCoords, tileClicked, self.map, self.mapLayer)
    }        
    
    self.getTile=function(x, y)
    {
        for(var i=0; i<self.map.length; i++)
        {
            var tile=self.map[i];
            if(tile.attrs.tileX==x && tile.attrs.tileY==y)
            {
                return tile;
            }
        }
        
        return null;
    }    

    self.getObject=function(x, y)
    {
        for(var i=0; i<self.objectMap.length; i++)
        {
            var tile=self.objectMap[i];
            if(tile.attrs.tileX==x && tile.attrs.tileY==y)
            {
                return tile;
            }
        }
        
        return null;
    }    
    
    return self;
}

function SquareMap()
{
    self=create(Map);
        
    self.makeTile=function(tile)
    {
        return tile.clone();        
    }
    
    self.getTileCoords=function(x, y)
    {
        var tx=self.offsetX+(x*self.tileSize);
        var ty=self.offsetY+(y*self.tileSize);
        return {'x': tx, 'y': ty};
    }    
    
    return self;
}

function HexMap()
{
    self=create(Map);

    self.makeTile=function(image)
    {
        var t=new Kinetic.RegularPolygon({
            sides: 6,
            radius: self.mapHexSize,
            fill: {
                image: image,
                offset: [-32,-32],
            },
            stroke: 'gray',
            strokeWidth: 2,
        });    
        
        return t;
    }
    
    self.getTileCoords=function(x, y)
    {
        var stagger=0;
        if(y%2!=0)
        {
            stagger=self.mapHexSize;
        }
        
        var tx=self.offsetX+(x*self.mapHexSize*1.8)+stagger;
        var ty=self.offsetY+(y*self.mapHexSize*1.6);
        return {'x': tx, 'y': ty};
    }    
    
    self.getObjectCoords=function(x, y)
    {
        var coords=self.getTileCoords(x, y);
        return {'x': coords.x-16, 'y': coords.y-16};
    }

    self.initObjects=function(image, tileSize, tileCount, objectList, offsetX, offsetY)
    {       
        self.initTiles(image, tileSize, tileCount, self.objectTiles);
        
        var objectLayer=new Kinetic.Layer();
    
        for(var index=0; index<objectList.length; index++)
        {
            var obj=objectList[index];
            var x=obj[0];
            var y=obj[1];
            var index=obj[2];
            
            coords=self.getObjectCoords(x, y);
            var tile=self.objectTiles[index].clone();
            tile.setX(coords.x);
            tile.setY(coords.y);
            tile.attrs.visible=true;
            tile.attrs.tileX=x;
            tile.attrs.tileY=y;
            tile.attrs.tileType=index;
            tile.setScale(0.5);
            self.objectMap.push(tile);
            objectLayer.add(tile);
        }
                
        stage.add(objectLayer);
        objectLayer.draw();
    }

    self.moveObject=function(object, x, y)
    {
        object.attrs.tileX=x;
        object.attrs.tileY=y;
        var coords=self.getObjectCoords(x, y);
        object.transitionTo({
            x: coords.x,
            y: coords.y,
            duration: 0.5,
        });
    }

    self.initHex=function(tiles, hexSize, map, tileClicked, offsetX, offsetY)
    {
        console.log('initBoard');
        
        self.tiles=tiles;
        self.offsetX=offsetX;
        self.offsetY=offsetY;
        self.mapHexSize=hexSize;
                    
        board=new Kinetic.Layer();    
        console.log('will init hex map');
        self.initMap(self.tiles, map, offsetX, offsetY, self.makeTile, self.getTileCoords, tileClicked, self.map, board);        
        console.log('did init hex map');
    }
    
    self.setTileState=function(x, y, state)
    {
        console.log('setTileState '+state);
        var tile=self.getTile(x, y);
        
        if(tile!=null)
        {
            tile.attrs.tileType=state;                    
            
            var t=self.tiles[state];
            tile.setFill({
                image: t,
                offset: [-32, -32],
            });
            
            self.mapLayer.draw();
        }
    }    
    
    return self;
}

function initEngine(imageSources, audioSources, callback)
{
    loadAssets(imageSources, [], function(imageAssets, audioAssets) {
        stage=create(Stage);
        stage.init(imageAssets, audioAssets);
        callback();
    });
}
