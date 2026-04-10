const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', async (req,res) => {
  try { const {type,status,search}=req.query; const q={};
    if(type) q.type=type; if(status) q.status=status; if(search) q.title={$regex:search,$options:'i'};
    const data = await Event.find(q).populate('createdBy','name').sort({startDate:1}); res.json({success:true,count:data.length,data}); }
  catch(e){res.status(500).json({success:false,message:e.message});}
});
router.get('/upcoming', async (req,res) => { try { const data=await Event.find({startDate:{$gte:new Date()},status:{$ne:'Cancelled'}}).sort({startDate:1}).limit(5); res.json({success:true,data}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.get('/:id', async (req,res) => { try { const d=await Event.findById(req.params.id); if(!d) return res.status(404).json({success:false,message:'Not found'}); res.json({success:true,data:d}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.post('/', async (req,res) => { try { const d=await Event.create({...req.body,createdBy:req.user._id}); res.status(201).json({success:true,data:d}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.put('/:id', async (req,res) => { try { const d=await Event.findByIdAndUpdate(req.params.id,req.body,{new:true}); if(!d) return res.status(404).json({success:false,message:'Not found'}); res.json({success:true,data:d}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.delete('/:id', async (req,res) => { try { await Event.findByIdAndDelete(req.params.id); res.json({success:true,message:'Deleted'}); } catch(e){res.status(500).json({success:false,message:e.message});} });
module.exports = router;
