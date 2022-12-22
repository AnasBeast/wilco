import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Pilot_Roles {
    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    role_id: number;
}

export const PilotRolesSchema = SchemaFactory.createForClass(Pilot_Roles);

PilotRolesSchema.virtual("role", {
    ref: 'Role',
    localField: 'role_id',
    foreignField: 'id',
    justOne: true,
})