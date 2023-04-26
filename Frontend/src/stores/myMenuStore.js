import { writable } from "svelte/store"

export const myMenu = writable(1)

export const postOptionsObj = writable({ poOn: false, draw: false });