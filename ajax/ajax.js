// Simple Ajax module


// Create an Ajax object
// Settings can be the API url
// Settings can be an object the following keys: url, method and/or data
// Each key is optionnal
export var ajax = (settings=undefined) => {
	// Contains the request parameters
    let params = {};
    
    // Process constructor arguments
    switch (typeof settings) {
        case 'string' : params.url = settings; break
        case 'object' : params = settings; break;
    }
    
    // Create the data key for future use
    if (!('data' in params)) params.data = {};
    if (!('method' in params)) params.method = 'POST';
    

	// Promise resolve and reject
    let promise = {
        resolve:null,
        reject:null
    }

    // HTTP request object
    let request = new XMLHttpRequest();
    
    // Set URL
    var url = function(url) {    
        params.url=url;
        return this;
    }
    
    // Set method (POST or GET)
    var method = function(method) {
        params.method = method;
        return this;
    }
    
    // Push data (key and value) or object
    var data = function(objectOrKey, value) {
    	push(objectOrKey, value)
        return this;
    }
    
    var push = function(objectOrKey, value)
    {
    	switch (typeof objectOrKey)
        {
        	case 'object': params.data = Object.assign(objectOrKey, params.data); break;
            case 'string': params.data =  Object.assign({ [objectOrKey] : value}, params.data); break;
        }    	
    }
    
	var post = function(data)
    {
    	params.method='POST';
        return send(data);
    }
    
    var get = function(data)
    {
    	params.method='GET';
        return send(data);
    }
    // Send request and return a promise
    var send = function(data)
    {
    	push(data);
        return new Promise((resolve, reject) => {
            promise.resolve = resolve;
            promise.reject = reject;
    
            request.onreadystatechange = callBack;
            request.open(params.method, params.url);           
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send( Object.keys(params.data).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params.data[key])) .join('&') );
        })
    }
    
    // Callback function 
    var callBack = function()
    {   	
        // Request not finished
        if (request.readyState != 4) return;
        
        // Check status and reject in case of failure
        if (request.status<200 || request.status>299) { promise.reject(request); return; }
        
        // Success, resolve response
        promise.resolve (request.responseText);
    }
    
    return { data:data, url:url, method:method, send:send, post:post, get:get };
}
