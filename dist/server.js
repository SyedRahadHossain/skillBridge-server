var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper_exports = {};
__export(paginationSortingHelper_exports, {
  default: () => paginationSortingHelper_default
});
var paginationSortingHelper, paginationSortingHelper_default;
var init_paginationSortingHelper = __esm({
  "src/helpers/paginationSortingHelper.ts"() {
    "use strict";
    paginationSortingHelper = (options) => {
      const page = Number(options.page) || 1;
      const limit = Number(options.limit) || 10;
      const skip = (page - 1) * limit;
      const sortBy = options.sortBy || "createdAt";
      const sortOrder = options.sortOrder || "desc";
      return { page, limit, skip, sortBy, sortOrder };
    };
    paginationSortingHelper_default = paginationSortingHelper;
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express8 from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.1",
  "engineVersion": "55ae170b1ced7fc6ed07a15f110549408c501bb3",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  // output   = "../generated/prisma"\n  output   = "../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// \u2500\u2500\u2500 ENUMS\n\nenum Role {\n  student\n  tutor\n  admin\n}\n\nenum BookingStatus {\n  confirmed\n  completed\n  cancelled\n}\n\n// \u2500\u2500\u2500 BETTER AUTH TABLES \n\nmodel User {\n  id            String   @id\n  name          String\n  email         String   @unique\n  emailVerified Boolean\n  image         String?\n  createdAt     DateTime\n  updatedAt     DateTime\n\n  role     Role    @default(student)\n  isActive Boolean @default(true)\n\n  sessions     Session[]\n  accounts     Account[]\n  tutorProfile TutorProfile?\n  bookings     Booking[]     @relation("StudentBookings")\n  reviews      Review[]\n\n  @@index([role])\n  @@index([isActive])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// \u2500\u2500\u2500 APP TABLES\n\nmodel TutorProfile {\n  id           Int      @id @default(autoincrement())\n  userId       String   @unique\n  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bio          String?\n  hourlyRate   Float\n  experience   Int?\n  rating       Float    @default(0)\n  totalReviews Int      @default(0)\n  availability Json?\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  categories TutorCategory[]\n  bookings   Booking[]\n  reviews    Review[]\n\n  @@index([rating])\n  @@index([hourlyRate])\n}\n\nmodel Category {\n  id        Int      @id @default(autoincrement())\n  name      String   @unique\n  icon      String?\n  createdAt DateTime @default(now())\n\n  tutors TutorCategory[]\n}\n\nmodel TutorCategory {\n  tutorProfileId Int\n  categoryId     Int\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  category       Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@id([tutorProfileId, categoryId])\n  @@index([categoryId])\n}\n\nmodel Booking {\n  id             Int           @id @default(autoincrement())\n  studentId      String\n  tutorProfileId Int\n  student        User          @relation("StudentBookings", fields: [studentId], references: [id])\n  tutorProfile   TutorProfile  @relation(fields: [tutorProfileId], references: [id])\n  scheduledAt    DateTime\n  duration       Int\n  totalPrice     Float\n  status         BookingStatus @default(confirmed)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n\n  review Review?\n\n  @@index([studentId])\n  @@index([tutorProfileId])\n  @@index([status])\n  @@index([scheduledAt])\n  @@index([studentId, status])\n  @@index([tutorProfileId, status])\n}\n\nmodel Review {\n  id             Int          @id @default(autoincrement())\n  bookingId      Int          @unique\n  studentId      String\n  tutorProfileId Int\n  booking        Booking      @relation(fields: [bookingId], references: [id])\n  student        User         @relation(fields: [studentId], references: [id])\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  rating         Int\n  comment        String?\n  createdAt      DateTime     @default(now())\n\n  @@index([tutorProfileId])\n  @@index([studentId])\n  @@index([tutorProfileId, rating])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"availability","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorProfileId","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"Int"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"Int"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookingId","kind":"scalar","type":"Int"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"Int"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","tutorProfile","tutors","_count","category","categories","student","booking","review","bookings","reviews","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","_avg","_sum","TutorProfile.groupBy","TutorProfile.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","TutorCategory.findUnique","TutorCategory.findUniqueOrThrow","TutorCategory.findFirst","TutorCategory.findFirstOrThrow","TutorCategory.findMany","TutorCategory.createOne","TutorCategory.createMany","TutorCategory.createManyAndReturn","TutorCategory.updateOne","TutorCategory.updateMany","TutorCategory.updateManyAndReturn","TutorCategory.upsertOne","TutorCategory.deleteOne","TutorCategory.deleteMany","TutorCategory.groupBy","TutorCategory.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","bookingId","studentId","tutorProfileId","rating","comment","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","scheduledAt","duration","totalPrice","BookingStatus","status","updatedAt","categoryId","name","icon","every","some","none","userId","bio","hourlyRate","experience","totalReviews","availability","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","Role","role","isActive","tutorProfileId_categoryId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "ugRWkAERBAAArwIAIAUAALACACAGAACxAgAgDgAAnAIAIA8AAJ0CACCoAQAArAIAMKkBAAAmABCqAQAArAIAMKsBAQAAAAGxAUAAjwIAIcIBQACPAgAhxAEBAI0CACHkAQEAAAAB5QEgAK0CACHmAQEAjgIAIegBAACuAugBIukBIACtAgAhAQAAAAEAIAwDAACbAgAgqAEAAL0CADCpAQAAAwAQqgEAAL0CADCrAQEAjQIAIbEBQACPAgAhwgFAAI8CACHJAQEAjQIAIdcBQACPAgAh4QEBAI0CACHiAQEAjgIAIeMBAQCOAgAhAwMAAKwDACDiAQAAvgIAIOMBAAC-AgAgDAMAAJsCACCoAQAAvQIAMKkBAAADABCqAQAAvQIAMKsBAQAAAAGxAUAAjwIAIcIBQACPAgAhyQEBAI0CACHXAUAAjwIAIeEBAQAAAAHiAQEAjgIAIeMBAQCOAgAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACbAgAgqAEAALsCADCpAQAABwAQqgEAALsCADCrAQEAjQIAIbEBQACPAgAhwgFAAI8CACHJAQEAjQIAIdgBAQCNAgAh2QEBAI0CACHaAQEAjgIAIdsBAQCOAgAh3AEBAI4CACHdAUAAvAIAId4BQAC8AgAh3wEBAI4CACHgAQEAjgIAIQgDAACsAwAg2gEAAL4CACDbAQAAvgIAINwBAAC-AgAg3QEAAL4CACDeAQAAvgIAIN8BAAC-AgAg4AEAAL4CACARAwAAmwIAIKgBAAC7AgAwqQEAAAcAEKoBAAC7AgAwqwEBAAAAAbEBQACPAgAhwgFAAI8CACHJAQEAjQIAIdgBAQCNAgAh2QEBAI0CACHaAQEAjgIAIdsBAQCOAgAh3AEBAI4CACHdAUAAvAIAId4BQAC8AgAh3wEBAI4CACHgAQEAjgIAIQMAAAAHACABAAAIADACAAAJACARAwAAmwIAIAoAAJACACAOAACcAgAgDwAAnQIAIKgBAACXAgAwqQEAAAsAEKoBAACXAgAwqwECAIwCACGvAQgAmAIAIbEBQACPAgAhwgFAAI8CACHJAQEAjQIAIcoBAQCOAgAhywEIAJgCACHMAQIAmQIAIc0BAgCMAgAhzgEAAJoCACABAAAACwAgBwYAALQCACAJAAC6AgAgqAEAALkCADCpAQAADQAQqgEAALkCADCuAQIAjAIAIcMBAgCMAgAhAgYAAP0DACAJAACABAAgCAYAALQCACAJAAC6AgAgqAEAALkCADCpAQAADQAQqgEAALkCADCuAQIAjAIAIcMBAgCMAgAh6gEAALgCACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAANACAPBgAAtAIAIAsAAJsCACANAAC3AgAgqAEAALUCADCpAQAAEwAQqgEAALUCADCrAQIAjAIAIa0BAQCNAgAhrgECAIwCACGxAUAAjwIAIb0BQACPAgAhvgECAIwCACG_AQgAmAIAIcEBAAC2AsEBIsIBQACPAgAhAwYAAP0DACALAACsAwAgDQAA_wMAIA8GAAC0AgAgCwAAmwIAIA0AALcCACCoAQAAtQIAMKkBAAATABCqAQAAtQIAMKsBAgAAAAGtAQEAjQIAIa4BAgCMAgAhsQFAAI8CACG9AUAAjwIAIb4BAgCMAgAhvwEIAJgCACHBAQAAtgLBASLCAUAAjwIAIQMAAAATACABAAAUADACAAAVACANBgAAtAIAIAsAAJsCACAMAACzAgAgqAEAALICADCpAQAAFwAQqgEAALICADCrAQIAjAIAIawBAgCMAgAhrQEBAI0CACGuAQIAjAIAIa8BAgCMAgAhsAEBAI4CACGxAUAAjwIAIQEAAAAXACAEBgAA_QMAIAsAAKwDACAMAAD-AwAgsAEAAL4CACANBgAAtAIAIAsAAJsCACAMAACzAgAgqAEAALICADCpAQAAFwAQqgEAALICADCrAQIAAAABrAECAAAAAa0BAQCNAgAhrgECAIwCACGvAQIAjAIAIbABAQCOAgAhsQFAAI8CACEDAAAAFwAgAQAAGQAwAgAAGgAgAQAAAA0AIAEAAAATACABAAAAFwAgAwAAABMAIAEAABQAMAIAABUAIAMAAAAXACABAAAZADACAAAaACABAAAAAwAgAQAAAAcAIAEAAAATACABAAAAFwAgAQAAAAEAIBEEAACvAgAgBQAAsAIAIAYAALECACAOAACcAgAgDwAAnQIAIKgBAACsAgAwqQEAACYAEKoBAACsAgAwqwEBAI0CACGxAUAAjwIAIcIBQACPAgAhxAEBAI0CACHkAQEAjQIAIeUBIACtAgAh5gEBAI4CACHoAQAArgLoASLpASAArQIAIQYEAAD7AwAgBQAA_AMAIAYAAP0DACAOAACtAwAgDwAArgMAIOYBAAC-AgAgAwAAACYAIAEAACcAMAIAAAEAIAMAAAAmACABAAAnADACAAABACADAAAAJgAgAQAAJwAwAgAAAQAgDgQAAPYDACAFAAD3AwAgBgAA-AMAIA4AAPkDACAPAAD6AwAgqwEBAAAAAbEBQAAAAAHCAUAAAAABxAEBAAAAAeQBAQAAAAHlASAAAAAB5gEBAAAAAegBAAAA6AEC6QEgAAAAAQEVAAArACAJqwEBAAAAAbEBQAAAAAHCAUAAAAABxAEBAAAAAeQBAQAAAAHlASAAAAAB5gEBAAAAAegBAAAA6AEC6QEgAAAAAQEVAAAtADABFQAALQAwDgQAAMIDACAFAADDAwAgBgAAxAMAIA4AAMUDACAPAADGAwAgqwEBAMcCACGxAUAAxgIAIcIBQADGAgAhxAEBAMcCACHkAQEAxwIAIeUBIADAAwAh5gEBAMUCACHoAQAAwQPoASLpASAAwAMAIQIAAAABACAVAAAwACAJqwEBAMcCACGxAUAAxgIAIcIBQADGAgAhxAEBAMcCACHkAQEAxwIAIeUBIADAAwAh5gEBAMUCACHoAQAAwQPoASLpASAAwAMAIQIAAAAmACAVAAAyACACAAAAJgAgFQAAMgAgAwAAAAEAIBwAACsAIB0AADAAIAEAAAABACABAAAAJgAgBAgAAL0DACAiAAC_AwAgIwAAvgMAIOYBAAC-AgAgDKgBAAClAgAwqQEAADkAEKoBAAClAgAwqwEBAPYBACGxAUAA-AEAIcIBQAD4AQAhxAEBAPYBACHkAQEA9gEAIeUBIACmAgAh5gEBAPcBACHoAQAApwLoASLpASAApgIAIQMAAAAmACABAAA4ADAhAAA5ACADAAAAJgAgAQAAJwAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAAvAMAIKsBAQAAAAGxAUAAAAABwgFAAAAAAckBAQAAAAHXAUAAAAAB4QEBAAAAAeIBAQAAAAHjAQEAAAABARUAAEEAIAirAQEAAAABsQFAAAAAAcIBQAAAAAHJAQEAAAAB1wFAAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAQEVAABDADABFQAAQwAwCQMAALsDACCrAQEAxwIAIbEBQADGAgAhwgFAAMYCACHJAQEAxwIAIdcBQADGAgAh4QEBAMcCACHiAQEAxQIAIeMBAQDFAgAhAgAAAAUAIBUAAEYAIAirAQEAxwIAIbEBQADGAgAhwgFAAMYCACHJAQEAxwIAIdcBQADGAgAh4QEBAMcCACHiAQEAxQIAIeMBAQDFAgAhAgAAAAMAIBUAAEgAIAIAAAADACAVAABIACADAAAABQAgHAAAQQAgHQAARgAgAQAAAAUAIAEAAAADACAFCAAAuAMAICIAALoDACAjAAC5AwAg4gEAAL4CACDjAQAAvgIAIAuoAQAApAIAMKkBAABPABCqAQAApAIAMKsBAQD2AQAhsQFAAPgBACHCAUAA-AEAIckBAQD2AQAh1wFAAPgBACHhAQEA9gEAIeIBAQD3AQAh4wEBAPcBACEDAAAAAwAgAQAATgAwIQAATwAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAALcDACCrAQEAAAABsQFAAAAAAcIBQAAAAAHJAQEAAAAB2AEBAAAAAdkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAUAAAAAB3gFAAAAAAd8BAQAAAAHgAQEAAAABARUAAFcAIA2rAQEAAAABsQFAAAAAAcIBQAAAAAHJAQEAAAAB2AEBAAAAAdkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBAQAAAAHdAUAAAAAB3gFAAAAAAd8BAQAAAAHgAQEAAAABARUAAFkAMAEVAABZADAOAwAAtgMAIKsBAQDHAgAhsQFAAMYCACHCAUAAxgIAIckBAQDHAgAh2AEBAMcCACHZAQEAxwIAIdoBAQDFAgAh2wEBAMUCACHcAQEAxQIAId0BQAC1AwAh3gFAALUDACHfAQEAxQIAIeABAQDFAgAhAgAAAAkAIBUAAFwAIA2rAQEAxwIAIbEBQADGAgAhwgFAAMYCACHJAQEAxwIAIdgBAQDHAgAh2QEBAMcCACHaAQEAxQIAIdsBAQDFAgAh3AEBAMUCACHdAUAAtQMAId4BQAC1AwAh3wEBAMUCACHgAQEAxQIAIQIAAAAHACAVAABeACACAAAABwAgFQAAXgAgAwAAAAkAIBwAAFcAIB0AAFwAIAEAAAAJACABAAAABwAgCggAALIDACAiAAC0AwAgIwAAswMAINoBAAC-AgAg2wEAAL4CACDcAQAAvgIAIN0BAAC-AgAg3gEAAL4CACDfAQAAvgIAIOABAAC-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_QIAICIAAIADACAjAAD_AgAgZAAA_gIAIGUAAIEDACDKAQAAvgIAIMwBAAC-AgAgzgEAAL4CACANqAEAAJECADCpAQAAlgEAEKoBAACRAgAwqwECAPUBACGvAQgAhAIAIbEBQAD4AQAhwgFAAPgBACHJAQEA9gEAIcoBAQD3AQAhywEIAIQCACHMAQIAkgIAIc0BAgD1AQAhzgEAAJMCACADAAAACwAgAQAAlQEAMCEAAJYBACADAAAACwAgAQAAhAEAMAIAAIEBACAIBwAAkAIAIKgBAACLAgAwqQEAAJwBABCqAQAAiwIAMKsBAgAAAAGxAUAAjwIAIcQBAQAAAAHFAQEAjgIAIQEAAACZAQAgAQAAAJkBACAIBwAAkAIAIKgBAACLAgAwqQEAAJwBABCqAQAAiwIAMKsBAgCMAgAhsQFAAI8CACHEAQEAjQIAIcUBAQCOAgAhAgcAAPwCACDFAQAAvgIAIAMAAACcAQAgAQAAnQEAMAIAAJkBACADAAAAnAEAIAEAAJ0BADACAACZAQAgAwAAAJwBACABAACdAQAwAgAAmQEAIAUHAAD7AgAgqwECAAAAAbEBQAAAAAHEAQEAAAABxQEBAAAAAQEVAAChAQAgBKsBAgAAAAGxAUAAAAABxAEBAAAAAcUBAQAAAAEBFQAAowEAMAEVAACjAQAwBQcAAO4CACCrAQIAxAIAIbEBQADGAgAhxAEBAMcCACHFAQEAxQIAIQIAAACZAQAgFQAApgEAIASrAQIAxAIAIbEBQADGAgAhxAEBAMcCACHFAQEAxQIAIQIAAACcAQAgFQAAqAEAIAIAAACcAQAgFQAAqAEAIAMAAACZAQAgHAAAoQEAIB0AAKYBACABAAAAmQEAIAEAAACcAQAgBggAAOkCACAiAADsAgAgIwAA6wIAIGQAAOoCACBlAADtAgAgxQEAAL4CACAHqAEAAIoCADCpAQAArwEAEKoBAACKAgAwqwECAPUBACGxAUAA-AEAIcQBAQD2AQAhxQEBAPcBACEDAAAAnAEAIAEAAK4BADAhAACvAQAgAwAAAJwBACABAACdAQAwAgAAmQEAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgBAYAAOcCACAJAADoAgAgrgECAAAAAcMBAgAAAAEBFQAAtwEAIAKuAQIAAAABwwECAAAAAQEVAAC5AQAwARUAALkBADAEBgAA5QIAIAkAAOYCACCuAQIAxAIAIcMBAgDEAgAhAgAAAA8AIBUAALwBACACrgECAMQCACHDAQIAxAIAIQIAAAANACAVAAC-AQAgAgAAAA0AIBUAAL4BACADAAAADwAgHAAAtwEAIB0AALwBACABAAAADwAgAQAAAA0AIAUIAADgAgAgIgAA4wIAICMAAOICACBkAADhAgAgZQAA5AIAIAWoAQAAiQIAMKkBAADFAQAQqgEAAIkCADCuAQIA9QEAIcMBAgD1AQAhAwAAAA0AIAEAAMQBADAhAADFAQAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgDAYAAN4CACALAADdAgAgDQAA3wIAIKsBAgAAAAGtAQEAAAABrgECAAAAAbEBQAAAAAG9AUAAAAABvgECAAAAAb8BCAAAAAHBAQAAAMEBAsIBQAAAAAEBFQAAzQEAIAmrAQIAAAABrQEBAAAAAa4BAgAAAAGxAUAAAAABvQFAAAAAAb4BAgAAAAG_AQgAAAABwQEAAADBAQLCAUAAAAABARUAAM8BADABFQAAzwEAMAwGAADWAgAgCwAA1QIAIA0AANcCACCrAQIAxAIAIa0BAQDHAgAhrgECAMQCACGxAUAAxgIAIb0BQADGAgAhvgECAMQCACG_AQgA0wIAIcEBAADUAsEBIsIBQADGAgAhAgAAABUAIBUAANIBACAJqwECAMQCACGtAQEAxwIAIa4BAgDEAgAhsQFAAMYCACG9AUAAxgIAIb4BAgDEAgAhvwEIANMCACHBAQAA1ALBASLCAUAAxgIAIQIAAAATACAVAADUAQAgAgAAABMAIBUAANQBACADAAAAFQAgHAAAzQEAIB0AANIBACABAAAAFQAgAQAAABMAIAUIAADOAgAgIgAA0QIAICMAANACACBkAADPAgAgZQAA0gIAIAyoAQAAgwIAMKkBAADbAQAQqgEAAIMCADCrAQIA9QEAIa0BAQD2AQAhrgECAPUBACGxAUAA-AEAIb0BQAD4AQAhvgECAPUBACG_AQgAhAIAIcEBAACFAsEBIsIBQAD4AQAhAwAAABMAIAEAANoBADAhAADbAQAgAwAAABMAIAEAABQAMAIAABUAIAEAAAAaACABAAAAGgAgAwAAABcAIAEAABkAMAIAABoAIAMAAAAXACABAAAZADACAAAaACADAAAAFwAgAQAAGQAwAgAAGgAgCgYAAM0CACALAADMAgAgDAAAywIAIKsBAgAAAAGsAQIAAAABrQEBAAAAAa4BAgAAAAGvAQIAAAABsAEBAAAAAbEBQAAAAAEBFQAA4wEAIAerAQIAAAABrAECAAAAAa0BAQAAAAGuAQIAAAABrwECAAAAAbABAQAAAAGxAUAAAAABARUAAOUBADABFQAA5QEAMAoGAADKAgAgCwAAyQIAIAwAAMgCACCrAQIAxAIAIawBAgDEAgAhrQEBAMcCACGuAQIAxAIAIa8BAgDEAgAhsAEBAMUCACGxAUAAxgIAIQIAAAAaACAVAADoAQAgB6sBAgDEAgAhrAECAMQCACGtAQEAxwIAIa4BAgDEAgAhrwECAMQCACGwAQEAxQIAIbEBQADGAgAhAgAAABcAIBUAAOoBACACAAAAFwAgFQAA6gEAIAMAAAAaACAcAADjAQAgHQAA6AEAIAEAAAAaACABAAAAFwAgBggAAL8CACAiAADCAgAgIwAAwQIAIGQAAMACACBlAADDAgAgsAEAAL4CACAKqAEAAPQBADCpAQAA8QEAEKoBAAD0AQAwqwECAPUBACGsAQIA9QEAIa0BAQD2AQAhrgECAPUBACGvAQIA9QEAIbABAQD3AQAhsQFAAPgBACEDAAAAFwAgAQAA8AEAMCEAAPEBACADAAAAFwAgAQAAGQAwAgAAGgAgCqgBAAD0AQAwqQEAAPEBABCqAQAA9AEAMKsBAgD1AQAhrAECAPUBACGtAQEA9gEAIa4BAgD1AQAhrwECAPUBACGwAQEA9wEAIbEBQAD4AQAhDQgAAPoBACAiAAD6AQAgIwAA-gEAIGQAAIICACBlAAD6AQAgsgECAAAAAbMBAgAAAAS0AQIAAAAEtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAAAAAbkBAgCBAgAhDggAAPoBACAiAACAAgAgIwAAgAIAILIBAQAAAAGzAQEAAAAEtAEBAAAABLUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAG5AQEA_wEAIboBAQAAAAG7AQEAAAABvAEBAAAAAQ4IAAD9AQAgIgAA_gEAICMAAP4BACCyAQEAAAABswEBAAAABbQBAQAAAAW1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAPwBACG6AQEAAAABuwEBAAAAAbwBAQAAAAELCAAA-gEAICIAAPsBACAjAAD7AQAgsgFAAAAAAbMBQAAAAAS0AUAAAAAEtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAbkBQAD5AQAhCwgAAPoBACAiAAD7AQAgIwAA-wEAILIBQAAAAAGzAUAAAAAEtAFAAAAABLUBQAAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAG5AUAA-QEAIQiyAQIAAAABswECAAAABLQBAgAAAAS1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIAAAABuQECAPoBACEIsgFAAAAAAbMBQAAAAAS0AUAAAAAEtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAbkBQAD7AQAhDggAAP0BACAiAAD-AQAgIwAA_gEAILIBAQAAAAGzAQEAAAAFtAEBAAAABbUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAG5AQEA_AEAIboBAQAAAAG7AQEAAAABvAEBAAAAAQiyAQIAAAABswECAAAABbQBAgAAAAW1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIAAAABuQECAP0BACELsgEBAAAAAbMBAQAAAAW0AQEAAAAFtQEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAAAAAbkBAQD-AQAhugEBAAAAAbsBAQAAAAG8AQEAAAABDggAAPoBACAiAACAAgAgIwAAgAIAILIBAQAAAAGzAQEAAAAEtAEBAAAABLUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAG5AQEA_wEAIboBAQAAAAG7AQEAAAABvAEBAAAAAQuyAQEAAAABswEBAAAABLQBAQAAAAS1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAIACACG6AQEAAAABuwEBAAAAAbwBAQAAAAENCAAA-gEAICIAAPoBACAjAAD6AQAgZAAAggIAIGUAAPoBACCyAQIAAAABswECAAAABLQBAgAAAAS1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIAAAABuQECAIECACEIsgEIAAAAAbMBCAAAAAS0AQgAAAAEtQEIAAAAAbYBCAAAAAG3AQgAAAABuAEIAAAAAbkBCACCAgAhDKgBAACDAgAwqQEAANsBABCqAQAAgwIAMKsBAgD1AQAhrQEBAPYBACGuAQIA9QEAIbEBQAD4AQAhvQFAAPgBACG-AQIA9QEAIb8BCACEAgAhwQEAAIUCwQEiwgFAAPgBACENCAAA-gEAICIAAIICACAjAACCAgAgZAAAggIAIGUAAIICACCyAQgAAAABswEIAAAABLQBCAAAAAS1AQgAAAABtgEIAAAAAbcBCAAAAAG4AQgAAAABuQEIAIgCACEHCAAA-gEAICIAAIcCACAjAACHAgAgsgEAAADBAQKzAQAAAMEBCLQBAAAAwQEIuQEAAIYCwQEiBwgAAPoBACAiAACHAgAgIwAAhwIAILIBAAAAwQECswEAAADBAQi0AQAAAMEBCLkBAACGAsEBIgSyAQAAAMEBArMBAAAAwQEItAEAAADBAQi5AQAAhwLBASINCAAA-gEAICIAAIICACAjAACCAgAgZAAAggIAIGUAAIICACCyAQgAAAABswEIAAAABLQBCAAAAAS1AQgAAAABtgEIAAAAAbcBCAAAAAG4AQgAAAABuQEIAIgCACEFqAEAAIkCADCpAQAAxQEAEKoBAACJAgAwrgECAPUBACHDAQIA9QEAIQeoAQAAigIAMKkBAACvAQAQqgEAAIoCADCrAQIA9QEAIbEBQAD4AQAhxAEBAPYBACHFAQEA9wEAIQgHAACQAgAgqAEAAIsCADCpAQAAnAEAEKoBAACLAgAwqwECAIwCACGxAUAAjwIAIcQBAQCNAgAhxQEBAI4CACEIsgECAAAAAbMBAgAAAAS0AQIAAAAEtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAAAAAbkBAgD6AQAhC7IBAQAAAAGzAQEAAAAEtAEBAAAABLUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQAAAAG5AQEAgAIAIboBAQAAAAG7AQEAAAABvAEBAAAAAQuyAQEAAAABswEBAAAABbQBAQAAAAW1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEAAAABuQEBAP4BACG6AQEAAAABuwEBAAAAAbwBAQAAAAEIsgFAAAAAAbMBQAAAAAS0AUAAAAAEtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAbkBQAD7AQAhA8YBAAANACDHAQAADQAgyAEAAA0AIA2oAQAAkQIAMKkBAACWAQAQqgEAAJECADCrAQIA9QEAIa8BCACEAgAhsQFAAPgBACHCAUAA-AEAIckBAQD2AQAhygEBAPcBACHLAQgAhAIAIcwBAgCSAgAhzQECAPUBACHOAQAAkwIAIA0IAAD9AQAgIgAA_QEAICMAAP0BACBkAACWAgAgZQAA_QEAILIBAgAAAAGzAQIAAAAFtAECAAAABbUBAgAAAAG2AQIAAAABtwECAAAAAbgBAgAAAAG5AQIAlQIAIQ8IAAD9AQAgIgAAlAIAICMAAJQCACCyAYAAAAABtQGAAAAAAbYBgAAAAAG3AYAAAAABuAGAAAAAAbkBgAAAAAHPAQEAAAAB0AEBAAAAAdEBAQAAAAHSAYAAAAAB0wGAAAAAAdQBgAAAAAEMsgGAAAAAAbUBgAAAAAG2AYAAAAABtwGAAAAAAbgBgAAAAAG5AYAAAAABzwEBAAAAAdABAQAAAAHRAQEAAAAB0gGAAAAAAdMBgAAAAAHUAYAAAAABDQgAAP0BACAiAAD9AQAgIwAA_QEAIGQAAJYCACBlAAD9AQAgsgECAAAAAbMBAgAAAAW0AQIAAAAFtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAAAAAbkBAgCVAgAhCLIBCAAAAAGzAQgAAAAFtAEIAAAABbUBCAAAAAG2AQgAAAABtwEIAAAAAbgBCAAAAAG5AQgAlgIAIREDAACbAgAgCgAAkAIAIA4AAJwCACAPAACdAgAgqAEAAJcCADCpAQAACwAQqgEAAJcCADCrAQIAjAIAIa8BCACYAgAhsQFAAI8CACHCAUAAjwIAIckBAQCNAgAhygEBAI4CACHLAQgAmAIAIcwBAgCZAgAhzQECAIwCACHOAQAAmgIAIAiyAQgAAAABswEIAAAABLQBCAAAAAS1AQgAAAABtgEIAAAAAbcBCAAAAAG4AQgAAAABuQEIAIICACEIsgECAAAAAbMBAgAAAAW0AQIAAAAFtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAAAAAbkBAgD9AQAhDLIBgAAAAAG1AYAAAAABtgGAAAAAAbcBgAAAAAG4AYAAAAABuQGAAAAAAc8BAQAAAAHQAQEAAAAB0QEBAAAAAdIBgAAAAAHTAYAAAAAB1AGAAAAAARMEAACvAgAgBQAAsAIAIAYAALECACAOAACcAgAgDwAAnQIAIKgBAACsAgAwqQEAACYAEKoBAACsAgAwqwEBAI0CACGxAUAAjwIAIcIBQACPAgAhxAEBAI0CACHkAQEAjQIAIeUBIACtAgAh5gEBAI4CACHoAQAArgLoASLpASAArQIAIesBAAAmACDsAQAAJgAgA8YBAAATACDHAQAAEwAgyAEAABMAIAPGAQAAFwAgxwEAABcAIMgBAAAXACAJqAEAAJ4CADCpAQAAfgAQqgEAAJ4CADCrAQEA9gEAIbEBQAD4AQAhwgFAAPgBACHVAQEA9gEAIdYBAQD2AQAh1wFAAPgBACEJqAEAAJ8CADCpAQAAawAQqgEAAJ8CADCrAQEAjQIAIbEBQACPAgAhwgFAAI8CACHVAQEAjQIAIdYBAQCNAgAh1wFAAI8CACEQqAEAAKACADCpAQAAZQAQqgEAAKACADCrAQEA9gEAIbEBQAD4AQAhwgFAAPgBACHJAQEA9gEAIdgBAQD2AQAh2QEBAPYBACHaAQEA9wEAIdsBAQD3AQAh3AEBAPcBACHdAUAAoQIAId4BQAChAgAh3wEBAPcBACHgAQEA9wEAIQsIAAD9AQAgIgAAowIAICMAAKMCACCyAUAAAAABswFAAAAABbQBQAAAAAW1AUAAAAABtgFAAAAAAbcBQAAAAAG4AUAAAAABuQFAAKICACELCAAA_QEAICIAAKMCACAjAACjAgAgsgFAAAAAAbMBQAAAAAW0AUAAAAAFtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAAAAAbkBQACiAgAhCLIBQAAAAAGzAUAAAAAFtAFAAAAABbUBQAAAAAG2AUAAAAABtwFAAAAAAbgBQAAAAAG5AUAAowIAIQuoAQAApAIAMKkBAABPABCqAQAApAIAMKsBAQD2AQAhsQFAAPgBACHCAUAA-AEAIckBAQD2AQAh1wFAAPgBACHhAQEA9gEAIeIBAQD3AQAh4wEBAPcBACEMqAEAAKUCADCpAQAAOQAQqgEAAKUCADCrAQEA9gEAIbEBQAD4AQAhwgFAAPgBACHEAQEA9gEAIeQBAQD2AQAh5QEgAKYCACHmAQEA9wEAIegBAACnAugBIukBIACmAgAhBQgAAPoBACAiAACrAgAgIwAAqwIAILIBIAAAAAG5ASAAqgIAIQcIAAD6AQAgIgAAqQIAICMAAKkCACCyAQAAAOgBArMBAAAA6AEItAEAAADoAQi5AQAAqALoASIHCAAA-gEAICIAAKkCACAjAACpAgAgsgEAAADoAQKzAQAAAOgBCLQBAAAA6AEIuQEAAKgC6AEiBLIBAAAA6AECswEAAADoAQi0AQAAAOgBCLkBAACpAugBIgUIAAD6AQAgIgAAqwIAICMAAKsCACCyASAAAAABuQEgAKoCACECsgEgAAAAAbkBIACrAgAhEQQAAK8CACAFAACwAgAgBgAAsQIAIA4AAJwCACAPAACdAgAgqAEAAKwCADCpAQAAJgAQqgEAAKwCADCrAQEAjQIAIbEBQACPAgAhwgFAAI8CACHEAQEAjQIAIeQBAQCNAgAh5QEgAK0CACHmAQEAjgIAIegBAACuAugBIukBIACtAgAhArIBIAAAAAG5ASAAqwIAIQSyAQAAAOgBArMBAAAA6AEItAEAAADoAQi5AQAAqQLoASIDxgEAAAMAIMcBAAADACDIAQAAAwAgA8YBAAAHACDHAQAABwAgyAEAAAcAIBMDAACbAgAgCgAAkAIAIA4AAJwCACAPAACdAgAgqAEAAJcCADCpAQAACwAQqgEAAJcCADCrAQIAjAIAIa8BCACYAgAhsQFAAI8CACHCAUAAjwIAIckBAQCNAgAhygEBAI4CACHLAQgAmAIAIcwBAgCZAgAhzQECAIwCACHOAQAAmgIAIOsBAAALACDsAQAACwAgDQYAALQCACALAACbAgAgDAAAswIAIKgBAACyAgAwqQEAABcAEKoBAACyAgAwqwECAIwCACGsAQIAjAIAIa0BAQCNAgAhrgECAIwCACGvAQIAjAIAIbABAQCOAgAhsQFAAI8CACERBgAAtAIAIAsAAJsCACANAAC3AgAgqAEAALUCADCpAQAAEwAQqgEAALUCADCrAQIAjAIAIa0BAQCNAgAhrgECAIwCACGxAUAAjwIAIb0BQACPAgAhvgECAIwCACG_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_AQgAAAABwQEAAADBAQLCAUAAAAABAgAAABUAIBwAAJ4DACADAAAAFQAgHAAAngMAIB0AAJ0DACABFQAAkgQAMA8GAAC0AgAgCwAAmwIAIA0AALcCACCoAQAAtQIAMKkBAAATABCqAQAAtQIAMKsBAgAAAAGtAQEAjQIAIa4BAgCMAgAhsQFAAI8CACG9AUAAjwIAIb4BAgCMAgAhvwEIAJgCACHBAQAAtgLBASLCAUAAjwIAIQIAAAAVACAVAACdAwAgAgAAAJsDACAVAACcAwAgDKgBAACaAwAwqQEAAJsDABCqAQAAmgMAMKsBAgCMAgAhrQEBAI0CACGuAQIAjAIAIbEBQACPAgAhvQFAAI8CACG-AQIAjAIAIb8BCACYAgAhwQEAALYCwQEiwgFAAI8CACEMqAEAAJoDADCpAQAAmwMAEKoBAACaAwAwqwECAIwCACGtAQEAjQIAIa4BAgCMAgAhsQFAAI8CACG9AUAAjwIAIb4BAgCMAgAhvwEIAJgCACHBAQAAtgLBASLCAUAAjwIAIQirAQIAxAIAIa0BAQDHAgAhsQFAAMYCACG9AUAAxgIAIb4BAgDEAgAhvwEIANMCACHBAQAA1ALBASLCAUAAxgIAIQoLAADVAgAgDQAA1wIAIKsBAgDEAgAhrQEBAMcCACGxAUAAxgIAIb0BQADGAgAhvgECAMQCACG_AQgA0wIAIcEBAADUAsEBIsIBQADGAgAhCgsAAN0CACANAADfAgAgqwECAAAAAa0BAQAAAAGxAUAAAAABvQFAAAAAAb4BAgAAAAG_AQgAAAABwQEAAADBAQLCAUAAAAABAgkAAOgCACDDAQIAAAABAgAAAA8AIBwAAKcDACADAAAADwAgHAAApwMAIB0AAKYDACABFQAAkQQAMAIAAAAPACAVAACmAwAgAgAAAPcCACAVAAClAwAgAcMBAgDEAgAhAgkAAOYCACDDAQIAxAIAIQIJAADoAgAgwwECAAAAAQMcAACPBAAg7QEAAJAEACDxAQAAAQAgBBwAAJ8DADDtAQAAoAMAMPEBAADzAgAw8gEAAKIDACAEHAAAkwMAMO0BAACUAwAw8QEAAJcDADDyAQAAlgMAIAQcAACHAwAw7QEAAIgDADDxAQAAiwMAMPIBAACKAwAgBgQAAPsDACAFAAD8AwAgBgAA_QMAIA4AAK0DACAPAACuAwAg5gEAAL4CACAAAAAAAAAAAAHzAUAAAAABBRwAAIoEACAdAACNBAAg7QEAAIsEACDuAQAAjAQAIPEBAAABACADHAAAigQAIO0BAACLBAAg8QEAAAEAIAAAAAUcAACFBAAgHQAAiAQAIO0BAACGBAAg7gEAAIcEACDxAQAAAQAgAxwAAIUEACDtAQAAhgQAIPEBAAABACAAAAAB8wEgAAAAAQHzAQAAAOgBAgscAADqAwAwHQAA7wMAMO0BAADrAwAw7gEAAOwDADDvAQAA7gMAMPABAADuAwAw8QEAAO4DADDyAQAA7QMAIPMBAADuAwAw9AEAAPADADD1AQAA8QMAMAscAADeAwAwHQAA4wMAMO0BAADfAwAw7gEAAOADADDvAQAA4gMAMPABAADiAwAw8QEAAOIDADDyAQAA4QMAIPMBAADiAwAw9AEAAOQDADD1AQAA5QMAMAccAADZAwAgHQAA3AMAIO0BAADaAwAg7gEAANsDACDvAQAACwAg8AEAAAsAIPEBAACBAQAgCxwAANADADAdAADUAwAw7QEAANEDADDuAQAA0gMAMO8BAACXAwAw8AEAAJcDADDxAQAAlwMAMPIBAADTAwAg8wEAAJcDADD0AQAA1QMAMPUBAACaAwAwCxwAAMcDADAdAADLAwAw7QEAAMgDADDuAQAAyQMAMO8BAACLAwAw8AEAAIsDADDxAQAAiwMAMPIBAADKAwAg8wEAAIsDADD0AQAAzAMAMPUBAACOAwAwCAYAAM0CACAMAADLAgAgqwECAAAAAawBAgAAAAGuAQIAAAABrwECAAAAAbABAQAAAAGxAUAAAAABAgAAABoAIBwAAM8DACADAAAAGgAgHAAAzwMAIB0AAM4DACABFQAAhAQAMAIAAAAaACAVAADOAwAgAgAAAI8DACAVAADNAwAgBqsBAgDEAgAhrAECAMQCACGuAQIAxAIAIa8BAgDEAgAhsAEBAMUCACGxAUAAxgIAIQgGAADKAgAgDAAAyAIAIKsBAgDEAgAhrAECAMQCACGuAQIAxAIAIa8BAgDEAgAhsAEBAMUCACGxAUAAxgIAIQgGAADNAgAgDAAAywIAIKsBAgAAAAGsAQIAAAABrgECAAAAAa8BAgAAAAGwAQEAAAABsQFAAAAAAQoGAADeAgAgDQAA3wIAIKsBAgAAAAGuAQIAAAABsQFAAAAAAb0BQAAAAAG-AQIAAAABvwEIAAAAAcEBAAAAwQECwgFAAAAAAQIAAAAVACAcAADYAwAgAwAAABUAIBwAANgDACAdAADXAwAgARUAAIMEADACAAAAFQAgFQAA1wMAIAIAAACbAwAgFQAA1gMAIAirAQIAxAIAIa4BAgDEAgAhsQFAAMYCACG9AUAAxgIAIb4BAgDEAgAhvwEIANMCACHBAQAA1ALBASLCAUAAxgIAIQoGAADWAgAgDQAA1wIAIKsBAgDEAgAhrgECAMQCACGxAUAAxgIAIb0BQADGAgAhvgECAMQCACG_AQgA0wIAIcEBAADUAsEBIsIBQADGAgAhCgYAAN4CACANAADfAgAgqwECAAAAAa4BAgAAAAGxAUAAAAABvQFAAAAAAb4BAgAAAAG_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_QMAIAsAAKwDACAMAAD-AwAgsAEAAL4CACACBwAA_AIAIMUBAAC-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_AQgA0wIAIcEBAADUAsEBIsIBQADGAgAhCwYAANYCACALAADVAgAgqwECAMQCACGtAQEAxwIAIa4BAgDEAgAhsQFAAMYCACG9AUAAxgIAIb4BAgDEAgAhvwEIANMCACHBAQAA1ALBASLCAUAAxgIAIQYEBgIFCgMGDAQIAAsOHwgPIAkBAwABAQMAAQUDAAEIAAoKEAUOFggPGwkCBgAECQAGAgcRBQgABwEHEgADBgAECwABDRgJAwYABAsAAQwACAMKHAAOHQAPHgAEBCEABSIADiMADyQAAAAAAwgAECIAESMAEgAAAAMIABAiABEjABIBAwABAQMAAQMIABciABgjABkAAAADCAAXIgAYIwAZAQMAAQEDAAEDCAAeIgAfIwAgAAAAAwgAHiIAHyMAIAAAAAMIACYiACcjACgAAAADCAAmIgAnIwAoAQMAAQEDAAEFCAAtIgAwIwAxZAAuZQAvAAAAAAAFCAAtIgAwIwAxZAAuZQAvAAAFCAA2IgA5IwA6ZAA3ZQA4AAAAAAAFCAA2IgA5IwA6ZAA3ZQA4AgYABAkABgIGAAQJAAYFCAA_IgBCIwBDZABAZQBBAAAAAAAFCAA_IgBCIwBDZABAZQBBAgYABAsAAQIGAAQLAAEFCABIIgBLIwBMZABJZQBKAAAAAAAFCABIIgBLIwBMZABJZQBKAwYABAsAAQwACAMGAAQLAAEMAAgFCABRIgBUIwBVZABSZQBTAAAAAAAFCABRIgBUIwBVZABSZQBTEAIBESUBEigBEykBFCoBFiwBFy4MGC8NGTEBGjMMGzQOHjUBHzYBIDcMJDoPJTsTJjwCJz0CKD4CKT8CKkACK0ICLEQMLUUULkcCL0kMMEoVMUsCMkwCM00MNFAWNVEaNlIDN1MDOFQDOVUDOlYDO1gDPFoMPVsbPl0DP18MQGAcQWEDQmIDQ2MMRGYdRWchRmkiR2oiSG0iSW4iSm8iS3EiTHMMTXQjTnYiT3gMUHkkUXoiUnsiU3wMVH8lVYABKVaCAQRXgwEEWIUBBFmGAQRahwEEW4kBBFyLAQxdjAEqXo4BBF-QAQxgkQErYZIBBGKTAQRjlAEMZpcBLGeYATJomgEGaZsBBmqeAQZrnwEGbKABBm2iAQZupAEMb6UBM3CnAQZxqQEMcqoBNHOrAQZ0rAEGda0BDHawATV3sQE7eLIBBXmzAQV6tAEFe7UBBXy2AQV9uAEFfroBDH-7ATyAAb0BBYEBvwEMggHAAT2DAcEBBYQBwgEFhQHDAQyGAcYBPocBxwFEiAHIAQiJAckBCIoBygEIiwHLAQiMAcwBCI0BzgEIjgHQAQyPAdEBRZAB0wEIkQHVAQySAdYBRpMB1wEIlAHYAQiVAdkBDJYB3AFHlwHdAU2YAd4BCZkB3wEJmgHgAQmbAeEBCZwB4gEJnQHkAQmeAeYBDJ8B5wFOoAHpAQmhAesBDKIB7AFPowHtAQmkAe4BCaUB7wEMpgHyAVCnAfMBVg"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.4.1",
  engine: "55ae170b1ced7fc6ed07a15f110549408c501bb3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  TutorProfile: "TutorProfile",
  Category: "Category",
  TutorCategory: "TutorCategory",
  Booking: "Booking",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  isActive: "isActive"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  hourlyRate: "hourlyRate",
  experience: "experience",
  rating: "rating",
  totalReviews: "totalReviews",
  availability: "availability",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  icon: "icon",
  createdAt: "createdAt"
};
var TutorCategoryScalarFieldEnum = {
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  scheduledAt: "scheduledAt",
  duration: "duration",
  totalPrice: "totalPrice",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  trustedOrigins: [
    "http://localhost:3000",
    "https://skillbridge-grow.vercel.app"
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      partitioned: true
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        input: false
      }
    }
  }
});

