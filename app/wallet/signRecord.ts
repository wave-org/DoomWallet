import {defaultInstance} from '../util/database';
import {
  RequestType,
  EIP1559TransactionDetail,
  TransactionDetail,
  SignRequest,
  BTCSignRequest,
} from 'doom-wallet-core';

const autoSaveKey = 'signs-autoSave';
let autoSave: boolean | undefined;
export const getAutoSave = () => {
  if (autoSave === undefined) {
    autoSave = defaultInstance.getBool(autoSaveKey);
  }
  if (autoSave === undefined) {
    autoSave = true;
  }
  return autoSave;
};

export const setAutoSave = (value: boolean) => {
  defaultInstance.setBool(autoSaveKey, value);
  autoSave = value;
};

const indexKey = 'signs-index';
let recordIndex: number = -1;
// Sign Record index, start from 1
// Although users may not save the sign record, we always increase the index after each sign
export const getIndex = () => {
  if (recordIndex === -1) {
    recordIndex = defaultInstance.getNumber(indexKey) || 1;
  }
  return recordIndex;
};
export const setIndex = (value: number) => {
  defaultInstance.setNumber(indexKey, value);
  recordIndex = value;
};

// return the current index and increase the index
export const increaseIndex = () => {
  const current = getIndex();
  setIndex(current + 1);
  return current;
};

export type TransactionStatus = 'pending' | 'success' | 'failed';
export type ChainType = 'BTC' | 'EVM';

export type SignRecord = BTCSignRecord | EVMSignRecord;

export type BTCSignRecord = {
  index: number;
  status: TransactionStatus;
  chainType: ChainType;

  // sgined at
  timestamp: number;

  inputTx: string;
  unsignedInputAddresses: string;
  outputTx: string;
  inputData: string;
  outputData: string;
  PSBTGlobalMap: string;
  version: number;
  locktime: number;
  fee: number;
};

export type EVMSignRecord = {
  index: number;
  status: TransactionStatus;
  chainType: ChainType;

  // sgined at
  timestamp: number;

  address: string;
  type: RequestType;
  chainID: number | undefined;
  derivationPath: string;

  // payload
  legacyTransaction: TransactionDetail | undefined;
  transaction: EIP1559TransactionDetail | undefined;
  // message:
  message: string | undefined;
  // typedData:
  typedData: object | undefined;
};

// TODO support for filter by chainType,chainID, status.
// Now, we only have one list. Page size is 20.
const allRecordsKey = 'signs-record';
export const PageSize = 20;
export const getRecordsCount = () => {
  return defaultInstance.getArray<number>(allRecordsKey)?.length || 0;
};

export const getPageCount = () => {
  return Math.ceil(getRecordsCount() / PageSize);
};

// when user sign a transaction, we create a record, increase the index and save the data.
// address of the request may be undefined, so we need to pass the derived address.
export const createEVMSignRecord = (
  request: SignRequest,
  derivedAddress: string,
): EVMSignRecord => {
  const index = increaseIndex();
  const record: EVMSignRecord = {
    index,
    status: 'pending',
    chainType: 'EVM',
    timestamp: Date.now(),
    address: derivedAddress,
    type: request.type,
    chainID: request.chainID || undefined,
    derivationPath: request.derivationPath,
    legacyTransaction:
      request.type === RequestType.legacyTransaction
        ? request.payload
        : undefined,
    transaction:
      request.type === RequestType.transaction ? request.payload : undefined,
    message:
      request.type === RequestType.personalMessage
        ? request.payload
        : undefined,
    typedData:
      request.type === RequestType.typedData ? request.payload : undefined,
  };
  addRecord(record);
  return record;
};

export const createBTCSignRecord = (request: BTCSignRequest): BTCSignRecord => {
  const index = increaseIndex();
  const record: BTCSignRecord = {
    index,
    status: 'pending',
    chainType: 'BTC',
    timestamp: Date.now(),
    inputTx: request.inputTx,
    unsignedInputAddresses: JSON.stringify(request.unsignedInputAddresses),
    outputTx: request.outputTx,
    inputData: request.inputData,
    outputData: request.outputData,
    PSBTGlobalMap: request.PSBTGlobalMap,
    version: request.version,
    locktime: request.locktime,
    fee: request.fee,
  };
  addRecord(record);
  return record;
};

// records in the allRecordsKey is sorted by descending order of the index.
export const addRecord = (record: SignRecord) => {
  const indexList = defaultInstance.getArray<number>(allRecordsKey) || [];
  defaultInstance.setArray(allRecordsKey, [record.index, ...indexList]);
  defaultInstance.setObject(`sign-${record.index}`, record);
};

export const getRecords = (page: number): SignRecord[] => {
  const indexList = defaultInstance.getArray<number>(allRecordsKey) || [];
  const start = page * PageSize;
  const end = start + PageSize;

  const records: SignRecord[] = [];
  indexList.slice(start, end).forEach(_index => {
    const record = defaultInstance.getObject<SignRecord>(`sign-${_index}`);
    if (record) {
      records.push(record);
    }
  });
  return records;
};

export const changeRecordStatus = (
  index: number,
  status: TransactionStatus,
) => {
  const record = defaultInstance.getObject<SignRecord>(`sign-${index}`);
  if (record) {
    record.status = status;
    defaultInstance.setObject(`sign-${index}`, record);
  }
};

export const deleteRecord = (index: number) => {
  const indexList = defaultInstance.getArray<number>(allRecordsKey) || [];
  const newIndexes = indexList.filter(_index => _index !== index);
  defaultInstance.setArray(allRecordsKey, newIndexes);
  defaultInstance.delete(`sign-${index}`);
};
