import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { pool } from './database';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return await pool.connect().then(async (client) => {
      try {
        const selectQuery = {
          name: 'select-remaining',
          text: `
            select count(*) from public.mint_txns where attempted = true
            `,
        }
        var res = await pool.query(selectQuery).catch((e: any) => {
          console.log("Error selecting mints query: " + e);
          client.release();
          return 'xxxx';
        });
        const remaining = 5000 - parseInt(res.rows[0]["count"]);
        client.release();
        if (remaining <= 25) {
          return "SoldOut";
        }
        return remaining;
      } catch (e) {
        console.log("Exception selecting mints from DB: " + e);
        client.release();
        return 'xxxx';
      }
    }).catch((e: any) => {
      console.log("Error connecting to DB: " + e);
      return 'xxxx';
    });
  }

  async getTokenList(): Promise<string> {
    return await pool.connect().then(async (client) => {
      try {
        const selectQuery = {
          name: 'select-token-list',
          text: `
            select created_at from public.mints where assigned = true 
            `,
        }
        var res = await pool.query(selectQuery).catch((e: any) => {
          console.log("Error selecting mints query: " + e);
          client.release();
          return 'xxxx';
        });
        var tokenList = {"tokenList": []};
        res.rows.forEach(async (address) => {
          if (address["created_at"] != null && address["created_at"] != undefined && address["created_at"] != "") {
            tokenList.tokenList.push(address["created_at"]);
          }
        });
        client.release();
        return tokenList;
      } catch (e) {
        console.log("Exception selecting mints from DB: " + e);
        client.release();
        return 'xxxx';
      }
    }).catch((e: any) => {
      console.log("Error connecting to DB: " + e);
      return 'xxxx';
    });
  }
}
