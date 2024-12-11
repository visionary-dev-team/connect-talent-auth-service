import { Controller, Get, Res } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { FastifyReply } from "fastify";

@Controller("health")
export class HealthController {
  @Get()
  run(@Res() res: FastifyReply) {
    res.setCookie('example', 'value', {
      httpOnly: true,
      secure: false, // Cambia a true en producción si usas HTTPS
    });
    return res.send({ message: 'Cookie set!' });
  }
  @MessagePattern({cmd:"test"})
  test(){
    console.log("auth-user-service")
   return "hola" 
  }

}
