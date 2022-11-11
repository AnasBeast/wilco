import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ContributionDocument = Contribution & Document;

@Schema({ timestamps: true })
export class Contribution {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_posts: number;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
