/* eslint-disable no-var */
import type { PrismaClient } from "@prisma/client";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
    interface Locals {
      user?: {
        userID: string;
        username: string;
      };
    }
  }
  var prisma: PrismaClient;
}

export {};
