import {EVMInputDataDecoder} from 'evm-data-decoder';
import database from '../util/database';

export const EVMDataDecoder = new EVMInputDataDecoder();

let inited = false;
const ABIKey = 'EVM-ABI';

class ABIStorage {
  count: number = 0;
  async saveABI(abi: string) {
    database.defaultInstance.setString(`${ABIKey}-${this.count}`, abi);
    this.count++;
    database.defaultInstance.setNumber(ABIKey, this.count);
  }

  async loadAllABI() {
    this.count = database.defaultInstance.getNumber(ABIKey) || 0;
    const abiList: string[] = [];
    for (let i = 0; i < this.count; i++) {
      let abi = database.defaultInstance.getString(`${ABIKey}-${i}`);
      if (abi) {
        abiList.push(abi);
      }
    }
    return abiList;
  }

  async deleteAllABI() {
    for (let i = 0; i < this.count; i++) {
      database.defaultInstance.delete(`${ABIKey}-${i}`);
    }
    database.defaultInstance.delete(ABIKey);
    this.count = 0;
  }
}

export async function initEVMDecoder() {
  if (inited) {
    return;
  }
  inited = true;
  EVMDataDecoder.database = new ABIStorage();
  await EVMDataDecoder.loadAllABI();
}
