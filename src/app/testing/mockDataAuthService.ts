import { of, throwError } from "rxjs";
import { User } from "../services/auth/auth.service";

export const mockUserData = new User(
  "test@gmail.com",
  "MbEuIFXoNugQgFLlQCtzTVDdwuY2",
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJlMzZhMWNiZDBiMjE2NjYxOTViZGIxZGZhMDFiNGNkYjAwNzg3OWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlyZ2luaWEtdHJhZmZpYy1zY2hvb2wiLCJhdWQiOiJ2aXJnaW5pYS10cmFmZmljLXNjaG9vbCIsImF1dGhfdGltZSI6MTYzNzk4MzYwMCwidXNlcl9pZCI6Ik1iRXVJRlhvTnVnUWdGTGxRQ3R6VFZEZHd1WTIiLCJzdWIiOiJNYkV1SUZYb051Z1FnRkxsUUN0elRWRGR3dVkyIiwiaWF0IjoxNjM3OTgzNjAwLCJleHAiOjE2Mzc5ODcyMDAsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.fizn46nROZXIItzMPucLyXpox8i1_P1xIXJJ7yfzKRodsMrOsziD2HaI-lxsf-AFufhfZuXXZB7LpFNs_m3lwoliWJJ6fWtX5KJ7w4i1Qfa3P-1CHRtjttbGs3Kr6iYwemgpj9xgX2sBHqY7pzvkOF3c9bZ1xZiDo_aSg9CA8peKQdMMgjQ6PUPzUJe05CMsOGA91AV3VMJ1O-TcwiI_PiDxImNyKR5VUqRg5b6JX2uFpWMrK4HZN-4T2U1RXll4sRccbJn3kAmyis8VS0IFmBAnjGvpl9b9p7Pu5so5kCevrMH2LDU82GVAgIOV3SwBbmrjTPObfM-RshWqtfIguQ",
  new Date("2022-12-27T04:26:40.638Z")
);

