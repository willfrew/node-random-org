# `random-org` [![Build Status](https://app.travis-ci.com/willfrew/node-random-org.svg?branch=master)](https://travis-ci.com/github/willfrew/node-random-org)
_A lightweight wrapper around the Random.org json-rpc api for Node.js_

[Random.org](https://www.random.org) is a truly random number generation service.
According to their homepage, they're using 'atmospheric noise' to generate
said random bits.
The aim of this module is to provide a slightly more node-centric interface to
their json-rpc api than existing offerings.

To obtain an API key, please see their [pricing page](https://api.random.org/pricing) (includes free keys for developers at the time of writing).
Or, if you already have an api key from the public beta, you can [migrate it](https://api.random.org/migration) to a production key.
Please be a nice api consumer and check out their
[usage guidelines](https://api.random.org/guidelines) before using this module.

In case of any discrepancies between this documentation and the official Random.org documentation, theirs is correct!
Please open an issue or PR if you notice any, though.

## Installation
Install through npm:
```shell
$ npm install random-org
```

## Support
The [current, active & maintenance LTS versions](https://nodejs.org/en/about/releases/) of Node.js are supported.

## Usage
See the following high-level example for getting started:
```javascript
const RandomOrg = require('random-org');
// or
import RandomOrg from 'random-org';

var random = new RandomOrg({ apiKey: '12345-67890-api-key' });
random.generateIntegers({ min: 1, max: 99, n: 2 })
  .then(function(result) {
    console.log(result.random.data); // [55, 3]
  });
```

Typescript types are included.

All methods return native Promises.

### Basic api methods
The so-called 'basic' api methods are the ones to use if all you need is a few bits, of the random variety.
All of these api calls have a similarly formatted response (documented [here](#basic-method-response-format)).

#### `random.generateIntegers(params : Object) : Promise`
Generate some truly random integers.
[_Response_](#basic-method-response-format)
```javascript
params = {
  /* Required */
  // The number of random integers to generate (valid values: [1-10000]).
  n: Number,
  // Lower bound for random integers (valid values: [-1e9 - 1e9] and `< max`).
  min: Number,
  // Upper bound for random integers (valid values: [-1e9 - 1e9] and `> min`).
  max: Number,

  /* Optional */
  // Whether or not the generated numbers can contain duplicates (default: true).
  replacement: Boolean,
  // The base of the generated numbers (default: 10; valid values: 2, 8, 10 or 16).
  // If `base` is any value other than 10, the generated numbers will be returned as strings.
  base: Number
}
 ```

#### `random.generateIntegerSequences(params : Object) : Promise`
Generate some truly random sequences of integers.
[_Response_](#basic-method-response-format)
```javascript
params = {
  /* Required */
  // The number of random integer sequences to generate (valid values: [1-10000]).
  n: Number,
  // The length of the sequences to generate (valid values: [1-10000]).
  // Alternatively an array of `n` lengths if you need sequences of varying
  // lengths (the sum of all lengths must be in the range: [1-10000]).
  length: Number | Array<Number>,
  // Lower bound for random integers (valid values: [-1e9 - 1e9] and `< max`).
  min: Number,
  // Upper bound for random integers (valid values: [-1e9 - 1e9] and `> min`).
  max: Number,

  /* Optional */
  // Whether or not the generated numbers can contain duplicates (default: true).
  replacement: Boolean,
  // The base of the generated numbers (default: 10; valid values: 2, 8, 10 or 16).
  // If `base` is any value other than 10, the generated numbers will be returned as strings.
  base: Number
}
 ```

#### `random.generateDecimalFractions(params : Object) : Promise`
Generate some random real numbers between 0 and 1. [_Response_](#basic-method-response-format)
```javascript
params = {
  /* Required */
  // The number of random reals to generate (valid values: [1-10000]).
  n: Number,
  // The number of decimal places to use (valid values: [1-20]).
  decimalPlaces: Number,

  /* Optional */
  // Whether or not the generated numbers can contain duplicates (default: true).
  replacement: Boolean
}
```
#### `random.generateGaussians(params : Object) : Promise`
Generate random numbers from a Gaussian distribution. [_Response_](#basic-method-response-format)

There is no `replacement` option for this api call, meaning the response can
contain duplicates.

```javascript
params = {
  /* Required */
  // The number of random numbers to generate (valid values: [1-10000]).
  n: Number,
  // The mean of the distribution to pull numbers from (valid values: [-1e6 - 1e6]).
  mean: Number,
  // Said distribution's standard deviation (valid values [-1e6 - 1e6]).
  standardDeviation: Number,
  // The number of significant digits for your requested random numbers (valid values: [2-20]).
  significantDigits: Number,
}
```

#### `random.generateStrings(params : Object) : Promise`
Generate random strings of a given length, using a provided set of characters. [_Response_](#basic-method-response-format)
```javascript
params = {
  /* Required */
  // The number of random strings to generate (valid values: [1-10000]).
  n: Number,
  // The length of each string you'd like generated.
  length: Number,
  // The set of characters allowed to appear in the generated strings (maximum length: 80).
  // Unicode characters are supported.
  characters: String,

  /* Optional */
  // Whether or not the generated numbers can contain duplicates (default: true).
  replacement: Boolean
}
```

#### `random.generateUUIDs(params : Object) : Promise`
Generate [version 4 Universally Unique IDentifiers](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29). [_Response_](#basic-method-response-format)

As with numbers pulled from a Gaussian distribution, this api call does not have
a `replacement` property.
Although each UUID is drawn from a 128bit space, collisions are still possible
(albeit rare).

```javascript
params = {
  /* Required */
  // The number of UUIDs to generate (valid values: [1-1000]).
  n: Number
}
```

#### `random.generateBlobs(params : Object) : Promise`
Generate random binary blobs. [_Response_](#basic-method-response-format)

The total size of all blobs requested mustn't exceed 128KB (1,048,576
bits).

```javascript
params = {
  /* Required */
  // The number of blobs you'd like (valid values: [1-100]).
  n: Number,
  // The size of each blob, in bits (valid values: [1-1048576] and `size % 8 === 0`).
  size: Number,

  /* Optional */
  // The format in which you'd like your blob (default: 'base64'; valid values: 'base64' or 'hex').
  format: String
}
```

#### Basic method response format
The basic api methods for generating random bits all have a consistent response
format:

```javascript
response = {
  random: {
    // Array containing your requested random numbers or strings.
    data: Array,
    // The time that request was completed, in ISO 8601 format (parsable with new Date(isoString)).
    completionTime: String
  },
  // The number of random bits generated in this request.
  bitsUsed: Number,
  // An estimate of the number of remaining bits you can request.
  bitsLeft: Number,
  // An estimate of the number of remaining api calls you can make.
  requestsLeft: Number,
  // The recommended number of milliseconds you should wait before making another request.
  advisoryDelay: Number
}
```

### Signed api methods
Random.org also provides methods for generating signed random numbers so that
their authenticity can be verified against the random.org public key.

All of the basic 'generation' api methods have a signed counterpart that take
the exact same parameters along with an additional, _optional_ `userData` parameter (see below):
 - `generateIntegers` → `generateSignedIntegers`
 - `generateIntegerSequences` → `generateSignedIntegerSequences`
 - `generateDecimalFractions` → `generateSignedDecimalFractions`
 - `generateGaussians` → `generateSignedGaussians`
 - `generateStrings` → `generateSignedStrings`
 - `generateUUIDs` → `generateSignedUUIDs`
 - `generateBlobs` → `generateSignedBlobs`

The `userData` parameter is an optional, arbitrary json object that will be included in the signed response if specified.
It's maximum size in encoded (string) form is 1000 characters.

The main difference between the basic and the signed methods is their response:
```javascript
response = {
  random: {
    // The name of the method you called.
    method: String,
    // A base64-encoded SHA-512 hash of your api key.
    // This allows you to provide this response to a third party without having to disclose your api key.
    hashedApiKey: String,

    /*
     * The parameters of your request will also be included here in the response.
     * E.g. for `generateSignedStrings`, you would receive additional properties:
     * n, length, characters & replacement
     */

    // Array containing your requested random numbers or strings.
    data: Array,
    // The time that request was completed, in ISO 8601 format (parsable with new Date(isoString)).
    completionTime: String,
    // The serial number of this response (unique to your api key's requests).
    serialNumber: Number,
    // Copied from the original request's `userData` parameter or `null` if not specified.
    userData: Object | null,
    // An object describing the license terms under which the random data in this response can be used.
    license: Object,
  },
  // A base64-encoded signature of `response.random`, signed with Random.org's private key.
  signature: String,
  // The number of random bits generated in this request.
  bitsUsed: Number,
  // An estimate of the number of remaining bits you can request.
  bitsLeft: Number,
  // An estimate of the number of remaining api calls you can make.
  requestsLeft: Number,
  // The recommended number of milliseconds you should wait before making another request.
  advisoryDelay: Number
}
```

#### `random.verifySignature(params : Object) : Promise`
In addition to the number generation methods, Random.org also provide a
convenience method api for verifying previously issued signed random numbers.

```javascript
params = {
  /* Required */
  // The original `response.random` object, received from one of the signed api calls.
  random: Object,
  // The corresponding `response.signature` string from the same request.
  signature: String
}

response = {
  // True if the signed numbers were generated by Random.org, false if not.
  authenticity: Boolean
}
```

#### `random.getResult(params: Object) : Promise`
When requesting data using the signed API methods, Random.org will store your result for some time (a minimum of 24 hours at time of writing).
You can fetch it again using the `serialNumber` that was returned in the original response.

**Please note:** All of the data in a successful response is historical.
_Including_ `bitsUsed`, `bitsLeft`, `requestsLeft` and `advisoryDelay`.

```javascript
params = {
  /* Required */
  // The serial number of the response you wish to fetch again.
  serialNumber: Number
}
```

### Account information
#### `random.getUsage() : Promise`
Get information about your account / api key.
```javascript
response = {
  // Your api key's current status. Either 'stopped', 'paused' or 'running'.
  // In order request random bits, your api key must be 'running'.
  status: String,
  // The timestamp at which your API key was created, in ISO 8601 format.
  creationTime: String,
  // An estimate of the number of remaining bits you can request.
  bitsLeft: Number,
  // An estimate of the number of remaining api calls you can make.
  requestsLeft: Number,
  // The recommended number of milliseconds you should wait before making another request.
  advisoryDelay: Number
}
```

## Random.org docs
For full api specs, see the official docs at
[https://api.random.org/json-rpc/2](https://api.random.org/json-rpc/2).

Note that the differences between the official docs and those presented here are simply due to the abstraction provided by the module.

## Disclaimer
This module merely provides a wrapper around the public api provided by
Random.org.
As such, I can't guarantee the availability or randomness of their service (or
anything else for that matter!).

## License
[MIT](./LICENSE)
