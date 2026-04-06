//import type { CapacitorConfig } from '@capacitor/cli';

/*const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'notesnap',
  webDir: 'www'
};
*/
export default config;


// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.student.notesnap',  // ← unique reverse-domain ID
  appName: 'NoteSnap',
  webDir: 'www',
};

export default config;
