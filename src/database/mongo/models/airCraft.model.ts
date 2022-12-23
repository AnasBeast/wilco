import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type AirCraftDocument = HydratedDocument<AirCraft>;

@Schema({ timestamps: true })
export class AirCraft {
  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number

  @ApiProperty()
  @Prop({ required: true })
  make_and_model: string;

  @ApiProperty()
  @Prop({ default: null })
  tail_number: string;

  @ApiProperty()
  @Prop({ default: null })
  picture_url?: string;

  @ApiProperty()
  @Prop()
  picture_url_key?: string;

  @ApiProperty()
  @Prop({ default: false })
  removed?: boolean;
}

export const AirCraftSchema = SchemaFactory.createForClass(AirCraft);

AirCraftSchema.virtual('pilot', {
  ref: 'Pilot',
  localField: 'pilot_id',
  foreignField: 'id'
})
