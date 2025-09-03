const { verify } = require('../utils/jwt');
function requireAuth(roles=[]){
  return (req,res,next)=>{
    try{
      const token = (req.headers.authorization||'').replace('Bearer ',''); if(!token) return res.status(401).json({error:'No token'});
      const user = verify(token); if(roles.length && !roles.includes(user.rol)) return res.status(403).json({error:'Forbidden'});
      req.user = user; next();
    }catch(e){ return res.status(401).json({error:'Invalid token'}); }
  }
}
module.exports = { requireAuth };