// src/routes/index.ts
import express7 from "express";

// src/modules/user/user.route.ts
import express from "express";

// src/modules/user/user.service.ts
var getMe = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      image: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          bio: true,
          hourlyRate: true,
          experience: true,
          rating: true,
          totalReviews: true,
          availability: true,
          categories: {
            include: { category: true }
          }
        }
      }
    }
  });
};
var userService = {
  getMe
};

// src/modules/user/user.controller.ts
var getMe2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await userService.getMe(user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch user",
      details: e
    });
  }
};
var UserController = {
  getMe: getMe2
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      const user = session.user;
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned!"
        });
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resource!"
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/modules/user/user.route.ts
var router = express.Router();
router.get(
  "/me",
  auth_default("student" /* STUDENT */, "tutor" /* TUTOR */, "admin" /* ADMIN */),
  UserController.getMe
);
var userRouter = router;

// src/modules/tutor/tutor.router.ts
import express2 from "express";

// src/modules/tutor/tutor.service.ts
init_paginationSortingHelper();
var getMyProfile = async (userId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      categories: { include: { category: true } }
    }
  });
  return tutor;
};
var getAllTutors = async (query) => {
  const { search, categoryId, minPrice, maxPrice, minRating } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(query);
  const andConditions = [{ user: { isActive: true } }];
  if (search) {
    andConditions.push({
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { bio: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  if (categoryId) {
    andConditions.push({
      categories: { some: { categoryId: Number(categoryId) } }
    });
  }
  if (minPrice || maxPrice) {
    andConditions.push({
      hourlyRate: {
        ...minPrice && { gte: Number(minPrice) },
        ...maxPrice && { lte: Number(maxPrice) }
      }
    });
  }
  if (minRating) {
    andConditions.push({ rating: { gte: Number(minRating) } });
  }
  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where: { AND: andConditions },
      include: {
        user: { select: { id: true, name: true, image: true } },
        categories: { include: { category: true } }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    }),
    prisma.tutorProfile.count({ where: { AND: andConditions } })
  ]);
  return {
    data: tutors,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var getTutorById = async (tutorId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: Number(tutorId) },
    include: {
      user: { select: { id: true, name: true, image: true, createdAt: true } },
      categories: { include: { category: true } },
      reviews: {
        include: {
          student: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });
  if (!tutor) {
    throw new Error("Tutor not found!");
  }
  return tutor;
};
var updateProfile = async (userId, data) => {
  const { categoryIds, ...profileData } = data;
  const tutor = await prisma.tutorProfile.upsert({
    where: { userId },
    create: { userId, hourlyRate: profileData.hourlyRate ?? 0, ...profileData },
    update: profileData
  });
  if (categoryIds !== void 0) {
    await prisma.tutorCategory.deleteMany({
      where: { tutorProfileId: tutor.id }
    });
    if (categoryIds.length > 0) {
      await prisma.tutorCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorProfileId: tutor.id,
          categoryId
        })),
        skipDuplicates: true
      });
    }
  }
  return await prisma.tutorProfile.findUnique({
    where: { id: tutor.id },
    include: { categories: { include: { category: true } } }
  });
};
var updateAvailability = async (userId, availability) => {
  return await prisma.tutorProfile.update({
    where: { userId },
    data: { availability }
  });
};
var tutorService = {
  getMyProfile,
  getAllTutors,
  getTutorById,
  updateProfile,
  updateAvailability
};

