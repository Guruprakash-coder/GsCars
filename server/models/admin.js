const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // This ensures no two admins can have the same name
  },
  password: { 
    type: String, 
    required: true 
  }
});
module.exports=mongoose.model('Admin',adminSchema);