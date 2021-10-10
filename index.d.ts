export interface ConstructorOptions {
  apiKey: string;
}

export interface RandomOrgRPCResponse<T> {
  random: {
    /**
     * Your requested random numbers or strings.
     */
    data: T;
    /**
     * The time that request was completed, in ISO 8601 format (parsable with new Date(isoString)).
     */
    completionTime: string;
  };
  /**
   * The number of random bits generated in this request.
   */
  bitsUsed: number;
  /**
   * An estimate of the number of remaining bits you can request.
   */
  bitsLeft: number;
  /**
   * An estimate of the number of remaining api calls you can make.
   */
  requestsLeft: number;
  /**
   * The recommended number of milliseconds you should wait before making another request.
   */
  advisoryDelay: number;
}

export interface GenerateIntegersParams {
  /**
   * The number of random integers to generate (valid values: [1-10000]).
   */
  n: number;
  /**
   * Lower bound for random integers (valid values: [-1e9 - 1e9] and `< max`).
   */
  min: number;
  /**
   * Upper bound for random integers (valid values: [-1e9 - 1e9] and `> min`).
   */
  max: number;
  /**
   * Whether or not the generated numbers can contain duplicates (default: true).
   */
  replacement?: boolean;
  /**
   * The base of the generated numbers (default: 10; valid values: 2, 8, 10 or 16).
   * If `base` is any value other than 10, the generated numbers will be returned as strings.
   */
  base?: number;
}

export interface GenerateIntegerSequencesParams {
  /**
   * The number of random integer sequences to generate (valid values: [1-10000]).
   */
  n: number;
  /**
   * The length of the sequences to generate (valid values: [1-10000]).
   * Alternatively an array of `n` lengths if you need sequences of varying
   * lengths (the sum of all lengths must be in the range: [1-10000]).
   */
  length: number | number[];
  /**
   * Lower bound for random integers (valid values: [-1e9 - 1e9] and `< max`).
   */
  min: number;
  /**
   * Upper bound for random integers (valid values: [-1e9 - 1e9] and `> min`).
   */
  max: number;
  /**
   * Whether or not the generated numbers can contain duplicates (default: true).
   */
  replacement?: boolean;
  /**
   * The base of the generated numbers (default: 10; valid values: 2, 8, 10 or 16).
   * If `base` is any value other than 10, the generated numbers will be returned as strings.
   */
  base?: number;
}

export interface GenerateDecimalFractionsParams {
  /**
   * The number of random reals to generate (valid values: [1-10000]).
   */
  n: number;
  /**
   * The number of decimal places to use (valid values: [1-20]).
   */
  decimalPlaces: number;
  /**
   * Whether or not the generated numbers can contain duplicates (default: true).
   */
  replacement?: boolean;
}

export interface GenerateGaussiansParams {
  /**
   * The number of random numbers to generate (valid values: [1-10000]).
   */
  n: number;
  /**
   * The mean of the distribution to pull numbers from (valid values: [-1e6 - 1e6]).
   */
  mean: number;
  /**
   * Said distribution's standard deviation (valid values [-1e6 - 1e6]).
   */
  standardDeviation: number;
  /**
   * The number of significant digits for your requested random numbers (valid values: [2-20]).
   */
  significantDigits: number;
}

export interface GenerateStringsParams {
  /**
   * The number of random strings to generate (valid values: [1-10000]).
   */
  n: number;
  /**
   * The length of each string you'd like generated.
   */
  length: number;
  /**
   * The set of characters allowed to appear in the generated strings (maximum length: 80).
   * Unicode characters are supported.
   */
  characters: string;
  /**
   * Whether or not the generated numbers can contain duplicates (default: true).
   */
  replacement?: boolean;
}

export interface GenerateUUIDsParams {
  /**
   * The number of UUIDs to generate (valid values: [1-1000]).
   */
  n: number;
}

export interface GenerateBlobsParams {
  /**
   * The number of blobs you'd like (valid values: [1-100]).
   */
  n: number;
  /**
   * The size of each blob, in bits (valid values: [1-1048576] and `size % 8 === 0`).
   */
  size: number;
  /**
   * The format in which you'd like your blob (default: 'base64').
   */
  format?: 'base64' | 'hex';
}

export type WithUserData<T> = T & {
  userData?: Record<string, unknown>;
}

