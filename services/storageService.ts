import { UserConfig } from '../types';

const CONFIG_KEY = 'meowing_morning_user_config';

export const saveUserConfig = (config: UserConfig): void => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save config", error);
  }
};

export const getUserConfig = (): UserConfig | null => {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to load config", error);
    return null;
  }
};

export const clearUserConfig = (): void => {
  localStorage.removeItem(CONFIG_KEY);
};