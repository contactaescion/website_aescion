import { PopupsService } from './popups.service';
export declare class PopupsController {
    private readonly popupsService;
    constructor(popupsService: PopupsService);
    create(file: Express.Multer.File, title: string, type: string): Promise<import("./entities/popup.entity").Popup>;
    findAll(): Promise<import("./entities/popup.entity").Popup[]>;
    findActive(): Promise<import("./entities/popup.entity").Popup[]>;
    toggleActive(id: string): Promise<import("./entities/popup.entity").Popup>;
    remove(id: string): Promise<import("./entities/popup.entity").Popup>;
}
