import { ApiProperty } from '@nestjs/swagger';

export class HelloWorldDTO{
  @ApiProperty()
  readonly isSuccess: boolean;
  @ApiProperty()
  readonly status: number; //HTTP status
  @ApiProperty()
  readonly message: string; 
  @ApiProperty()
  readonly name: string; 
  @ApiProperty()
  readonly version: string; 
  @ApiProperty()
  readonly date: Date; 
}