export const mockAuthResponseData = (email: string) => {
  if (email === "admin@admin.com") {
    return of({
      displayName: "",
      email: "admin@admin.com",
      expiresIn: "3600000",
      idToken:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJlMzZhMWNiZDBiMjE2NjYxOTViZGIxZGZhMDFiNGNkYjAwNzg3OWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlyZ2luaWEtdHJhZmZpYy1zY2hvb2wiLCJhdWQiOiJ2aXJnaW5pYS10cmFmZmljLXNjaG9vbCIsImF1dGhfdGltZSI6MTYzODAxNjE1OCwidXNlcl9pZCI6ImU4eVJna2VZalNadGxpR3hudmpQdFNzT1RWRzMiLCJzdWIiOiJlOHlSZ2tlWWpTWnRsaUd4bnZqUHRTc09UVkczIiwiaWF0IjoxNjM4MDE2MTU4LCJleHAiOjE2MzgwMTk3NTgsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkbWluQGFkbWluLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.IYFZorr_TINaD0T4mtAznG15WRizlQs3yBqGJnhhQLyfLIpkzmThjARaaXt1xPtDswwdWD6b4HRRY4JMXYgA21G0iGdm8q-X0wqj4o86oL4koRpzNJBeavHAHw_RAN8a-5bBvrEite2BUAQlfm7a8nSzhNae13yFUTOodhGQrmzQ6wPsP2SktoWzBa7uKljHg0cj_5pemzbRIk1rCr9Wl0-sJpbFV90LsAv9SHcDNcxd9PiLa82b8w8WyjunDpMLU6R-v-hMVwn9EqpnkyumT9Ch9PtkO6_c0TjlF1lxKFGCR89aGhfATd7U7abgzXl9ievC8Qf3VPMyJ0AorC5ZZg",
      kind: "identitytoolkit#VerifyPasswordResponse",
      localId: "e8yRgkeYjSZtliGxnvjPtSsOTVG3",
      refreshToken:
        "AFxQ4_rE2Mmp_X4bXT9MW69rfv29Jh8M0onBiFw7lgWeE_veVuulKCMLWLzkRs_Hcpn0hoRkUgBlPNnGAqW0sVfzXmtRWrtPMOa5u-ftWzdTgXYvQDyGfiZBL4KhZCnqIJ5XdTJVwDCGsrGghgTwkC6KNIDP47GwHj_K2geA1wiA60zD7-eIkjbDrhfK4UMRrjFB9-QPKlG2d1vGnPJgJjDa-ZXRY2UPYB4S9XKZqKsTIxln2PEIGb8",
      registered: true,
    });
  } else {
    return of({
      displayName: "",
      email: "test@gmail.com",
      expiresIn: "3600000",
      idToken:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJlMzZhMWNiZDBiMjE2NjYxOTViZGIxZGZhMDFiNGNkYjAwNzg3OWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlyZ2luaWEtdHJhZmZpYy1zY2hvb2wiLCJhdWQiOiJ2aXJnaW5pYS10cmFmZmljLXNjaG9vbCIsImF1dGhfdGltZSI6MTYzNzk4MzYwMCwidXNlcl9pZCI6Ik1iRXVJRlhvTnVnUWdGTGxRQ3R6VFZEZHd1WTIiLCJzdWIiOiJNYkV1SUZYb051Z1FnRkxsUUN0elRWRGR3dVkyIiwiaWF0IjoxNjM3OTgzNjAwLCJleHAiOjE2Mzc5ODcyMDAsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.fizn46nROZXIItzMPucLyXpox8i1_P1xIXJJ7yfzKRodsMrOsziD2HaI-lxsf-AFufhfZuXXZB7LpFNs_m3lwoliWJJ6fWtX5KJ7w4i1Qfa3P-1CHRtjttbGs3Kr6iYwemgpj9xgX2sBHqY7pzvkOF3c9bZ1xZiDo_aSg9CA8peKQdMMgjQ6PUPzUJe05CMsOGA91AV3VMJ1O-TcwiI_PiDxImNyKR5VUqRg5b6JX2uFpWMrK4HZN-4T2U1RXll4sRccbJn3kAmyis8VS0IFmBAnjGvpl9b9p7Pu5so5kCevrMH2LDU82GVAgIOV3SwBbmrjTPObfM-RshWqtfIguQ",
      kind: "identitytoolkit#VerifyPasswordResponse",
      localId: "MbEuIFXoNugQgFLlQCtzTVDdwuY2",
      refreshToken:
        "AFxQ4_pI4HC0xRRH3CCdxtTyPujDh5HqY81b92jqcPYKTNpvy3L09HD2yrogqBlHczwsCm-VLngiicBaZdBfc1DJo2b4ipOTZLyeBFURKG92QARiPEnB9ZvLcwZV87qWp4bgewupMUBAE8ZMfCjRNHuCmbeu1BnUA1KcZcOaKb9WlFVKfB67zNjnAgrOcoroe3MZt4h--GUXNu5SNABSgSFiErStzyiEoFJWr_QLILmpSFwPAAhmMUw",
      registered: true,
    });
  }
};
export const MOCK_SIGNUP_DATA_RESPONSE = {
  email: "usertest@gmail.com",
  expiresIn: "3600",
  idToken:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwNTg1Zjk5MjExMmZmODgxMTEzOTlhMzY5NzU2MTc1YWExYjRjZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlyZ2luaWEtdHJhZmZpYy1zY2hvb2wiLCJhdWQiOiJ2aXJnaW5pYS10cmFmZmljLXNjaG9vbCIsImF1dGhfdGltZSI6MTYzODE3MzMzNiwidXNlcl9pZCI6IjRrQUZTNWx6czJjOFgxZUVHbTRlWUJMaHRWNzMiLCJzdWIiOiI0a0FGUzVsenMyYzhYMWVFR200ZVlCTGh0VjczIiwiaWF0IjoxNjM4MTczMzM2LCJleHAiOjE2MzgxNzY5MzYsImVtYWlsIjoidXNlcnRlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInVzZXJ0ZXN0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.TAnkevqj3wru-SJZEG-p3qnKxegq6Mp29kw4xa0TPKPtNo6UsDREDAzrBgfRYPTnNpIteR70-G6tQqhMJBhXBgCaVEeKtE8ZXxGe_Bp_Q_tbb2x6lZeLm4kH_b-8-LjZoJ7eTGUzC3943KvsILt1I2eGlmqNjNhPIyz2aOdg98nMOm85KTy3y0chlg2kHir6kmgrLO4_s6U7AIdWXN0IFg_9WpgYCy366UXemZNJWVCSFjGTCR3kf2fxsMdDPxxT-CCt_Np1NEyR5Dy0gO7SrP9lTzNWfVwHuHr-fCkuoeUtaTi75kMskm03dYkUqheSHF639yMNr5qYjLpCrXYfoQ",
  kind: "identitytoolkit#SignupNewUserResponse",
  localId: "4kAFS5lzs2c8X1eEGm4eYBLhtV73",
  refreshToken:
    "AFxQ4_p6UaDkBjMs3JN6Pkn6z66p-KYw3C-qULv4dbigBlCIYKF5DR_oOsHjr5pQp9Nvl5IEramiBIXUrxXL-dryGBIfnk53M8cgLlrXGqjKH6eum4z8n1eUhqmpjvsTuWM4kuGt2OVGpa1pEErQaQ4-hbv69GQQbAYVQFvkupetkjSnqs8EriXIzPZzMyzWWZwerV5iGWVN6-s1Fcy3DGMyj03HkBkTuX0A98lChIsiYWkmssF1Bno",
};
export const MOCK_USERDATA_WITH_OUT_TIME = {
  email: "test@gmail.com",
  id: "MbEuIFXoNugQgFLlQCtzTVDdwuY2",
  _token:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwNTg1Zjk5MjExMmZmODgxMTEzOTlhMzY5NzU2MTc1YWExYjRjZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlyZ2luaWEtdHJhZmZpYy1zY2hvb2wiLCJhdWQiOiJ2aXJnaW5pYS10cmFmZmljLXNjaG9vbCIsImF1dGhfdGltZSI6MTYzODE4Njk3MCwidXNlcl9pZCI6Ik1iRXVJRlhvTnVnUWdGTGxRQ3R6VFZEZHd1WTIiLCJzdWIiOiJNYkV1SUZYb051Z1FnRkxsUUN0elRWRGR3dVkyIiwiaWF0IjoxNjM4MTg2OTcwLCJleHAiOjE2MzgxOTA1NzAsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Y5trJYOVzk-__CZ2WYp7cB8120DpQfXRHWc4vDsPBwN0ymzk2CSEOPTe7oPoiU0V9sZJbFk2FmNWiSlJEjMA84meODxGAzV77KBlug6mOn7qdEfwBCASC9lLcM4zNK6VJsOwVCV_ZKPpZ_w2wRcJQCSvgEMojxFckgEXxGpaGDFKIS2SbGQ8N50R_RbfFn2lZwRS8cti41a9UMcdKIz9gi1op2-NCrnvXOLQxXlSx0FVX72kB_sqeA-2NJTAdlG6I30C0Pky9_A3ts4hMK11f4R6qliWZCtIvntQerC0Xs5VThY3bOYgqDp7tU98_sdQaQH3YRodAsmRlvSxLGV-Og",
  _tokenExpirationDate: "2022-10-20T12:56:09.849Z",
};
export const MOCK_EMAIL_EXISTS_ERROR_RESPONSE = {
  error: {
    code: 400,
    message: "EMAIL_EXISTS",
    errors: [
      {
        domain: "global",
        message: "EMAIL_EXISTS",
        reason: "invalid",
      },
    ],
  },
};
export const MOCK_EMAIL_NOT_FOUND_ERROR_RESPONSE = {
  error: {
    code: 400,
    message: "EMAIL_NOT_FOUND",
    errors: [
      {
        domain: "global",
        message: "EMAIL_NOT_FOUND",
        reason: "invalid",
      },
    ],
  },
};
export const MOCK_INVALID_PASSWORD_ERROR_RESPONSE = {
  error: {
    code: 400,
    message: "INVALID_PASSWORD",
    errors: [
      {
        domain: "global",
        message: "INVALID_PASSWORD",
        reason: "invalid",
      },
    ],
  },
};
