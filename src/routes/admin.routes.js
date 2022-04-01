import { Router } from 'express';
import { getBlacklist, addToBlacklist, removeFromBlacklist } from '../middleware/ip.utils';

export const router = Router();

router.get('/blacklist', getBlacklist, (req, res) => {
  res.json(req.BLACKLIST);
});

router.post('/blockip', addToBlacklist, (req, res) => {
  res.send(`Blacklisted ${req.body.ipAddress}`);
});

router.delete('/unblockip', removeFromBlacklist, (req, res) => {
  res.send(`Removed from Blacklisted ${req.body.ipAddress}`);
});

export default router;
