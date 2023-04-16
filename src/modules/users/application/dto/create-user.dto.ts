import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    files: Express.Multer.File;
}
