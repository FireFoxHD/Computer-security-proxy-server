import { Router } from 'express';
import 'dotenv/config';
import { getUsers, getUserbyName } from '../middleware/users.utils';

export const router = Router();

router.get('/allUsers', getUsers, (req, res) => {
  console.log('HEADER', res.header);
});

router.get('/getUserbyName/:name', getUserbyName, (req, res) => {
  if (!req.user) res.send('Not found');
  res.send(req.user);
});

/*
Susan
Aiden
Crystal
Rachel
Juliette
Melike
Annabelle
Charles
Aurora
*/

export default router;
