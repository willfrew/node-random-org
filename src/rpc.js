var https = require('https');

/**
 * @type {Object} RPCOptions
 * @property {String}  method   - RPC Method to invoke
 * @property {Object}  params   - Parameters to invoke the `method` with.
 * @property {URL}     endpoint - A parsed URL object (from `url` module) to send the request to.
 * @property {Integer} [id]     - Optional. Request id.
 */

/**
 * Sends a JSONRPC v2.0 request using the provided options.
 * @param  {RPCOptions}   options   Request options
 * @return {Promise}                A Promise for the result of the request.
 */
var makeRpcRequest = function(options) {
  return new Promise(function(resolve, reject) {
    var postData = JSON.stringify({
      jsonrpc: '2.0',
      method: options.method,
      params: options.params,
      id: options.id || 1
    });
    var endpoint = options.endpoint;
    var requestParams = {
      protocol: endpoint.protocol,
      hostname: endpoint.hostname,
      port: endpoint.port || 443,
      path: endpoint.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData, 'utf8')
      }
    };
    var req = https.request(requestParams, function(res) {
      res.setEncoding('utf8');
      var responseBody = '';
      res.on('data', function (chunk) {
        responseBody += chunk;
      });
      res.on('end', function() {
        try {
          responseBody = JSON.parse(responseBody);
          resolve(responseBody);
        } catch (e) {
          reject(new Error('Received invalid JSON'));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports.makeRpcRequest = makeRpcRequest;
