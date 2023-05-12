import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { excludeProperties } from 'src/common/helper/excludeProperties';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { SerializeInterceptor } from 'src/common/interceptor/serialize.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileImageDto } from './dto/profile-image.dto';
import { fileUpload } from 'src/config/storage';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AccessTokenGuard, new PermissionGuard('create_users'))
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    if (user.id) {
      return excludeProperties(user, ['refreshToken', 'password']);
    }
  }

  @Get()
  @UseGuards(AccessTokenGuard, new PermissionGuard('list_users'))
  @UseInterceptors(new SerializeInterceptor(['password', 'refreshToken']))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, new PermissionGuard('view_users'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, new PermissionGuard('edit_users'))
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    if (user.id) {
      return excludeProperties(user, ['refreshToken', 'password']);
    }
  }

  @UseGuards(AccessTokenGuard, new PermissionGuard('delete_users'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AccessTokenGuard, new PermissionGuard('edit_users'))
  @Post('profile-image/:id')
  @ApiOperation({ summary: 'Update profile image' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async profileImage(
    @Param('id') id: number,
    @Body() data: ProfileImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    data.file = await fileUpload(file, 'users');
    return this.usersService.updateProfilePic(data, +id);
  }
}
