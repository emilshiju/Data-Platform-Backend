import express from "express"
import { handleSearch } from "../controller/searchHandle.js"
import { userLogin, userRegister } from "../controller/authentication.js"
import { verifyAccessToken } from "../services/jwtToken.js"



const router=express()



router.get('/search',verifyAccessToken,handleSearch)

router.post('/register',userRegister)

router.post('/login',userLogin)


export default router