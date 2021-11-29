import { UserDatabase } from "../services/users/users.service";

export const dataUser1: UserDatabase = {
  avatar:
    "https://firebasestorage.googleapis.com/v0/b/virginia-traffic-school.appspot.com/o/avatars%2Ftest%40gmail.com?alt=media&token=036b54b0-578d-43e5-9fcb-ea9b9464b041",
  country: "flag-icon-vn",
  createdAt: "1637593930910",
  databaseId: "-Mp7C55cppulwNrbj0hi",
  displayName: "UserNero",
  email: "test@gmail.com",
  lastLoginAt: "1637593930910",
  localId: "MbEuIFXoNugQgFLlQCtzTVDdwuY2",
  paymentMethod: "fa-cc-paypal",
  status: "badge-success",
  usage: "",
};
const dataUser2: UserDatabase = {
  avatar:
    "https://firebasestorage.googleapis.com/v0/b/virginia-traffic-school.appspot.com/o/avatars%2Fadmin%40admin.com?alt=media&token=ffe2290d-cbfb-4867-a592-0f4007aea31d",
  country: "flag-icon-vn",
  createdAt: "1637654876828",
  databaseId: "-MpAp_Q6KOZjAeD4g0zd",
  displayName: "Kute",
  email: "admin@admin.com",
  lastLoginAt: "1637654876828",
  localId: "e8yRgkeYjSZtliGxnvjPtSsOTVG3",
  paymentMethod: "fa-cc-stripe",
  status: "badge-danger",
  usage: "",
};
export const responUsers = {
  "-Mp7C55cppulwNrbj0hi": { ...dataUser1 },
  "-MpAp_Q6KOZjAeD4g0zd": { ...dataUser2 },
};
export const allUsers = [
  { ...dataUser1, id: "-Mp7C55cppulwNrbj0hi" },
  { ...dataUser2, id: "-MpAp_Q6KOZjAeD4g0zd" },
];

export const findUserByIdTokenRespon = {
  kind: "identitytoolkit#GetAccountInfoResponse",
  users: [
    {
      createdAt: "1638080673345",
      email: "test111@gmail.com",
      emailVerified: false,
      lastLoginAt: "1638080673345",
      lastRefreshAt: "2021-11-28T06:24:33.345Z",
      localId: "tlAU4eW7U8N48n0aRbkv2M4vUCn2",
      passwordHash: "UkVEQUNURUQ=",
      passwordUpdatedAt: 1638080673345,
      validSince: "1638080673",
      providerUserInfo: [
        {
          email: "test111@gmail.com",
          federatedId: "test111@gmail.com",
          providerId: "password",
          rawId: "test111@gmail.com",
        },
      ],
    },
  ],
};
export const responUserById = {
  avatar:
    "https://firebasestorage.googleapis.com/v0/b/virginia-traffic-school.appspot.com/o/avatars%2Fdefault.jfif?alt=media&token=bafe94d2-01bf-42db-b6d8-8853b9173da1",
  country: "",
  createdAt: "1638080673345",
  databaseId: "",
  displayName: "",
  email: "test111@gmail.com",
  lastLoginAt: "1638080673345",
  localId: "tlAU4eW7U8N48n0aRbkv2M4vUCn2",
  paymentMethod: "",
  status: "badge-success",
  usage: "",
};
