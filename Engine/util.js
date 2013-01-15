jQuery.fn.justtext = function() {
   
    return $(this)  .clone()
            .children()
            .remove()
            .end()
            .text();
 
};

function create(constructor)
{
    parent=constructor();
    function f() {}
    f.prototype=constructor();
    var o=new f();
    return o;
}

function redirect(url, params)
{
    var fullUrl=url;
    if(params!={})
    {
        first=true;
        for(var key in params)
        {
            value=params[key];
            if(first)
            {
                first=false;
                fullUrl=fullUrl+'?'+key+'='+encodeURIComponent(value);
            }
            else
            {
                fullUrl=fullUrl+'&'+key+'='+encodeURIComponent(value);
            }
        }
    }
    
    window.location=fullUrl;
}

function getParams()
{
    console.log('getParams '+window.location.search);
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined")
        {
            query_string[pair[0]] = pair[1];
        }
        // If second entry with this name
        else if (typeof query_string[pair[0]] === "string")
        {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
        }
        // If third or later entry with this name
        else
        {
            query_string[pair[0]].push(pair[1]);
        }
    } 
    
    return query_string;
}

function loadAssets(sources, audioSources, callback)
{
    var toLoad=0;
    var loaded=0;
    var asset;
    var images={};
    var audio={};
            
    for(asset in audioSources)
    {
        console.log('loading '+asset);
        audio[asset]=new buzz.sound(audioSources[asset]);
    }    
    console.log('loaded audio');
    console.log(audio);
    
    for(asset in sources)
    {
        toLoad++;
    }    
    
    for(asset in sources)
    {
        images[asset]=new Image();
        images[asset].onload=function() {
            loaded++;
            if(loaded==toLoad)
            {
                callback(images, audio);
            }
        }
        
        images[asset].src=sources[asset];
    }    
}
