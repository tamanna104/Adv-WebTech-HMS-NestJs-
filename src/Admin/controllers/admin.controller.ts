import { Body, Controller, Delete, FileTypeValidator, Get, Header, MaxFileSizeValidator, 
  Param, ParseFilePipe, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors, Session,
  UsePipes, ValidationPipe, UseGuards, UnauthorizedException, Res} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { CreateAdminDto, GetAdminById, GetAdminByName, UpdateAdminDto, signinAdminDto } from "../dto/admin.dto";
import { AdminService } from "../services/admin.service";
import { HospitalService } from "../services/hospital.service";
import { SessionGuard } from "../session.guard";


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private hospitalService: HospitalService) {}

  @Get('all')
  getAdmin() {
    return this.adminService.getAdmin();
  }
  @Get('getAdmin/:id')
  getAdminById(@Param('id', ParseIntPipe) id: string) {
    return this.adminService.getAdminById(id);
  }

  @Get('getAdminByName/:name')
  getAdminByNameParam(@Param('name') name: GetAdminByName) {
    return this.adminService.getAdminByNameParam(name);
  }

  @Get('getAdminByAge/:age')
  getAdminByAge(@Param('age', ParseIntPipe) age: string) {
    return this.adminService.getAdminByAge(age);
  }

  @Get('getAdminByGender/:gender')
  getAdminByGender(@Param('gender') gender: string) {
    return this.adminService.getAdminByGender(gender);
  }

  @Get('findAdmin')
  getAdminByIdName(@Query() qry:any): any {
    return this.adminService.getAdminByIdName(qry);
   }

   @Put('/changePass/')
  //@UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  changePass(@Session() session,@Body('password') password: string): any {
    console.log(session);
    console.log(password)
     return this.adminService.changePass(password, session.email);
  }

  @Get('countAdmin')
  getCountAdmin(@Session() session)
  {
    console.log("count", session)
    return this.adminService.getCountAdmin();
  }
  
  @Get('getProfile/')
  // @UseGuards(SessionGuard)
  getProfile(@Session() session):any {
    console.log("profile", session)
    return this.adminService.getProfile(session.email);
  }
  

  @Post('/insertAdmin')
  //@UseGuards(SessionGuard)

  insertAdmin(@Body(new ValidationPipe()) mydto: CreateAdminDto): any{
    return this.adminService.insertAdmin(mydto);
  }

  @Post('/signin')
  @UsePipes(new ValidationPipe())
  async signin(@Session() sess, @Body() mydto:signinAdminDto)
  {
    const res = await (this.adminService.signin(mydto));
    console.log(res);
    if(res)
    {
      sess.email = mydto.email;
      console.log(sess)
      return (sess.email);
    }
    else
    {
      throw new UnauthorizedException({ message: "invalid credentials" });
    }
  }

  @Put('/updateAdmin/:id')
  //@UseGuards(SessionGuard)
  //@UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  updateAdminById(
    @Body(new ValidationPipe()) mydto: UpdateAdminDto,
    @Param('id', ParseIntPipe) id: number,
  ): any {
    return this.adminService.updateAdminById(mydto, id);
  }

   @Patch('/updateAdminPat/:id')
   //@UseGuards(SessionGuard)
  // @UsePipes(new ValidationPipe())
  updateAdminPat(@Param('id') id: number, @Body(new ValidationPipe()) updateAdminDto: UpdateAdminDto):any {
    return this.adminService.updateAdminPat(updateAdminDto, id);
   }
  
  
  @Delete('/rmvAdmin/:id')
  //@UseGuards(SessionGuard)
  removeAdminById(@Param('id', ParseIntPipe) id: string):any {
    console.log("id", id)
    return this.adminService.removeAdminById(+id);
  }

  @Get('findAdminByHospital/:id')
  getAdminByHospitalId(@Param('id', ParseIntPipe) id: number): any {
      return this.hospitalService.getAdminByHospitalId(id);
    }
  @Get('/findHospitalsByAdmin/:id')
  getHospitalsByAdminId(@Param('id', ParseIntPipe) id: number): any {
    return this.adminService.getHospitalsByAdminId(id);
  }

  @Get('/findDoctorsByAdmin/:id')
  getDoctorsByAdminId(@Param('id', ParseIntPipe) id: number): any {
    return this.adminService.getDoctorsByAdminId(id);
  }

  @Post("signup")
  @UseInterceptors(FileInterceptor('file',
  {storage:diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
      }
    })
  }))
  signup(@Body() body: CreateAdminDto, @UploadedFile( new ParseFilePipe(
    {
      validators: [
        new MaxFileSizeValidator({ maxSize: 16000000000 }),
        new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
      ],
    }
    ),) file: Express.Multer.File) : any{
    return this.adminService.signup(body, file.filename);
  } 

  @Get('/getimage/:name')
    getImages(@Param('name') name, @Res() res) {
      res.sendFile(name,{ root: './uploads' })
    }
  
  @Post('/sendemail')
  //@UseGuards(SessionGuard)
  @UseInterceptors(FileInterceptor('file'))
  sendEmail(@Body() mydata){
  return this.adminService.sendEmail(mydata);
  }
  @Get('/signout')
  signout(@Session() session)
  {
    console.log("session", session)
    if(session.destroy())
    {
      return {message:"you are logged out"};
    }
    else
    {
      throw new UnauthorizedException("invalid actions");
    }
  }


  // @Post('signup')
  // @UseInterceptors(FileInterceptor('profile',
  // {storage:diskStorage({
  //   destination: './uploads',
  //   filename: function (req, file, cb) {
  //     cb(null,Date.now()+file.originalname)
  //   }
  // })

  // }))
  // signup(@Body(new ValidationPipe()) mydto: CreateAdminDto, @UploadedFile(  new ParseFilePipe({
  //   validators: [
  //     new MaxFileSizeValidator({ maxSize: 16000000000 }),
  //     new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
  //   ],
  // }),) file: Express.Multer.File){

  // mydto.filename = file.filename;  

  // return this.adminService.signup(mydto);
  // console.log(file)
  // }
  
}
