import { DUser } from "./Type";

declare global{
    namespace Express {
        interface Request {
            user: DUser           
        }
    }
}