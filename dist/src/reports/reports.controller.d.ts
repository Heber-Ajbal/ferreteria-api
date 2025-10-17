import { ReportsService } from './reports.service';
import { GetMovementsDto } from './dto/get-movements.dto';
export declare class ReportsController {
    private readonly service;
    constructor(service: ReportsService);
    movements(q: GetMovementsDto): Promise<{
        movement_id: number;
        product_id: number;
        movement_type: string;
        reference_type: string;
        reference_id: number;
        qty_signed: number;
        unit_cost: number | null;
        unit_price: number | null;
        notes: string | null;
        created_at: Date;
    }[]>;
}
