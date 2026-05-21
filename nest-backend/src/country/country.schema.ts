import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CountryDocument = HydratedDocument<Country>

@Schema()
export class Country {
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    name: Record<string, any>;

    @Prop({required: true, unique: true, type: String})
    code: string;

    @Prop({required: true, type: String})
    nativeName: string;

    @Prop({type: String, required: false})
    flag: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);