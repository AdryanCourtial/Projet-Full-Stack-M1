import { Response } from "express";

class Send {
    static success(res: Response, data: any = null, message: string = "Success") {
        return res.status(200).json({ success: true, message, data });
    }

    static error(res: Response, data: any = null, message: string = "Error", status: number = 400) {
        return res.status(status).json({ success: false, message, data });
    }

    static unauthorized(res: Response, message: string = "Unauthorized") {
        return res.status(401).json({ success: false, message });
    }
}

export default Send;
