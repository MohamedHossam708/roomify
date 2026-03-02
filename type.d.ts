import type { promises } from "dns"

interface AuthState{
    isSignedIn:boolean,
    userName:string | null,
    userId:string | null
}

interface AuthContext{
    isSignedIn:boolean,
    userName:string | null,
    userId:string | null,
    refreshAuth:()=>promises<boolean>
    signIn:()=>promises<boolean>
    signOut:()=>promises<boolean>
}