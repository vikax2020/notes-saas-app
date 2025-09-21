import jwt from "jsonwebtoken"

const Token = async(id) =>{
    const tokenGen = await jwt.sign({id:id},process.env.SECKEY)
    console.log(tokenGen , "token generate")

    const tokenverify = await jwt.verify(tokenGen , process.env.SECKEY)
    console.log(tokenverify , "decoding login time") 

    return {tokenGen,tokenverify}
} 
export default Token



