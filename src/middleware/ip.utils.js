import { v4 } from 'uuid';
import connection from '../../dbConnection';

let BLACKLIST = [];

function getClientIp(req) {
  let ipAddress = req.connection.remoteAddress;
  if (!ipAddress) return '';
  if (ipAddress.substr(0, 7) === '::ffff:') {
    ipAddress = ipAddress.substr(7);
  }
  return ipAddress;
}

export function checkBlacklist(ipAddress) {
  connection.query(
    'SELECT * FROM blockedip WHERE ipAddress  = ?;', [ipAddress],
    (err, result) => {
      if (err) throw err;
      const isBlocked = !!result.length;
      return isBlocked;
    }
  );
}

// middleware to check if ip in blacklist
export function checkIp(req, res, next) {
  const ipAddress = getClientIp(req);
  if (ipAddress) {
    const isBlocked = checkBlacklist(ipAddress);
    if (!isBlocked) { // checks if current clients ip is on the Blacklist
      next();
    } else {
      res.send(`${ipAddress} IP is blacklisted`);
    }
  }
}

export function getBlacklist(req, res, next) {
  connection.query(
    'SELECT * FROM blockedip;', (err, result) => {
      if (err) throw err;
      result.forEach((row) => {
        BLACKLIST.push(row.ipAddress);
        BLACKLIST = [...new Set(BLACKLIST)];
      });
      req.BLACKLIST = BLACKLIST;
      next();
    }
  );
}

export function addToBlacklist(req, res, next) {
  const { ipAddress } = req.body;

  connection.query(
    'SELECT * FROM blockedip WHERE ipAddress  = ?;', [ipAddress],
    (err, result) => {
      if (err) throw err;
      const isBlocked = !!result.length;
      if (isBlocked) {
        console.log('Already Blocked');
        return next();
      }
      connection.query(
        'INSERT INTO blockedip (id, ipAddress) VALUES (?,?);', [v4(), ipAddress],
        (dberr, dbresult) => {
          if (dberr) throw dberr;
          console.log(`${dbresult.affectedRows} rows affected`);
          return next();
        }
      );
      return next();
    }
  );
}

export function removeFromBlacklist(req, res, next) {
  const { ipAddress } = req.body;
  connection.query(
    'SELECT * FROM blockedip WHERE ipAddress  = ?;', [ipAddress],
    (err, result) => {
      if (err) throw err;
      const isBlocked = !!result.length;
      if (!isBlocked) {
        console.log('Not in Blacklist');
        return next();
      }
      connection.query(
        'DELETE FROM blockedip WHERE ipAddress = ?;', [ipAddress],
        (dberr, dbresult) => {
          if (dberr) throw dberr;
          console.log(`${dbresult.affectedRows} rows affected`);
          return next();
        }
      );
      return next();
    }
  );
}
