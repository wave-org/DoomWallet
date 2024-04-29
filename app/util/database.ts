import {MMKV} from 'react-native-mmkv';
import jsonbig from './jsonbig';

export class MMKVInstance {
  instance: MMKV;
  constructor(instance: MMKV) {
    this.instance = instance;
  }

  public setArray = (key: string, value: Array<any>) => {
    let json = jsonbig.stringify(value);
    this.instance.set(key, json);
  };

  public getArray = <T>(key: string) => {
    let json = this.instance.getString(key);
    if (json === undefined) {
      return undefined;
    }
    return jsonbig.parse(json) as T[];
  };

  public setObject = (key: string, value: object) => {
    let json = jsonbig.stringify(value);
    this.instance.set(key, json);
  };

  public getObject = <T>(key: string) => {
    let json = this.instance.getString(key);
    if (json === undefined) {
      return undefined;
    }
    return jsonbig.parse(json) as T;
  };

  public setString = (key: string, value: string) => {
    this.instance.set(key, value);
  };
  public setBool = (key: string, value: boolean) => {
    this.instance.set(key, value);
  };
  public setNumber = (key: string, value: number) => {
    this.instance.set(key, value);
  };
  public getString = (key: string) => {
    return this.instance.getString(key);
  };
  public getBool = (key: string) => {
    return this.instance.getBoolean(key);
  };
  public getNumber = (key: string) => {
    return this.instance.getNumber(key);
  };

  public delete = (key: string) => {
    this.instance.delete(key);
  };

  public clearAll = () => {
    this.instance.clearAll();
  };
}
const defaultInstance = new MMKVInstance(new MMKV());

const dbVersion = 1;
const dbVersionKey = 'dbversion';

// true means need migrate data
const checkIfNeedtoMigrateData = () => {
  const version = defaultInstance.getNumber(dbVersionKey);
  if (version === undefined) {
    defaultInstance.setNumber(dbVersionKey, dbVersion);
    return false;
  }
  return version !== dbVersion;
};

const clearAll = async () => {
  await defaultInstance.clearAll();
};

const migrateData = async () => {
  // TODO
  return;
};

export default {
  defaultInstance,
  checkIfNeedtoMigrateData,
  migrateData,
  clearAll,
};
