const db = require('../DB/db-connection')

exports.loginFunction= async (req,res)=>{
    const {email,password}=req.body;

    const sql='select * from usertest where email=? and password=?'

    db.query(sql,[email,password],(err,results)=>{
        if(err){ 
            console.error(err)
            return res.status(500).json({message:"error occured"})
        }
        
        if(results.length>0){
            req.session.user=results[0]
            res.json({message:`Logged 🎉`})
        }
        else{
            console.log(err)
            res.status(401).json({message:"error credentials"})
        }
    })
    
}


exports.registerFunction=async (req,res)=>{

    const {name,email,password}=req.body

    const sqlCheck=`select * from usertest where email=?`
    db.query(sqlCheck,[email],(err,results)=>{
        if(err) return res.json(
           { message:"error occured"})
        
        if(results.length>0){
            return res.status(403).josn({
                message:"email alreasy registered"
            })
        }
        else{
            const sqlInsert='insert into usertest(name,email,password,role) values(?,?,?,?)'
            db.query(sqlInsert,[name,email,password,'user'],(err,results)=>{
                if(err) return res.send("error sving user")
                if(results===0){
                   return res.json(
                    {message:'user registered successfully ! 🎉'})
                }
                else{
                    return res.json(
                        {message:"email email alreasy registered, go for login "})
                }
            })
        }


    })

}

exports.forgetPassFunction=async (req,res)=>{
    const {email}=req.body

    const sqlcheckPass='select * from usertest where email=?'
    db.query(sqlcheckPass,[email],(err,results)=>{
        if(err) return res.json({
            message:"email not found"})
        
        if(results.length==0){
             return res.status(404).send('this email is not registered before')
        }
        else{
            res.send("email found successfully, u can now change ur password")
        }
    })
}

 exports.resetPassFunction=async (req,res)=>{
    const {email,newpassword}=req.body;

    const sqlUpdate='update usertest set password=? where email=?'

    db.query(sqlUpdate,[newpassword,email],(err,results)=>{
        if(err) return res.json({
            message:"error occured!"})
        
        if(results.affectedRows===0){
            res.status(404).json ({
               message :'error resetting password'})
        }
        return res.json({
            message:'password updated successfully!'})
    })
}


exports.getProfile=async (req,res)=>{
    if(req.session.user){ 
        res.json({
            message:`Hi ${req.session.user.name} with email ${req.session.user.email} 🤞`} )
    }
    else{res.status(401).json({
        message:"return to login"
    })}
}