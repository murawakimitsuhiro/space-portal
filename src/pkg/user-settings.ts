import { chromeStorageAccess, ChromeStorageAccesser } from "./uitl/chrome-storage-promise";

export class UserSettings {
    static currentProjetName: ChromeStorageAccesser<string> = chromeStorageAccess('selected_project_id')
}
