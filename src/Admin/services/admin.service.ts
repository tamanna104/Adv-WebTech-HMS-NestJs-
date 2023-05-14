import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAdminDto, UpdateAdminDto } from "../dto/admin.dto";
import { AdminEntity } from "../entity/admin.entity";
import * as bcrypt from 'bcrypt';
//import { MailerService } from "@nestjs-modules/mailer";
import { MailerService } from "@nestjs-modules/mailer";
@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepo: Repository<AdminEntity>,
        private mailerService: MailerService
      ) {}
    
    getAdmin() {
        return this.adminRepo.find();
    }
    getAdminById(id):any {
        return this.adminRepo.findOneBy({ id });
    }

    getAdminByNameParam(name):any{
        return this.adminRepo.findBy({name})
    }
    getAdminByAge(age):any{
        return this.adminRepo.findBy({age})
    }

    getAdminByGender(gender):any{
        return this.adminRepo.findBy({gender})
    }

    async changePass(password,email):Promise<any> {
        const salt = await bcrypt.genSalt();
        const hassedpassed = await bcrypt.hash(password, salt);
        password= hassedpassed;
        console.log(email);
   
        return this.adminRepo.update({email:email},{password:password});
    }
    getProfile(email): any{
        console.log("getprofile ", email);
        return this.adminRepo.findOneBy({email:email});
    }

    getAdminByIdName(qry):any {
        return this.adminRepo.findOneBy({ id:qry.id, name:qry.name});
   }
    insertAdmin(mydto: CreateAdminDto): any{
    const adminAccount = new AdminEntity()
    adminAccount.name = mydto.name;
    adminAccount.age = mydto.age;
    adminAccount.password = mydto.password;
    adminAccount.gender = mydto.gender;
    adminAccount.address = mydto.address;
    adminAccount.email = mydto.email;
    adminAccount.contactNo = mydto.contactNo;
    return this.adminRepo.save(adminAccount);
    }

    // updateAdminById(myData:UpdateAdminDto, id): any{
    //     return this.adminRepo.update(id, {name:myData.name, age:myData.age, gender:myData.gender, address:myData.address, email:myData.email,contactNo:myData.contactNo});
    // }
    updateAdminById(myData:UpdateAdminDto, id): any{
        const adminAccount = new AdminEntity()
    adminAccount.name = myData.name;
    adminAccount.age = myData.age;
    adminAccount.gender = myData.gender;
    adminAccount.address = myData.address;
    adminAccount.email = myData.email;
    adminAccount.contactNo = myData.contactNo;
    
        return this.adminRepo.update(id,adminAccount);
    }
    updateAdminPat(myData:UpdateAdminDto, id): any{
        return this.adminRepo.update(id,myData);
    }
    
    removeAdminById(id): any{
        //return "Staff removed by Id : "+id;
        
        return this.adminRepo.delete(id);
    }

    async addUser(data): Promise<any> {
        console.log("data", data)
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword
        return this.adminRepo.save(data);
    }

    async getCountAdmin(){
        const count = await this.adminRepo.count();
        console.log(count);
        return count;
    }
    async signup(mydto:CreateAdminDto, filename: string) {
        const salt = await bcrypt.genSalt();
        const hassedpassed = await bcrypt.hash(mydto.password, salt);
        mydto.password= hassedpassed;

        const adminAccount = new AdminEntity()
        adminAccount.name = mydto.name;
        adminAccount.age = mydto.age;
        adminAccount.password = mydto.password;
        adminAccount.gender = mydto.gender;
        adminAccount.address = mydto.address;
        adminAccount.email = mydto.email;
        adminAccount.contactNo = mydto.contactNo;
        adminAccount.filename = filename;
        //console.log("service", adminAccount);
        return this.adminRepo.save(adminAccount);
    }
        async signin(mydto){
            console.log(mydto.password);
            if (mydto.email != null && mydto.password != null) {
                const mydata = await this.adminRepo.findOneBy({ email: mydto.email });
                const isMatch = await bcrypt.compare(mydto.password, mydata.password);
                if (isMatch) {
                    return true;
                }
                else {
                    return false;
                }
            } else {
                return false;
            }
        
        }
    
    getHospitalsByAdminId(id):any {
        return this.adminRepo.find({ 
                where: {id:id},
            relations: {
                hospitals: true,
            },
         });
    }

    getDoctorsByAdminId(id):any {
        return this.adminRepo.find({ 
                where: {id:id},
            relations: {
                doctors: true,
            },
         });
    }

    async sendEmail(mydata){
        return   await this.mailerService.sendMail({
               to: mydata.email,
               subject: mydata.subject,
               text: mydata.text, 
             });
       
       }
    
}