// Simple Ajax module


// Create an Ajax object, optional url can be set 

export var ajax = function(url='')
{
    // Request parameters
    let params = { 
        method:'POST', 
        url:url,
        isAsync:true,
        formData: new FormData(),
    }

    // Promise resolve and reject
    let promise = {
        resolve:null,
        reject:null
    }

    // HTTP request object
    let request = new XMLHttpRequest();
    
    // Set URL
    var url = function(url) 
    { 
        params.url=url;
        return this;
    }
    
    // Set method (POST or GET)
    var method = function(method)
    {
        params.method = method;
        return;
    }
    
    // Push data (key and value)
    var data = function(key, value) 
    { 
        params.formData.append(key, value); 
        return this;
    }
    

    // Send request and return a promise
    var send = function()
    {
        return new Promise((resolve, reject) => {
            promise.resolve = resolve;
            promise.reject = reject;
    
            request.onreadystatechange = callBack;
            request.open(params.method, params.url, params.isAsync);
            request.send(params.formData);
        })
    }
    
    // Callback function 
    var callBack = function()
    {
        // Request not finished
        if (request.readyState != 4) return;
        
        // Check status and reject in case of failure
        if (request.status != 200) { promise.reject(request.status); return; }
        
        // Success, resolve response
        promise.resolve (request.responseText);
    }
    
    return { data:data, url:url, method:method, send:send };
}
