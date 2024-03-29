import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { HospitalDto, updateHospitalDto } from "../dto/hospital.dto";
import { BloodBankService } from "../services/bloodBank.service";
import { HospitalService } from "../services/hospital.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService,
    private bloodBankService: BloodBankService) {}

  @Get('all')
  getHospital() {
    return this.hospitalService.getHospital();
  }
  @Get('getHospital/:id')
  getHospitalById(@Param('id', ParseIntPipe) id: string) {
    return this.hospitalService.getHospitalById(+id);
  }

  @Get('findHospital')
  getHospitalByIdName(@Query() qry:any): any {
    return this.hospitalService.getHospitalByIdName(qry);
   }

  @Post('/insertHospital')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  insertHospital(@Body(new ValidationPipe()) mydto: HospitalDto): any{
    return this.hospitalService.insertHospital(mydto);
  }

  @Get('countHospital')
  getCountHospital()
  {
    return this.hospitalService.getCountHospital();
  }

  @Put('/updateHospital/:id')
  //@UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  updateHospitalById(
    @Body(new ValidationPipe()) mydto: updateHospitalDto,
    @Param('id', ParseIntPipe) id: number,
  ): any {
    return this.hospitalService.updateHospitalById(mydto, id);
  }
   @Patch('/updateHospitalPat/:id')
  // @UsePipes(new ValidationPipe())
  updateHospitalPat(@Param('id') id: string, @Body(new ValidationPipe()) hospitalDto: updateHospitalDto) {
    return this.hospitalService.updateHospitalPat(hospitalDto, id);
   }

  @Delete('/rmvHospital/:id')
  removeHospitalById(@Param('id', ParseIntPipe) id: string):any {
    return this.hospitalService.removeHospitalById(+id);
  }

  // @Get('findHospitalByBank/:id')
  // getHospitalByBankId(@Param('id', ParseIntPipe) id: number): any {
  //     return this.bloodBankService.getHospitalByBankId(id);
  //   }
  @Get('/findBankByhospital/:id')
  getBankByhospitalId(@Param('id', ParseIntPipe) id: number): any {
    return this.hospitalService.getBankByhospitalId(id);
  }

}