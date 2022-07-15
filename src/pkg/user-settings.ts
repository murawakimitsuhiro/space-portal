import { chromeStorageAccess, ChromeStorageAccesser } from "./util/chrome-storage-promise";

export class UserSettings {
    static currentProjetName: ChromeStorageAccesser<string> = chromeStorageAccess('selected_project_id')
    static spaceGDriveId: ChromeStorageAccesser<string> = chromeStorageAccess('space_googledrive_folder_id')
}
