export enum ErrorCode {
    INTERNAL_SERVER_ERROR = 500,
    UNKNOWN = 0,
    UNAUTHORIZED = 401,
    CONFLICT = 409, //Username already exists! or Duplicated Entity
    BAD_REQUEST = 400, //For format error
    ERR_CONNECTION_REFUSED = 102, //Network Error
    FORBIDDEN = 403,
    NOT_FOUND = 404, // Entity not found or search not found
    REQUEST_TIMEOUT = 408,
    UNSUPPORTED_MEDIA_TYPE = 415,
    NO_CONTENT = 204,
    OK = 200,
};

  /**
   * Although the error can be domain generated errors, the status can be based on HTTP error code.
   * 400	Bad Request	This is the generic error that tells us someone created a bad request or validation error. Perhaps required fields are missing or header values are not filled in.
   * 402	Payment Required.
   * 401	Unauthorized	Indicates that authentication has failed. This could be because of an expired, missing, or invalid token.
   * 403	Forbidden	Indicates that authorization failed. Alternatively, you can also use 404 so that the consumer doesn’t know that the resource even exists.
   * 404	Not Found	The requested resource is not found. Companies like GitHub also use 404 if you try to access a resource that you do not have the authorization to access.
   * 409	Conflict. There is a conflict with the current state of the desired resource, as a result, the server cannot return a response.
   * 413	This code appears when a user tries to upload a file that exceeds the server’s file size limit.
   * 413	Unsupported Media Type. The request has been refused by the server because it does not support the desired media type.
   * 418	<-- Unassigned. To customize. Here you can create your own type of error. -->
   * 419	<-- Unassigned. To customize. Here you can create your own type of error. -->
   * 420	<-- Unassigned. To customize. Here you can create your own type of error. -->
   * 423	Locked. Access to the desired resource is denied because it’s locked.
   * 424	Failed Dependency.
   * 427	<-- Unassigned. To customize. Here you can create your own type of error. -->
   * 430	<-- Unassigned. To customize. Here you can create your own type of error. -->
   * 431	Request Header Fields Too Large.
   * 452	-499  <-- Unassigned. To customize. Here you can create your own type of error. -->
   * 500	Internal Server Error	When something goes wrong on the server, the consumer can’t do anything about it. Just let them know there’s a problem and that they should try again later or contact support.
   * 501	Is an HTTP status code for not implemented. This status code is received when the server does not support the facility required. A 501 error is not something you can fix, but rather will require a fix by the web server admin who manages the website and  server you are trying to access. 
   * 503	Service Unavailable, the requested service is not available. This code tells users that the server is temporarily unable to load the page they're looking for.
   * 504	Gateway Timeout, the upstream server hasn’t provided a timely response to the second server, currently serving as a gateway or proxy. As a result, it cannot provide a response to the client.
   * 509	<-- Unassigned. To customize. Here you can create your own type of error. -->
   * 512  -599	<-- Unassigned. To customize. Here you can create your own type of error. -->
   */
  