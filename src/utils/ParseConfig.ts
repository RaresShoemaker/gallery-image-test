import Parse from 'parse';

interface ParseConfig {
  appId: string;
  serverURL: string;
  javascriptKey: string;
}

if (!import.meta.env.VITE_APPLICATION_ID || 
    !import.meta.env.VITE_HOST_URL || 
    !import.meta.env.VITE_JS_KEY) {
  throw new Error('Missing required Parse configuration environment variables');
}

const config: ParseConfig = {
  appId: import.meta.env.VITE_APPLICATION_ID,
  serverURL: import.meta.env.VITE_HOST_URL,
  javascriptKey: import.meta.env.VITE_JS_KEY,
};

Parse.initialize(config.appId, config.javascriptKey);
Parse.serverURL = config.serverURL;

export default Parse;