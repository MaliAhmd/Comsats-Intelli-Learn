const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try{
        const authorizationHeader = req.get('Authorization');
        if (!authorizationHeader) {
          return res.status(401).json({
            message: 'Please login!',
            messages: Error,
          });
        }
    
        const [bearer, token] = authorizationHeader.split(' ');
    
        if (bearer !== 'Bearer' || !token) {
          return res.status(401).json({
            message: 'Invalid authorization format',
          });
        }
        const decode = await jwt.verify(token,'Comsats_Intelli-learn')
        req.user = await decode
        next()
        
    }catch(err){
        res.status(401).json({
            success:false,
            message:err.message,
        })
    }
};
