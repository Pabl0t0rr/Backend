export const registerUser = (req: any, res: any, next: any) => {
  const { email, password, username } = req.body;
  const errors = [];

  if (!email|| typeof email !== "string"){
    errors.push({field : "Email", message : "Email can not be empty or different to a string"});
  }

  if(!password || typeof password !== "string"){
  errors.push({field : "Password", message : "Password can not be empty or different to a string"});
  }

   if(!username || typeof username !== "string"){
    errors.push({field : "Username", message :"Username can not be empty or different to a string"});
   }
   
   if(errors.length > 0){
    return res.status(400).json({errors});
   }
   next();
};

export const loginUser = (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email|| typeof email !== "string"){
    errors.push({field : "Email", message : "Email can not be empty or different to a string"});
  }

  if(!password || typeof password !== "string"){
    errors.push({field : "Password", message : "Password can not be empty or different to a string"});
  }

   if(errors.length > 0){
    return res.status(400).json({errors});
   }
   next();
};