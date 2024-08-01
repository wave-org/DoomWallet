import {defaultInstance} from '../database';

const versionKey = 'version';
const currentVersion = '0.3';
let previousVersion: string | undefined;

type SetLoadingMessage = (message: string) => void;
type UpgradeFunction = (setLoadingMessage: SetLoadingMessage) => Promise<void>;
type UpgradeTask = {
  taskID: string;
  version: string;
  upgradeFunction: UpgradeFunction;
};

const upgradeTasks: UpgradeTask[] = [];
// Add a task to upgrade
export const addUpgradeTask = (task: UpgradeTask) => {
  upgradeTasks.push(task);
};

export const getPreviousVersion = () => {
  return previousVersion;
};

export const needUpgrade = () => {
  previousVersion = defaultInstance.getString(versionKey);
  return previousVersion !== currentVersion;
};

const checkTaskFinished = (taskID: string) => {
  return defaultInstance.getBool('upgradeTask-' + taskID) === true;
};

const setTaskFinished = (taskID: string) => {
  defaultInstance.setBool('upgradeTask-' + taskID, true);
};

export const upgrade = async (setLoadingMessage: SetLoadingMessage) => {
  for (const task of upgradeTasks) {
    if (
      previousVersion &&
      task.version > previousVersion &&
      !checkTaskFinished(task.taskID)
    ) {
      await task.upgradeFunction(setLoadingMessage);
      setTaskFinished(task.taskID);
    }
  }
  defaultInstance.setString(versionKey, currentVersion);
};