// src/modules/tutor/tutor.controller.ts
var getMyProfile2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized!" });
    const result = await tutorService.getMyProfile(user.id);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const result = await tutorService.getAllTutors(req.query);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch tutors", details: e });
  }
};
var getTutorById2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorById(tutorId);
    res.status(200).json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Failed to fetch tutor";
    res.status(400).json({ error: errorMessage, details: e });
  }
};
var updateProfile2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await tutorService.updateProfile(user.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var updateAvailability2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await tutorService.updateAvailability(
      user.id,
      req.body.availability
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var TutorController = {
  getMyProfile: getMyProfile2,
  getAllTutors: getAllTutors2,
  getTutorById: getTutorById2,
  updateProfile: updateProfile2,
  updateAvailability: updateAvailability2
};

// src/modules/tutor/tutor.router.ts
var router2 = express2.Router();
router2.get("/profile/me", auth_default("tutor" /* TUTOR */), TutorController.getMyProfile);
router2.put("/profile/me", auth_default("tutor" /* TUTOR */), TutorController.updateProfile);
router2.put(
  "/availability/me",
  auth_default("tutor" /* TUTOR */),
  TutorController.updateAvailability
);
router2.get("/", TutorController.getAllTutors);
router2.get("/:tutorId", TutorController.getTutorById);
var tutorRouter = router2;

// src/modules/category/category.router.ts
import express3 from "express";

// src/modules/category/category.service.ts
var getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tutors: true } } }
  });
};
var createCategory = async (data) => {
  return await prisma.category.create({ data });
};
var updateCategory = async (categoryId, data) => {
  return await prisma.category.update({
    where: { id: categoryId },
    data
  });
};
var deleteCategory = async (categoryId) => {
  return await prisma.category.delete({
    where: { id: categoryId }
  });
};
var categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch categories", details: e });
  }
};
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategory(
      Number(categoryId),
      req.body
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.deleteCategory(Number(categoryId));
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var CategoryController = {
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.router.ts
var router3 = express3.Router();
router3.get("/", CategoryController.getAllCategories);
router3.post("/", auth_default("admin" /* ADMIN */), CategoryController.createCategory);
router3.put(
  "/:categoryId",
  auth_default("admin" /* ADMIN */),
  CategoryController.updateCategory
);
router3.delete(
  "/:categoryId",
  auth_default("admin" /* ADMIN */),
  CategoryController.deleteCategory
);
var categoryRouter = router3;

// src/modules/booking/booking.router.ts
import express4 from "express";

// src/modules/booking/booking.service.ts
var bookingInclude = {
  student: { select: { id: true, name: true, image: true } },
  tutorProfile: {
    include: {
      user: { select: { id: true, name: true, image: true } }
    }
  }
};
function timeStringToMinutes(time) {
  const parts = time.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  return h * 60 + m;
}
var createBooking = async (data) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: data.tutorProfileId }
  });
  if (!tutor) throw new Error("Tutor not found!");
  const availability = tutor.availability;
  if (availability && availability.length > 0) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const bookingDay2 = data.bookingDay ?? dayNames[data.scheduledAt.getDay()] ?? "Unknown";
    const dayAvailability = availability.find(
      (a) => a.day.toLowerCase() === bookingDay2.toLowerCase()
    );
    if (!dayAvailability) {
      throw new Error(`Tutor is not available on ${bookingDay2}`);
    }
    const bookingStartMinutes2 = data.startTime ? timeStringToMinutes(data.startTime) : data.scheduledAt.getHours() * 60 + data.scheduledAt.getMinutes();
    const bookingEndMinutes2 = bookingStartMinutes2 + data.duration;
    const [fromH = 0, fromM = 0] = dayAvailability.from.split(":").map(Number);
    const [toH = 23, toM = 59] = dayAvailability.to.split(":").map(Number);
    const availableFrom = fromH * 60 + fromM;
    const availableTo = toH * 60 + toM;
    if (bookingStartMinutes2 < availableFrom || bookingEndMinutes2 > availableTo) {
      throw new Error(
        `Tutor is only available from ${dayAvailability.from} to ${dayAvailability.to} on ${bookingDay2}`
      );
    }
  }
  const bookingStartMinutes = data.startTime ? timeStringToMinutes(data.startTime) : data.scheduledAt.getHours() * 60 + data.scheduledAt.getMinutes();
  const bookingEndMinutes = bookingStartMinutes + data.duration;
  const startOfDay = new Date(data.scheduledAt);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(data.scheduledAt);
  endOfDay.setHours(23, 59, 59, 999);
  const existingBookings = await prisma.booking.findMany({
    where: {
      tutorProfileId: data.tutorProfileId,
      status: "confirmed",
      scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
  });
  for (const existing of existingBookings) {
    const existingStart = existing.scheduledAt.getHours() * 60 + existing.scheduledAt.getMinutes();
    const existingEnd = existingStart + existing.duration;
    if (bookingStartMinutes < existingEnd && bookingEndMinutes > existingStart) {
      throw new Error("This time slot is already booked. Please choose a different time.");
    }
  }
  const totalPrice = Math.round(tutor.hourlyRate / 60 * data.duration * 100) / 100;
  const { startTime, bookingDay, ...bookingData } = data;
  return await prisma.booking.create({
    data: { ...bookingData, totalPrice, status: "confirmed" },
    include: bookingInclude
  });
};
var getMyBookings = async (userId, role) => {
  const where = role === "student" ? { studentId: userId } : { tutorProfile: { userId } };
  return await prisma.booking.findMany({
    where,
    include: { ...bookingInclude, review: true },
    orderBy: { scheduledAt: "desc" }
  });
};
var getBookingById = async (bookingId, userId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { ...bookingInclude, review: true }
  });
  if (!booking) throw new Error("Booking not found!");
  const isStudent = booking.studentId === userId;
  const isTutor = booking.tutorProfile.userId === userId;
  if (!isStudent && !isTutor)
    throw new Error("You are not authorized to view this booking!");
  return booking;
};
var updateStatus = async (bookingId, userId, role, status) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { tutorProfile: true }
  });
  if (role === "student") {
    if (booking.studentId !== userId) throw new Error("Forbidden!");
    if (status !== "cancelled")
      throw new Error("Students can only cancel bookings!");
  }
  if (role === "tutor") {
    if (booking.tutorProfile.userId !== userId) throw new Error("Forbidden!");
    if (status !== "completed")
      throw new Error("Tutors can only mark bookings as completed!");
  }
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: bookingInclude
  });
};
var getAllBookings = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = (init_paginationSortingHelper(), __toCommonJS(paginationSortingHelper_exports)).default(query);
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      include: bookingInclude,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    }),
    prisma.booking.count()
  ]);
  return {
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateStatus,
  getAllBookings
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await bookingService.createBooking({
      studentId: user.id,
      tutorProfileId: Number(req.body.tutorProfileId),
      scheduledAt: new Date(req.body.scheduledAt),
      duration: Number(req.body.duration),
      startTime: req.body.startTime,
      bookingDay: req.body.bookingDay
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
var getMyBookings2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await bookingService.getMyBookings(user.id, user.role);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch bookings", details: e });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const { bookingId } = req.params;
    const result = await bookingService.getBookingById(
      Number(bookingId),
      user.id
    );
    res.status(200).json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Failed to fetch booking";
    res.status(400).json({ error: errorMessage, details: e });
  }
};
var updateStatus2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const { bookingId } = req.params;
    const { status } = req.body;
    const result = await bookingService.updateStatus(
      Number(bookingId),
      user.id,
      user.role,
      status
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var BookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings2,
  getBookingById: getBookingById2,
  updateStatus: updateStatus2
};

// src/modules/booking/booking.router.ts
var router4 = express4.Router();
router4.post("/", auth_default("student" /* STUDENT */), BookingController.createBooking);
router4.get(
  "/",
  auth_default("student" /* STUDENT */, "tutor" /* TUTOR */, "admin" /* ADMIN */),
  BookingController.getMyBookings
);
router4.get(
  "/:bookingId",
  auth_default("student" /* STUDENT */, "tutor" /* TUTOR */, "admin" /* ADMIN */),
  BookingController.getBookingById
);
router4.patch(
  "/:bookingId/status",
  auth_default("student" /* STUDENT */, "tutor" /* TUTOR */, "admin" /* ADMIN */),
  BookingController.updateStatus
);
var bookingRouter = router4;

// src/modules/review/review.router.ts
import express5 from "express";

// src/modules/review/review.service.ts
var createReview = async (data) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: data.bookingId },
    include: { review: true }
  });
  if (booking.studentId !== data.studentId) {
    throw new Error("You are not authorized to review this booking!");
  }
  if (booking.status !== "completed") {
    throw new Error("You can only review completed bookings!");
  }
  if (booking.review) {
    throw new Error("You have already reviewed this booking!");
  }
  const review = await prisma.review.create({
    data: {
      bookingId: data.bookingId,
      studentId: data.studentId,
      tutorProfileId: booking.tutorProfileId,
      rating: data.rating,
      comment: data.comment ?? null
    }
  });
  const stats = await prisma.review.aggregate({
    where: { tutorProfileId: booking.tutorProfileId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  await prisma.tutorProfile.update({
    where: { id: booking.tutorProfileId },
    data: {
      rating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
      totalReviews: stats._count.rating
    }
  });
  return review;
};
var getTutorReviews = async (tutorProfileId) => {
  return await prisma.review.findMany({
    where: { tutorProfileId },
    include: {
      student: { select: { id: true, name: true, image: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var reviewService = {
  createReview,
  getTutorReviews
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await reviewService.createReview({
      bookingId: Number(req.body.bookingId),
      studentId: user.id,
      rating: Number(req.body.rating),
      comment: req.body.comment
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
var getTutorReviews2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await reviewService.getTutorReviews(Number(tutorId));
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch reviews", details: e });
  }
};
var ReviewController = {
  createReview: createReview2,
  getTutorReviews: getTutorReviews2
};

// src/modules/review/review.router.ts
var router5 = express5.Router();
router5.post("/", auth_default("student" /* STUDENT */), ReviewController.createReview);
router5.get("/tutor/:tutorId", ReviewController.getTutorReviews);
var reviewRouter = router5;

// src/modules/admin/admin.router.ts
import express6 from "express";

// src/modules/admin/admin.service.ts
init_paginationSortingHelper();
var getAllUsers = async (query) => {
  const { role } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(query);
  const where = {};
  if (role) where.role = role;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        tutorProfile: {
          select: { rating: true, totalReviews: true, hourlyRate: true }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};
var updateUserStatus = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...data.isActive !== void 0 && { isActive: data.isActive },
      ...data.role !== void 0 && { role: data.role }
    },
    select: { id: true, name: true, email: true, role: true, isActive: true }
  });
};
var getStats = async () => {
  const [
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalReviews
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "tutor" } }),
    prisma.user.count({ where: { role: "student" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.review.count()
  ]);
  return {
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalReviews
  };
};
var adminService = {
  getAllUsers,
  updateUserStatus,
  getStats
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch users", details: e });
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (user?.id === userId) {
      return res.status(400).json({ message: "You cannot modify your own account!" });
    }
    const { isActive, role } = req.body;
    const result = await adminService.updateUserStatus(userId, {
      isActive,
      role
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const result = await bookingService.getAllBookings(req.query);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch bookings", details: e });
  }
};
var getStats2 = async (req, res) => {
  try {
    const result = await adminService.getStats();
    res.status(200).json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Failed to fetch stats";
    res.status(400).json({ error: errorMessage, details: e });
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllBookings: getAllBookings2,
  getStats: getStats2
};

// src/modules/admin/admin.router.ts
var router6 = express6.Router();
router6.get("/users", auth_default("admin" /* ADMIN */), AdminController.getAllUsers);
router6.patch(
  "/users/:userId",
  auth_default("admin" /* ADMIN */),
  AdminController.updateUserStatus
);
router6.get("/bookings", auth_default("admin" /* ADMIN */), AdminController.getAllBookings);
router6.get("/stats", auth_default("admin" /* ADMIN */), AdminController.getStats);
var adminRouter = router6;

// src/routes/index.ts
var router7 = express7.Router();
router7.use("/users", userRouter);
router7.use("/tutors", tutorRouter);
router7.use("/categories", categoryRouter);
router7.use("/bookings", bookingRouter);
router7.use("/reviews", reviewRouter);
router7.use("/admin", adminRouter);
var routes_default = router7;

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field type or missing fields!";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Record not found.";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. Please check your credentials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof Error) {
    statusCode = 400;
    errorMessage = err.message;
  }
  res.status(statusCode).json({
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/app.ts
var app = express8();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://skillbridge-grow.vercel.app"
    ],
    credentials: true
  })
);
app.use(express8.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", routes_default);
app.get("/", (req, res) => {
  res.send("SkillBridge API is running \u{1F393}");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database Successfully");
    app_default.listen(PORT, () => {
      console.log(`SkillBridge API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("An error occurred");
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map