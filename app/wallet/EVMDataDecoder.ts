import {
  ABIDatabase,
  EVMInputDataDecoder,
  FunctionData,
  FunctionHeader,
  FunctionSignature,
} from '@doomjs/evm-data-decoder';
import {evmABIInstance} from '../util/database';

export const EVMDataDecoder = new EVMInputDataDecoder();

let inited = false;
const headersKey = 'ABI-Headers';
const dataKey = 'ABI-Data';

class ABIStorage implements ABIDatabase {
  async loadAllFunctionHeaders(): Promise<FunctionHeader[]> {
    const headers: FunctionHeader[] = evmABIInstance.getArray(headersKey) || [];
    return headers;
  }

  async saveFunctionHeaders(headers: FunctionHeader[]): Promise<void> {
    const allHeaders: FunctionHeader[] =
      evmABIInstance.getArray(headersKey) || [];
    allHeaders.push(...headers);
    await evmABIInstance.setArray(headersKey, allHeaders);
  }

  async saveFunctionData(data: FunctionData[]): Promise<void> {
    data.forEach(d => {
      evmABIInstance.setString(`${dataKey}-${d.signature}`, d.data);
    });
  }

  async getFunctionData(signature: FunctionSignature): Promise<string | null> {
    return evmABIInstance.getString(`${dataKey}-${signature}`) || null;
  }

  async reomveAllData(): Promise<void> {
    evmABIInstance.clearAll();
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
