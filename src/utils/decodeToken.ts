// import { jwtDecode } from "jwt-decode";

// const token = "eyJ0eXAiO.../// jwt token";
// const decoded = jwtDecode(token);

// console.log(decoded);

// /* prints:
//  * { 
//  *   foo: "bar",
//  *   exp: 1393286893,
//  *   iat: 1393268893  
//  * }
//  */

// // decode header by passing in options (useful for when you need `kid` to verify a JWT):
// const decodedHeader = jwtDecode(token, { header: true });
// console.log(decodedHeader);

// /* prints:
//  * { 
//  *   typ: "JWT",
//  *   alg: "HS256" 
//  * }
//  */