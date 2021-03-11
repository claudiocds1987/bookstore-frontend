export interface Order {
    id_order: number;
    id_user: number;
    adress: string;
    phone_number: string;
    total_price: number;
    provincia: string;
    localidad: string;
    order_date: Date;
}
