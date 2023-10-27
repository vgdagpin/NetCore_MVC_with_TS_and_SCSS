import { $temp } from "./modules/test";

class Site {
    Action: string;
    Controller: string;
    Area: string;
    IsSeparator: boolean;
    Name: string;
    Attributes: any;
    NavigationType: NavigationType;
    Url: string;
}

enum NavigationType {
    None = 0,
    InternalUrl = 1,
    ExternalUrl = 2,
    Job = 3
}