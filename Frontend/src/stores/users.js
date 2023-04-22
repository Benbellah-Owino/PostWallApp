import { writable } from "svelte/store"

export const allUsers = writable([])
export const myFollowers = writable([])
export const imFollowing = writable([])