export interface SignedRandomOrgRPCResponse<Params, T> {
  random: Params & {
    /**
     * The name of the method you called.
     */
    method: string;
    /**
     * A base64-encoded SHA-512 hash of your api key.
     * This allows you to provide this response to a third party without having to disclose your api key.
     */
    hashedApiKey: string;

    /**
     * Your requested random numbers or strings.
     */
    data: T;
    /**
     * The time that request was completed, in ISO 8601 format (parsable with new Date(isoString)).
     */
    completionTime: string;
    /**
     * The serial number of this response (unique to your api key's requests).
     */
    serialNumber: number;
    /**
     * Copied from the original request's `userData` parameter or `null` if not specified.
     */
    userData: Record<string, unknown> | null;
    /**
     * An object describing the license terms under which the random data in this response can be used.
     */
    license: Record<string, unknown>;
  },
  /**
   * A base64-encoded signature of `response.random`, signed with Random.org's private key.
   */
  signature: string;
  /**
   * The number of random bits generated in this request.
   */
  bitsUsed: number;
  /**
   * An estimate of the number of remaining bits you can request.
   */
  bitsLeft: number;
  /**
   * An estimate of the number of remaining api calls you can make.
   */
  requestsLeft: number;
  /**
   * The recommended number of milliseconds you should wait before making another request.
   */
  advisoryDelay: number;
}

export interface GetUsageResponse {
  /**
   * Your api key's current status. Either 'stopped', 'paused' or 'running'.
   * In order request random bits, your api key must be 'running'.
   */
  status: 'stopped' | 'paused' | 'running';
  /**
   * The timestamp at which your API key was created, in ISO 8601 format.
   */
  creationTime: string;
  /**
   * An estimate of the number of remaining bits you can request.
   */
  bitsLeft: number;
  /**
   * An estimate of the number of remaining api calls you can make.
   */
  requestsLeft: number;
  /**
   * An integer containing the number of bits used by this API key since it was created.
   */
  totalBits: number;
  /**
   * An integer containing the number of requests used by this API key since it was created.
   */
  totalRequests: number;
}

interface VerifySignatureParams {
  /**
   * The original `response.random` object, received from one of the signed api calls.
   */
  random: SignedRandomOrgRPCResponse<{}, unknown>['random'];
  /**
   * The corresponding `response.signature` string from the same request.
   */
  signature: string;
}

interface VerifySignatureResponse {
  /**
   * True if the signed numbers were generated by Random.org, false if not.
   */
  authenticity: boolean;
}

interface GetResultParams {
  /**
   * The serial number of the response you wish to fetch again.
   */
  serialNumber: number;
}

export default class RandomOrg {
  constructor(opts: ConstructorOptions);

  // API Key usage
  getUsage(): Promise<GetUsageResponse>;

  // Basic methods
  generateIntegers(params: GenerateIntegersParams): Promise<RandomOrgRPCResponse<number[]>>;

  generateIntegerSequences(params: GenerateIntegerSequencesParams): Promise<RandomOrgRPCResponse<number[][]>>;

  generateDecimalFractions(params: GenerateDecimalFractionsParams): Promise<RandomOrgRPCResponse<number[]>>;

  generateGaussians(params: GenerateGaussiansParams): Promise<RandomOrgRPCResponse<number[]>>;

  generateStrings(params: GenerateStringsParams): Promise<RandomOrgRPCResponse<string[]>>;

  generateUUIDs(params: GenerateUUIDsParams): Promise<RandomOrgRPCResponse<string[]>>;

  generateBlobs(params: GenerateBlobsParams): Promise<RandomOrgRPCResponse<string[]>>;

  // Signed methods
  generateSignedIntegers(params: WithUserData<GenerateIntegersParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateIntegersParams, number[]>>;

  generateSignedIntegerSequences(params: WithUserData<GenerateIntegerSequencesParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateIntegerSequencesParams, number[][]>>;

  generateSignedDecimalFractions(params: WithUserData<GenerateDecimalFractionsParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateDecimalFractionsParams, number[]>>;

  generateSignedGaussians(params: WithUserData<GenerateGaussiansParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateGaussiansParams, number[]>>;

  generateSignedStrings(params: WithUserData<GenerateStringsParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateStringsParams, string[]>>;

  generateSignedUUIDs(params: WithUserData<GenerateUUIDsParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateUUIDsParams, string[]>>;

  generateSignedBlobs(params: WithUserData<GenerateBlobsParams>):
    Promise<SignedRandomOrgRPCResponse<GenerateBlobsParams, string[]>>;

  verifySignature(params: VerifySignatureParams): Promise<VerifySignatureResponse>;

  getResult<Params = {}, T = unknown>(params: GetResultParams): Promise<SignedRandomOrgRPCResponse<Params, T>>;
}
